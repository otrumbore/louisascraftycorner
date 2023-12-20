import express, { response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRoute from './routes/productsRoute.js';
import { Product } from './modals/productsModel.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const mongoDBURL = process.env.MONGODB_URL;

//middleware for pasring request body
app.use(express.json());

//middleware for handling CORS policy
app.use(cors());

app.get('/', (request, response) => {
	console.log(request);
	return response.status(234).send('Hello');
});

app.use('/products', productsRoute);

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
