import express from 'express';
import { Product } from '../models/productsModel.js';
import verifyToken from '../middleware/tokenChecks.js';
import validateApiKey from '../middleware/apiCkecks.js';

const router = express.Router();

// Middleware function to check if the user has admin privileges
// const isAdmin = (req, res, next) => {
// 	// Check if the user is an admin based on the authenticated user's role or any other criteria
// 	if (/* Check admin role */) {
// 	  next(); // Allow the request to proceed
// 	} else {
// 	  res.status(403).json({ message: 'Access denied. Requires admin privileges.' });
// 	}
//   };

router.post('/', verifyToken, validateApiKey, async (request, response) => {
	try {
		if (request.user.role !== 'admin' && request.user.role !== 'moderator') {
			return response.status(401).send({ message: 'Unauthorized' });
		}
		const {
			name,
			description,
			price,
			sale,
			type,
			category,
			rating,
			tags,
			measurements,
			manCost,
			storageLocation,
			inventory,
			image,
			images,
			active,
			archived,
		} = request.body;

		const newProduct = await Product.create({
			name,
			description,
			price,
			sale,
			type,
			category,
			rating,
			tags,
			measurements,
			manCost,
			storageLocation,
			inventory,
			image,
			images,
			active,
			archived,
		});

		// Return the newly created product in the response
		return response.status(201).send(newProduct);
	} catch (error) {
		console.error(error.message);
		response.status(500).send({ message: `Server Error, ${error.message}` });
	}
});

// Get all products
router.get('/', validateApiKey, async (request, response) => {
	try {
		const products = await Product.find({});

		return response.status(200).json({
			count: products.length,
			data: products,
		});
	} catch (error) {
		console.error(error.message);
		response.status(500).send({ message: 'Server Error' });
	}
});

// Get product by ID
router.get('/:id', validateApiKey, async (request, response) => {
	try {
		const { id } = request.params;
		const product = await Product.findById(id);

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

// Update a product by ID
router.put('/:id', verifyToken, validateApiKey, async (request, response) => {
	try {
		const { id } = request.params;
		if (request.user.role !== 'admin' && request.user.role !== 'moderator') {
			return response.status(401).send({ message: 'Unauthorized' });
		}

		const updatedProduct = await Product.findByIdAndUpdate(id, request.body, {
			new: true,
		});

		if (!updatedProduct) {
			return response.status(404).send({ message: 'Product not found' });
		}

		return response
			.status(200)
			.send({ message: 'Product updated successfully' });
	} catch (error) {
		console.error(error.message);
		response.status(500).send({ message: 'Server Error' });
	}
});

// Delete a product by ID
router.delete(
	'/:id',
	verifyToken,
	validateApiKey,
	async (request, response) => {
		try {
			const { id } = request.params;
			if (request.user.role !== 'admin' && request.user.role !== 'moderator') {
				return response.status(401).send({ message: 'Unauthorized' });
			}
			const deletedProduct = await Product.findByIdAndDelete(id);

			if (!deletedProduct) {
				return response.status(404).send({ message: 'Product not found' });
			}

			return response
				.status(200)
				.send({ message: 'Product deleted successfully' });
		} catch (error) {
			console.error(error.message);
			response.status(500).send({ message: 'Server Error' });
		}
	}
);

export default router;
