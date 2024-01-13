import express from 'express';
import { Product } from '../modals/productsModel.js';
import multer from 'multer';
import fs from 'fs';
import sharp from 'sharp';

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

// Set up Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (request, response) => {
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
			//image,
			active,
			archived,
		} = request.body;

		// Compress the uploaded image using sharp
		const compressedImage = await sharp(request.file.buffer)
			.rotate() // Automatically rotate based on EXIF orientation
			.resize({ width: 1200 }) // Set the desired width
			.jpeg({ quality: 80 }) // Set the desired JPEG quality (0-100)
			.toBuffer();

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
			image: compressedImage,
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
router.get('/', async (request, response) => {
	// try {
	// 	const products = await Product.find({});
	// 	return response.status(200).json({
	// 		count: products.length,
	// 		data: products,
	// 	});
	// } catch (error) {
	// 	console.error(error.message);
	// 	response.status(500).send({ message: 'Server Error' });
	// }
	try {
		const products = await Product.find({});

		return response.status(200).json({
			count: products.length,
			data: products.map((product) => ({
				...product._doc,
				image: product.image
					? Buffer.from(product.image).toString('base64')
					: null, // Convert binary to base64
			})),
		});
	} catch (error) {
		console.error(error.message);
		response.status(500).send({ message: 'Server Error' });
	}
});

// Get product by ID
router.get('/:id', async (request, response) => {
	// try {
	// 	const { id } = request.params;
	// 	const product = await Product.findById(id);

	// 	if (!product) {
	// 		return response.status(404).send({ message: 'Product not found' });
	// 	}

	// 	return response.status(200).json({
	// 		data: product,
	// 	});
	// } catch (error) {
	// 	console.error(error.message);
	// 	response.status(500).send({ message: 'Server Error' });
	// }
	try {
		const { id } = request.params;
		const product = await Product.findById(id);

		if (!product) {
			return response.status(404).send({ message: 'Product not found' });
		}

		// Assuming 'image' is a Buffer field in your database
		const imageBuffer = product.image;

		// Check if imageBuffer is defined before converting to base64
		const base64Image = imageBuffer
			? Buffer.from(imageBuffer).toString('base64')
			: null;

		return response.status(200).json({
			data: {
				...product._doc,
				image: base64Image,
			},
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
