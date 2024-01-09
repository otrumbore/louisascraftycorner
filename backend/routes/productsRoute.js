import express from 'express';
import { Product } from '../modals/productsModel.js';

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

// Creating a product
router.post('/', async (request, response) => {
	try {
		const {
			name,
			description,
			price,
			sale,
			type,
			category,
			rating,
			tags,
			inventory,
			img,
			active,
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
			inventory,
			img,
			active,
		});

		return response.status(201).send(newProduct);
	} catch (error) {
		console.error(error.message);
		response.status(500).send({ message: `Server Error, ${error.message}` });
	}
});

// Get all products
router.get('/', async (request, response) => {
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
router.get('/:id', async (request, response) => {
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
router.put('/:id', async (request, response) => {
	try {
		const { id } = request.params;
		const updatedProduct = await Product.findByIdAndUpdate(id, request.body, {
			new: true,
		});
		//console.log(request.body.storeId);
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
router.delete('/:id', async (request, response) => {
	try {
		const { id } = request.params;
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
});

export default router;
