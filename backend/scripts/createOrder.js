import { Order } from '../models/ordersModel';

const createOrder = async (event) => {
	try {
		const { userId, email, username, items, customerNotes, source } = event;

		const newOrder = await Order.create({
			userId,
			email,
			username,
			items,
			customerNotes: customerNotes || '',
			source: source || 'website',
			status: ['created'],
		});

		// Return the newly created product in the response
		return response.status(201).send(newOrder);
	} catch (error) {
		console.error(error.message);
		response.status(500).send({ message: `Server Error, ${error.message}` });
	}
};

export const updateOrder = async (event) => {
	try {
		const {
			email,
			items,
			shipping,
			prices,
			discounts,
			billName,
			billAdd,
			shipName,
			shipAdd,
			phone,
			customerNotes,
			source,
		} = request.body;

		const newOrder = await Order.create({
			email,
			items,
			shipping,
			prices,
			discounts: discounts || [],
			billName: billName || '',
			billAdd: billAdd || '',
			shipName,
			shipAdd,
			phone: phone || '',
			customerNotes: customerNotes || '',
			source,
			status: ['created'],
		});

		// Return the newly created product in the response
		return response.status(201).send(newOrder);
	} catch (error) {
		console.error(error.message);
		response.status(500).send({ message: `Server Error, ${error.message}` });
	}
};

export default createOrder;
