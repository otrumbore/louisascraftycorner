import express from 'express';
import { Favorites } from '../modals/userFavoritesModel.js';

const router = express.Router();

// Create a favorite
router.post('/', async (request, response) => {
	try {
		const { email, userId, items } = request.body;

		const newFavorite = await Favorites.create({
			email,
			userId,
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

// Get favorite by ID
router.get('/:id', async (request, response) => {
	try {
		const { id } = request.params;
		const favorite = await Favorites.findById(id);

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

// Update a favorite by ID
router.put('/:id', async (request, response) => {
	try {
		const { id } = request.params;
		const updatedFavorite = await Favorites.findByIdAndUpdate(
			id,
			request.body,
			{
				new: true,
			}
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
