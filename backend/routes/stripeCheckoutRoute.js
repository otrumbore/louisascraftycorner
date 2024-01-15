import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import stripe from 'stripe';

const router = express.Router();

dotenv.config();

const stripeApiKey = process.env.STRIPE_SECRET_TEST_KEY;
const stripeClient = new stripe(stripeApiKey);

router.post('/', async (req, res) => {
	const items = req.body.items;
	let lineItems = [];
	items.forEach((item) => {
		lineItems.push({
			price: 'price_1OS5bYCVnbWSu6KdZkF4uUv5', //item.id, if using add price ids to db regular price and sale price separate ids
			quantity: item.qty,
		});
	});

	const session = await stripeClient.checkout.sessions.create({
		line_items: lineItems,
		automatic_tax: { enabled: true },
		billing_address_collection: 'required',
		shipping_address_collection: {
			allowed_countries: ['US', 'CA'], // Add other allowed countries as needed
		},
		mode: 'payment',
		success_url: 'http://10.0.0.85:5173/cart/sucess',
		cancel_url: 'http://10.0.0.85:5173/cart/cancel',
	});

	res.send(
		JSON.stringify({
			url: session.url,
		})
	);
});

export default router;
