import express from 'express';
import { siteSettings } from '../modals/siteSettingsModel.js';

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

// Creating a site_settings
router.post('/', async (request, response) => {
	try {
		const { website_banner } = request.body;

		const newSiteSettings = await siteSettings.create({
			website_banner,
		});

		return response.status(201).send(newSiteSettings);
	} catch (error) {
		console.error(error.message);
		response.status(500).send({ message: 'Server Error' });
	}
});

// Get all products
router.get('/', async (request, response) => {
	try {
		const settings = await siteSettings.find({});
		return response.status(200).json({
			count: settings.length,
			data: settings,
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
		const settings = await siteSettings.findById(id);

		if (!settings) {
			return response.status(404).send({ message: 'Product not found' });
		}

		return response.status(200).json({
			data: settings,
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
		const updatedSiteSettings = await siteSettings.findByIdAndUpdate(
			id,
			request.body,
			{
				new: true,
			}
		);
		//console.log(request.body.storeId);
		if (!updatedSiteSettings) {
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
// router.delete('/:id', async (request, response) => {
// 	try {
// 		const { id } = request.params;
// 		const deletedProduct = await Product.findByIdAndDelete(id);

// 		if (!deletedProduct) {
// 			return response.status(404).send({ message: 'Product not found' });
// 		}

// 		return response
// 			.status(200)
// 			.send({ message: 'Product deleted successfully' });
// 	} catch (error) {
// 		console.error(error.message);
// 		response.status(500).send({ message: 'Server Error' });
// 	}
// });

export default router;
