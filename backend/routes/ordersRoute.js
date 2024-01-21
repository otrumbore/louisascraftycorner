import express from 'express';
import { Order } from '../models/ordersModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

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

dotenv.config();

const JWTToken = process.env.JWT_SECRET_TOKEN;

// Middleware to verify JWT token and extract user details
const verifyToken = (request, response, next) => {
	const authHeader = request.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return response.status(401).json({ message: 'Unauthorized' });
	}

	const token = authHeader.split(' ')[1];

	jwt.verify(token, JWTToken, (err, decoded) => {
		if (err) {
			return res.status(403).json({ message: 'Invalid token' });
		}
		request.user = decoded; // Attach user details to request object
		next();
	});
};

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
