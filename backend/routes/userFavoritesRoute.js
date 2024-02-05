import express from 'express';
import { Favorites } from '../models/userFavoritesModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Product } from '../models/productsModel.js';
import validateApiKey from '../middleware/apiCkecks.js';
import verifyToken from '../middleware/tokenChecks.js';

const router = express.Router();

dotenv.config();

// Create a favorite
router.post('/', verifyToken, validateApiKey, async (request, response) => {
	try {
		const { userId, email, items } = request.body;

		const newFavorite = await Favorites.create({
			userId,
			email,
			items,
		});

		return response.status(201).send(newFavorite);
	} catch (error) {
		console.error(error.message);
		response.status(500).send({ message: 'Server Error' });
	}
});

// Get all favorites
router.get('/', validateApiKey, async (request, response) => {
	try {
		const favorites = await Favorites.find({});
		return response.status(200).json({
			count: favorites.length,
			data: favorites,
		});
	} catch (error) {
		console.error(error.message);
		response.status(500).send({ message: 'Server Error' });
	}
});

// Get favorite by user ID
router.get('/:id', verifyToken, validateApiKey, async (request, response) => {
	try {
		const { id } = request.params;
		const favorite = await Favorites.findOne({ userId: id });

		if (!favorite) {
			return response.status(404).send({ message: 'Favorite not found' });
		}

		return response.status(200).json({
			data: favorite,
		});
	} catch (error) {
		console.error(error.message);
		response.status(500).send({ message: 'Server Error' });
	}
});

//Get favorite products
// Get product by ID
router.get('/product/:id', validateApiKey, async (request, response) => {
	try {
		const { id } = request.params;
		const product = await Product.findOne({ storeId: id });

		if (!product) {
			return response.status(404).send({ message: 'Product not found' });
		}

		return response.status(200).json({
			data: product,
		});
	} catch (error) {
		console.error(error.message);
		response.status(500).send({ message: 'Server Error' });
	}
});

// Update a favorite by ID
router.put('/:id', verifyToken, validateApiKey, async (request, response) => {
	try {
		const { id } = request.params;
		const { email, items } = request.body;

		const updatedFavorite = await Favorites.findOneAndUpdate(
			{ userId: id },
			{ $set: { items } },
			{ new: true }
		);

		if (!updatedFavorite) {
			try {
				createFavorite(id, email, items);
			} catch (error) {
				console.log(error);
			}

			return response
				.status(404)
				.send({ message: 'Favorite not found, could not add...' });
		}

		return response
			.status(200)
			.send({ message: 'Favorite updated successfully' });
	} catch (error) {
		console.error(error.message);
		response.status(500).send({ message: 'Server Error' });
	}
});

const createFavorite = async (userId, email, items) => {
	try {
		//const { userId, email, items } = request.body;

		const newFavorite = await Favorites.create({
			userId,
			email,
			items,
		});
		console.log('added new favorite');
		//return response.status(201).send(newFavorite);
	} catch (error) {
		console.error(error.message);
		//response.status(500).send({ message: 'Server Error' });
	}
};

// Delete a favorite by ID
router.delete(
	'/:id',
	verifyToken,
	validateApiKey,
	async (request, response) => {
		try {
			const { id } = request.params;
			const deletedFavorite = await Favorites.findByIdAndDelete(id);

			if (!deletedFavorite) {
				return response.status(404).send({ message: 'Favorite not found' });
			}

			return response
				.status(200)
				.send({ message: 'Favorite deleted successfully' });
		} catch (error) {
			console.error(error.message);
			response.status(500).send({ message: 'Server Error' });
		}
	}
);

export default router;
