import express from 'express';
import { Order } from '../models/ordersModel.js';
import verifyToken from '../middleware/tokenChecks.js';
import createOrder from '../scripts/createOrder.js';
import validateApiKey from '../middleware/apiCkecks.js';
import {
	sendNewOrderTextEmail,
	sendOrderUpdateEmail,
} from '../scripts/nodeMailer.js';

const router = express.Router();

router.post('/', verifyToken, validateApiKey, async (request, response) => {
	if (request.user.role !== 'admin' && request.user.role !== 'moderator') {
		return response.status(401).json({ message: 'Unauthorized' });
	}
	const data = request.body;
	console.log(data);
	const orderId = createOrder(data);
	response.status(200).json({ orderId: orderId });
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
router.get(
	'/:userId',
	verifyToken,
	validateApiKey,
	async (request, response) => {
		try {
			const { userId } = request.params;
			const { email } = request.query;

			if (userId !== request.user.userId) {
				return response.status(401).json({ message: 'Unauthorized' });
			}

			let orders;

			if (email) {
				// Retrieve orders based on userId and email
				orders = await Order.find({
					$or: [{ userId: userId, email: email }, { email: email }],
				});
			} else {
				// Retrieve orders based on userId only
				orders = await Order.find({ userId: userId });
			}

			// Remove duplicate orderIds using distinct
			const uniqueOrderIds = await Order.distinct('orderId', {
				_id: { $in: orders.map((order) => order._id) },
			});

			// Retrieve unique orders based on unique orderIds
			const uniqueOrders = await Order.find({
				orderId: { $in: uniqueOrderIds },
			});

			return response.status(200).json({
				count: uniqueOrders.length,
				data: uniqueOrders,
			});
		} catch (error) {
			console.error(error.message);
			response.status(500).send({ message: 'Server Error' });
		}
	}
);

// Get order by ID
router.get(
	'/:orderId',
	verifyToken,
	validateApiKey,
	async (request, response) => {
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
	}
);

// Update a order by orderID
router.put(
	'/:orderId',
	verifyToken,
	validateApiKey,
	async (request, response) => {
		try {
			const { orderId } = request.params;
			const data = request.body;
			//console.log(data);
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
			if (data.email) {
				let emailData = {
					name: data.shipName,
					email: data.email,
					status: data.status[data.status.length - 1].type,
					orderId: data.orderId,
					tracking: data.shipping.tracking || '',
				};
				sendOrderUpdateEmail(emailData);
				//sendNewOrderTextEmail({ total: 12, orderId: 123456 });
			}

			// switch (data.status[data.status.length - 1].type) {
			// 	case 'delivered':
			// 		console.log('email to be sent is delviered');
			// 		sendOrderUpdateEmail(emailData);
			// 		break;
			// 	case 'shipped':
			// 		console.log('email to be sent is shipped');
			// 		break;
			// 	default:
			// 		console.log('error sending status email');
			// 		break;
			// }

			return response
				.status(200)
				.send({ message: 'Order updated successfully' });
		} catch (error) {
			console.error(error.message);
			response.status(500).send({ message: 'Server Error' });
		}
	}
);

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
