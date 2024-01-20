import express from 'express';
import { Order } from '../models/ordersModel.js';

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

router.post('/', async (request, response) => {
	//createOrder()
});

// Get all orders
router.get('/', async (request, response) => {
	try {
		const orders = await Order.find({});

		return response.status(200).json({
			count: orders.length,
			data: orders,
		});
	} catch (error) {
		console.error(error.message);
		response.status(500).send({ message: 'Server Error' });
	}
});

// Get order by ID
router.get('/:orderId', async (request, response) => {
	try {
		const { orderId } = request.params;
		const order = await Order.findOne({ orderId: orderId });

		if (!order) {
			return response.status(404).send({ message: 'Order not found' });
		}

		return response.status(200).json({
			data: order,
		});
	} catch (error) {
		console.error(error.message);
		response.status(500).send({ message: 'Server Error' });
	}
});

// Update a order by orderID
router.put('/:orderId', async (request, response) => {
	try {
		const { orderId } = request.params;
		const updatedOrder = await Order.findOneAndUpdate(
			{ orderId: orderId },
			request.body,
			{
				new: true,
			}
		);

		if (!updatedOrder) {
			return response.status(404).send({ message: 'Order not found' });
		}

		return response.status(200).send({ message: 'Order updated successfully' });
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
