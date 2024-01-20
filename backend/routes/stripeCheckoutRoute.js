import express from 'express';
import dotenv from 'dotenv';
import stripe from 'stripe';
import bodyParser from 'body-parser';

const app = express();
const router = express.Router();
router.use(express.json());

dotenv.config();

const stripeApiKey = process.env.STRIPE_SECRET_TEST_KEY;
const frontendURL = process.env.FRONT_END_URL;
const stripeClient = new stripe(stripeApiKey);

const endpointSecret = process.env.WEBHOOK_SECRET;

// // Use JSON parser for all non-webhook routes
// app.use((req, res, next) => {
// 	if (req.originalUrl === '/webhook') {
// 		next();
// 	} else {
// 		bodyParser.json()(req, res, next);
// 	}
// });

app.post(
	'/webhook',
	bodyParser.raw({ type: 'application/json' }),
	(request, response) => {
		const sig = request.headers['stripe-signature'];

		let event;

		// Verify webhook signature and extract the event.
		// See https://stripe.com/docs/webhooks#verify-events for more information.
		try {
			event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
		} catch (err) {
			return response.status(400).send(`Webhook Error: ${err.message}`);
		}

		if (event.type === 'payment_intent.succeeded') {
			const paymentIntent = event.data.object;
			const connectedAccountId = event.account;
			handleSuccessfulPaymentIntent(connectedAccountId, paymentIntent);
		}

		response.json({ received: true });
	}
);

app.use(express.json());

const handleSuccessfulPaymentIntent = (connectedAccountId, paymentIntent) => {
	// Fulfill the purchase
	console.log('Connected account ID: ' + connectedAccountId);
	console.log(JSON.stringify(paymentIntent));
};

router.post('/', async (req, res) => {
	const items = req.body.items;
	const user = req.body.userData;
	let lineItems = [];

	items.forEach((item) => {
		let price = item.sale ? item.sale : item.price;

		const lineItem = {
			price_data: {
				currency: 'usd',
				product_data: {
					name: item.name,
					images: [item.image],
					description: item.description,
				},
				unit_amount: price * 100, //2 * 100 = $2 use cents
			},
			quantity: item.qty,
		};

		// Check if adjustable quantity is needed
		if (item.inventory > 1) {
			lineItem.adjustable_quantity = {
				enabled: true,
				minimum: 1,
				maximum: item.inventory,
			};
		}

		lineItems.push(lineItem);
	});

	const sessionOptions = {
		line_items: lineItems,
		automatic_tax: { enabled: true },
		billing_address_collection: 'auto',
		shipping_address_collection: {
			allowed_countries: ['US', 'CA'],
		},
		mode: 'payment',
		discounts: [
			{
				//coupon: coupon.name,
				// id: '12345',
				// currency: 'USD',
				// percent_off: 10, //amount_off
				//max_redemptions: 1,
				//redeem_by
				//applies_to
			},
		],
		invoice_creation: {
			enabled: true,
		},
		allow_promotion_codes: true,
		shipping_options: [
			{
				shipping_rate_data: {
					type: 'fixed_amount',
					fixed_amount: {
						amount: 0,
						currency: 'usd',
					},
					display_name: 'Free shipping',
					delivery_estimate: {
						minimum: {
							unit: 'business_day',
							value: 5,
						},
						maximum: {
							unit: 'business_day',
							value: 7,
						},
					},
				},
			},
			{
				shipping_rate_data: {
					type: 'fixed_amount',
					fixed_amount: {
						amount: 1500,
						currency: 'usd',
					},
					display_name: 'Overnight',
					delivery_estimate: {
						minimum: {
							unit: 'business_day',
							value: 1,
						},
						maximum: {
							unit: 'business_day',
							value: 1,
						},
					},
				},
			},
		],
		success_url: `${frontendURL}/cart/sucess`,
		cancel_url: `${frontendURL}/cart`,
	};

	// Prefill email if user is logged in
	if (user && user.email) {
		sessionOptions.customer_email = user.email;
	}

	try {
		const session = await stripeClient.checkout.sessions.create(sessionOptions);

		res.send({
			url: session.url,
		});
	} catch (error) {
		console.error('Error creating Checkout Session:', error);
		res.status(500).send('Server Error');
	}
});

export default router;
