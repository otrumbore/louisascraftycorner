import express from 'express';
import { activityLogging } from '../models/activityLoggingModel.js';
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

// Creating activity log
router.post('/', validateApiKey, async (request, response) => {
	try {
		const { user, activityData, browser } = request.body;

		const newActivityLog = await activityLogging.create({
			user,
			activityData,
			browser,
		});

		return response.status(201).json(newActivityLog);
	} catch (error) {
		console.error(error);
		response
			.status(500)
			.json({ message: 'Server Error - Unable to log activity' });
	}
});

// Get all activity logs
router.get('/', validateApiKey, async (request, response) => {
	try {
		const activityLogs = await activityLogging.find({});
		return response.status(200).json({
			count: activityLogs.length,
			data: activityLogs,
		});
	} catch (error) {
		console.error(error.message);
		response
			.status(500)
			.send({ message: 'Server Error - Unable to retrieve activity logs' });
	}
});

// Get activity log by ID
router.get('/:id', validateApiKey, async (request, response) => {
	try {
		const { id } = request.params;
		const activityLog = await activityLogging.findById(id);

		if (!activityLog) {
			return response.status(404).send({ message: 'Activity log not found' });
		}

		return response.status(200).json({
			data: activityLog,
		});
	} catch (error) {
		console.error(error.message);
		response
			.status(500)
			.send({ message: 'Server Error - Unable to retrieve activity log' });
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
