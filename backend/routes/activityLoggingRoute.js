import express from 'express';
import { activityLogging } from '../models/activityLoggingModel.js';

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

// Creating error log
router.post('/', async (request, response) => {
	try {
		const { userId, errorData, browser } = request.body;

		const newErrorLog = await errorLogging.create({
			userId,
			errorData,
			browser,
		});

		return response.status(201).json(newErrorLog);
	} catch (error) {
		console.error(error);
		response.status(500).json({ message: 'Server Error' });
	}
});

// Get all error logs
router.get('/', async (request, response) => {
	try {
		const errorLogs = await errorLogging.find({});
		return response.status(200).json({
			count: errorLogs.length,
			data: errorLogs,
		});
	} catch (error) {
		console.error(error.message);
		response.status(500).send({ message: 'Server Error' });
	}
});

// Get error log by ID
router.get('/:id', async (request, response) => {
	try {
		const { id } = request.params;
		const errorLog = await errorLogging.findById(id);

		if (!errorLog) {
			return response.status(404).send({ message: 'Error log not found' });
		}

		return response.status(200).json({
			data: errorLog,
		});
	} catch (error) {
		console.error(error.message);
		response.status(500).send({ message: 'Server Error' });
	}
});

// // Update a error log by ID
// router.put('/:id', async (request, response) => {
// 	try {
// 		const { id } = request.params;
// 		const updatedSiteSettings = await siteSettings.findByIdAndUpdate(
// 			id,
// 			request.body,
// 			{
// 				new: true,
// 			}
// 		);
// 		//console.log(request.body.storeId);
// 		if (!updatedSiteSettings) {
// 			return response.status(404).send({ message: 'Product not found' });
// 		}

// 		return response
// 			.status(200)
// 			.send({ message: 'Product updated successfully' });
// 	} catch (error) {
// 		console.error(error.message);
// 		response.status(500).send({ message: 'Server Error' });
// 	}
// });

// //Delete a error log by ID
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
