import express from 'express';
import dotenv from 'dotenv';
import stripe from 'stripe';

const router = express.Router();

dotenv.config();

const stripeApiKey = process.env.STRIPE_SECRET_TEST_KEY;
const frontendURL = process.env.FRONT_END_URL;
const stripeClient = new stripe(stripeApiKey);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = 'whsec_puvYbVchxcqWa7ePuebh91oW9Jo6ecs4'; //'whsec_2e915ad429438ff6915b3d4b00c16bdeb73d4e26a8c35017ba880b47fb31d975';

router.post(
	'/webhook',
	express.raw({ type: 'application/json' }),
	(request, response) => {
		const sig = request.headers['stripe-signature'];

		let event;

		try {
			event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
		} catch (err) {
			response.status(400).send(`Webhook Error: ${err.message}`);
			return;
		}

		// Handle the event
		switch (event.type) {
			case 'checkout.session.async_payment_failed':
				const checkoutSessionAsyncPaymentFailed = event.data.object;
				// Define and call a function to handle the event checkout.session.async_payment_failed
				console.log(checkoutSessionAsyncPaymentFailed);
				break;
			case 'checkout.session.async_payment_succeeded':
				const checkoutSessionAsyncPaymentSucceeded = event.data.object;
				// Define and call a function to handle the event checkout.session.async_payment_succeeded
				console.log(checkoutSessionAsyncPaymentSucceeded);
				break;
			case 'checkout.session.completed':
				const checkoutSessionCompleted = event.data.object;
				// Define and call a function to handle the event checkout.session.completed
				break;
			// ... handle other event types
			default:
				console.log(`Unhandled event type ${event.type}`);
		}

		response.status(200).end();
		// Return a 200 response to acknowledge receipt of the event
	}
);

router.use(express.json());

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
		console.log('data: ' + session);
		res.send(
			JSON.stringify({
				url: session.url,
			})
		);
	} catch (error) {
		console.error('Error creating Checkout Session:', error);
		res.status(500).send('Server Error');
	}
});

export default router;
