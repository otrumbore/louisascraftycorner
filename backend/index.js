import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import stripe from 'stripe';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import productsRoute from './routes/productsRoute.js';
import siteSettingsRoute from './routes/siteSettingsRoute.js';
import usersRoute from './routes/usersRoute.js';
import userFavoritesRoute from './routes/userFavoritesRoute.js';
import errorLoggingRoute from './routes/errorLoggingRoute.js';
import stripeCheckoutRoute from './routes/stripeCheckoutRoute.js';
import activityLoggingRoute from './routes/activityLoggingRoute.js';
import ordersRoute from './routes/ordersRoute.js';
import pagesRoute from './routes/pagesRoute.js';
import contactRoute from './routes/contactRoute.js';

import crypto from 'crypto';

//const secret = crypto.randomBytes(32).toString('hex');
//console.log(secret); // Output the generated secret key

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const mongoDBURL = process.env.MONGODB_URL;
const stripeApiKey = process.env.STRIPE_SECRET_TEST_KEY;
const frontendURL = process.env.FRONT_END_URL;
const JWTToken = process.env.JWT_SECRET_TOKEN;
//const stripeClient = new stripe(stripeApiKey);

const allowedOrigins = [
	'https://louisascraftycorner.com',
	'https://www.louisascraftycorner.com',
	'https://louisascraftycorner-production.up.railway.app',
	`${frontendURL}`,
];

const corsOptions = {
	origin: function (origin, callback) {
		if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error('Origin not allowed by CORS'));
		}
	},
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
	//console.log('Incoming request:', req.method, req.url); need to add proper data logging
	next();
});

// Other routes...
app.get('/', (req, res) => {
	res.status(234).send('I see you!!');
});
app.use('/api/checkout', stripeCheckoutRoute);

// Middleware for parsing request body
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Increase payload size limit (e.g., 10MB)
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/products', productsRoute);
app.use('/api/admin/site_settings', siteSettingsRoute);
app.use('/api/user', usersRoute);
app.use('/api/user/favorites', userFavoritesRoute);
app.use('/api/error_logging', errorLoggingRoute);
app.use('/api/activity_logging', activityLoggingRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/pages', pagesRoute);
app.use('/api/contact', contactRoute);

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
