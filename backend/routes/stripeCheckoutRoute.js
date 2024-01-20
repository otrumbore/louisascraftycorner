import express from 'express';
import dotenv from 'dotenv';
import stripe from 'stripe';

const router = express.Router();

dotenv.config();

const stripeApiKey = process.env.STRIPE_SECRET_TEST_KEY;
const frontendURL = process.env.FRONT_END_URL;
const stripeClient = new stripe(stripeApiKey);

const webhookSecret = process.env.WEBHOOKSECRET;

app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
	const sig = req.headers['stripe-signature'];

	let event;
	try {
		event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
	} catch (err) {
		return res.status(400).send(`Webhook Error: ${err.message}`);
	}

	// Handle the event
	switch (event.type) {
		case 'payment_intent.succeeded':
			// Handle successful payment
			break;
		case 'invoice.paid':
			// Handle paid invoice
			break;
		// Handle other event types
	}

	console.log(event);

	res.json({ received: true });
});

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
