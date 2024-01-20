import { Order } from '../models/ordersModel';

const createOrder = async (event) => {
	try {
		const { cartItems, userDetails } = event;

		const processedCartItems = cartItems.map((item) => ({
			storeId: item.storeId,
			price: item.price,
			quantity: item.qty,
			sale: item.sale,
		}));

		const newOrder = await Order.create({
			userId: userDetails._id,
			email: userDetails.email,
			username: userDetails.username,
			items: processedCartItems,
			customerNotes: customerNotes || '',
			source: source || 'website',
			status: ['created'],
		});

		return newOrder;
	} catch (error) {
		console.error(error.message);
		// Handle the error appropriately (maybe log and rethrow?)
		throw new Error(`Server Error: ${error.message}`);
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
