import express from 'express';
import { Page } from '../models/pagesModel.js';
import verifyToken from '../middleware/tokenChecks.js';
import validateApiKey from '../middleware/apiCkecks.js';

const router = express.Router();

// router.post('/', verifyToken, async (request, response) => {
// 	if (request.user.role !== 'admin' && request.user.role !== 'moderator') {
// 		return response.status(401).json({ message: 'Unauthorized' });
// 	}

// 	const { pageName, content } = request.body;

// 	response.status(200).json({ orderId: orderId });
// });

// Update a page by page name
router.put(
	'/:pageName',
	verifyToken,
	validateApiKey,
	async (request, response) => {
		try {
			const { pageName } = request.params;
			let updatedPage = null;
			if (request.user.role === 'admin' || request.user.role === 'moderator') {
				//console.log(request.body);
				updatedPage = await Page.findOneAndUpdate(
					{ page_name: pageName },
					{ content: request.body.content },
					{ new: true }
				);
			}

			if (!updatedPage) {
				return response.status(404).send({ message: 'Page not found' });
			}

			return response
				.status(200)
				.send({ message: 'Page updated successfully', updates: updatedPage });
		} catch (error) {
			console.error(error.message);
			response.status(500).send({ message: 'Server Error' });
		}
	}
);

// Get page by page name
router.get('/:pageName', validateApiKey, async (request, response) => {
	try {
		const { pageName } = request.params;
		const page = await Page.findOne({ page_name: pageName });

		if (!page) {
			return response.status(404).send({ message: 'Page not found' });
		}

		return response.status(200).json({
			data: page,
		});
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
