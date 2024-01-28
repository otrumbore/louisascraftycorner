import { Order } from '../models/ordersModel.js';
import { Product } from '../models/productsModel.js';

const createOrder = async (event) => {
	try {
		const { cartItems, userDetails, other, prices } = event;

		const processedCartItems = cartItems.map((item) => ({
			storeId: item.storeId,
			productName: item.name,
			price: item.price,
			quantity: item.qty,
			sale: item.sale || 0,
		}));

		const { customerNotes, source } = other;
		let cashTrans = {};
		let shipName = '';
		let isActive = false;

		if (source === 'retail') {
			cashTrans = { type: 'cash', timestamp: new Date() };
			shipName = userDetails.name;
			isActive = true;
		}

		// const newOrder = {
		// 	userId: userDetails._id || '',
		// 	email: userDetails.email || '',
		// 	username: userDetails.username || '',
		// 	items: processedCartItems,
		// 	customerNotes: customerNotes || '',
		// 	source: source || 'website',
		// 	status: [{ type: 'created', timestamp: new Date() }, cashTrans],
		// 	shipName: shipName || '',
		// };

		//console.log(newOrder);

		const newOrder = await Order.create({
			userId: userDetails._id || '',
			email: userDetails.email || '',
			username: userDetails.username || '',
			items: processedCartItems,
			customerNotes: customerNotes || '',
			source: source || 'website',
			status: [{ type: 'created', timestamp: new Date() }, cashTrans],
			shipName: shipName || '',
			active: isActive,
			prices: prices,
		});

		updateInventory(processedCartItems);

		// // Access orderId directly from the newOrder object
		const orderId = newOrder.orderId;

		console.log('success: ' + orderId);

		return orderId;
	} catch (error) {
		console.error('Create Order error: ' + error.message);
		// Handle the error appropriately (maybe log and rethrow?)
		//throw new Error(`Server Error: ${error.message}`);
	}
};

const updateInventory = async (cartItems) => {
	try {
		for (const cartItem of cartItems) {
			const product = await Product.findOne({ storeId: cartItem.storeId });

			if (!product) {
				console.log(`Product not found for storeId ${cartItem.storeId}!`);
				continue;
			}

			const newInventory = product.inventory - cartItem.quantity;
			const isActive = newInventory > 0;

			const updatedProduct = await Product.findOneAndUpdate(
				{ storeId: cartItem.storeId },
				{
					$set: {
						inventory: newInventory,
						active: isActive,
					},
				},
				{
					new: true,
				}
			);

			if (!updatedProduct) {
				console.log(
					`Product Inventory could not be updated for storeId ${cartItem.storeId}!`
				);
				// You might want to handle this case depending on your application logic
			} //else {
			// 	console.log(
			// 		`Product Inventory updated for storeId ${cartItem.storeId}:`,
			// 		updatedProduct
			// 	);
			// }
		}
	} catch (error) {
		console.log(error);
		// You might want to handle the error based on your application requirements
	}
};

export const updateOrder = async (event, intent) => {
	try {
		let updatedOrder = null;

		const orderId = event?.metadata?.order_id;

		switch (intent) {
			case 'completed':
				console.log('Success: session completed');

				const shippingData = {
					tracking: '',
					carrier: 'USPS',
					method: event.shipping_cost.amount_total === 0 ? 'standard' : '2day',
				};

				const priceData = {
					discounts: event.total_details.amount_discount,
					subtotal: event.amount_subtotal,
					shipping: event.total_details.amount_shipping,
					tax: event.total_details.amount_tax,
					total: event.amount_total,
				};

				const data = {
					email: event.customer_email,
					stripePaymentId: event.payment_intent,
					shipping: shippingData,
					prices: priceData,
					discounts: [],
					shipName: event.shipping_details.name,
					shipAdd: event.shipping_details.address,
					phone: event.customer_details
						? event.customer_details.phone || ''
						: '',
				};

				updatedOrder = {
					stripePaymentId: data.stripePaymentId,
					shipping: data.shipping,
					prices: data.prices,
					discounts: data.discounts,
					shipName: data.shipName,
					shipAdd: data.shipAdd,
					phone: data.phone,
					$push: { status: { type: 'paid', timestamp: new Date() } },
					active: true,
				};

				await Order.findOneAndUpdate({ orderId: orderId }, updatedOrder);
				break;

			case 'success':
				console.log('Success: payment succeeded');

				updatedOrder = {
					$push: { status: { type: 'processing', timestamp: new Date() } },
				};

				await Order.findOneAndUpdate({ orderId: orderId }, updatedOrder);
				break;

			case 'fail':
				console.log('Fail: Order payment failed');
				updatedOrder = {
					$push: { status: { type: 'payment_failed', timestamp: new Date() } },
				};

				await Order.findOneAndUpdate({ orderId: orderId }, updatedOrder);
				break;

			default:
				console.log('Invalid intent value');
		}

		console.log('updated order data: ', updatedOrder);
	} catch (error) {
		console.error('Error updating order:', error);
		// Consider sending a more specific error response
		throw new Error(`Server Error: ${error}`);
	}
};

export default createOrder;
