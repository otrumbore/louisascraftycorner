import express from 'express';
import { Order } from '../models/ordersModel.js';
import verifyToken from '../middleware/tokenChecks.js';

const router = express.Router();

router.post('/', async (request, response) => {
	//createOrder()
});

// Get all orders
router.get('/', verifyToken, async (request, response) => {
	try {
		let orders = '';
		if (request.user.role === 'admin' || request.user.role === 'moderator') {
			orders = await Order.find({});
		} else {
			return response.status(401).json({ message: 'Unauthorized' });
		}

		return response.status(200).json({
			count: orders.length,
			data: orders,
		});
	} catch (error) {
		console.error(error.message);
		response.status(500).send({ message: 'Server Error' });
	}
});

// Get all orders for user
router.get('/:userId', verifyToken, async (request, response) => {
	try {
		const { userId } = request.params;
		let orders = '';

		if (userId === request.user.userId) {
			orders = await Order.find({ userId: userId });
		} else {
			return response.status(401).json({ message: 'Unauthorized' });
		}

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
router.get('/:orderId', verifyToken, async (request, response) => {
	try {
		const { orderId } = request.params;
		const order = await Order.findOne({ orderId: orderId });

		if (!order) {
			return response.status(404).send({ message: 'Order not found' });
		}

		if (
			order.userId !== request.user.userId ||
			request.user.role !== 'admin' ||
			request.user.role !== 'moderator'
		) {
			return response.status(401).send({ message: 'Unauthorized' });
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
router.put('/:orderId', verifyToken, async (request, response) => {
	try {
		const { orderId } = request.params;
		let updatedOrder = null;
		if (request.user.role === 'admin' || request.user.role === 'moderator') {
			updatedOrder = await Order.findOneAndUpdate(
				{ orderId: orderId },
				request.body,
				{
					new: true,
				}
			);
		}

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
