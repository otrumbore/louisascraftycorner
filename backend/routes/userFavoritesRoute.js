import express from 'express';
import { Favorites } from '../models/userFavoritesModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Product } from '../models/productsModel.js';

const router = express.Router();

dotenv.config();

const JWTToken = process.env.JWT_SECRET_TOKEN;

// Middleware to verify JWT token and extract user details
const verifyToken = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	const token = authHeader.split(' ')[1];

	jwt.verify(token, JWTToken, (err, decoded) => {
		if (err) {
			return res.status(403).json({ message: 'Invalid token' });
		}
		req.user = decoded; // Attach user details to request object
		next();
	});
};

// Create a favorite
router.post('/', async (request, response) => {
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
router.get('/', async (request, response) => {
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
router.get('/:id', verifyToken, async (request, response) => {
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
router.get('/product/:id', async (request, response) => {
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
router.put('/:id', verifyToken, async (request, response) => {
	try {
		const { id } = request.params;
		const { items } = request.body;

		const updatedFavorite = await Favorites.findOneAndUpdate(
			{ userId: id },
			{ $set: { items } },
			{ new: true }
		);

		if (!updatedFavorite) {
			return response.status(404).send({ message: 'Favorite not found' });
		}

		return response
			.status(200)
			.send({ message: 'Favorite updated successfully' });
	} catch (error) {
		console.error(error.message);
		response.status(500).send({ message: 'Server Error' });
	}
});

// Delete a favorite by ID
router.delete('/:id', async (request, response) => {
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
});

export default router;
