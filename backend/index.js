import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import stripe from 'stripe';

import productsRoute from './routes/productsRoute.js';
import siteSettingsRoute from './routes/siteSettingsRoute.js';
import usersRoute from './routes/usersRoute.js';
import userFavoritesRoute from './routes/userFavoritesRoute.js';
import errorLoggingRoute from './routes/errorLoggingRoute.js';

import crypto from 'crypto';

//const secret = crypto.randomBytes(32).toString('hex');
//console.log(secret); // Output the generated secret key

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const mongoDBURL = process.env.MONGODB_URL;
const stripeApiKey = process.env.STRIPE_SECRET_TEST_KEY;
const stripeClient = new stripe(stripeApiKey);

// Middleware for parsing request body
app.use(express.json());
app.use(express.static('public'));

// Middleware for handling CORS policy
app.use(cors());

app.post('/checkout', async (req, res) => {
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

// Other routes...
app.get('/', (req, res) => {
	res.status(234).send('Hello');
});
app.use('/api/products', productsRoute);
app.use('/api/admin/site_settings', siteSettingsRoute);
app.use('/api/user', usersRoute);
app.use('/api/user/favorites', userFavoritesRoute);
app.use('/api/error_logging', errorLoggingRoute);

mongoose
	.connect(mongoDBURL)
	.then(() => {
		console.log('App connected to database');

		app.listen(PORT, () => {
			console.log(`App is listening to port: ${PORT}`);
		});
	})
	.catch((error) => {
		console.log(error);
	});
