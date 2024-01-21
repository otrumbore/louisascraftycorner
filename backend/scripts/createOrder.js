import { Order } from '../models/ordersModel.js';
import { Product } from '../models/productsModel.js';

const createOrder = async (event) => {
	try {
		const { cartItems, userDetails } = event;

		const processedCartItems = cartItems.map((item) => ({
			storeId: item.storeId,
			price: item.price,
			quantity: item.qty,
			sale: item.sale,
		}));

		const { customerNotes, source } = {};

		const newOrder = await Order.create({
			userId: userDetails._id,
			email: userDetails.email,
			username: userDetails.username,
			items: processedCartItems,
			customerNotes: customerNotes || '',
			source: source || 'website',
			status: [{ type: 'created', timestamp: new Date() }],
		});

		updateInventory(processedCartItems);

		return newOrder;
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
			} else {
				console.log(
					`Product Inventory updated for storeId ${cartItem.storeId}:`,
					updatedProduct
				);
			}
		}
	} catch (error) {
		console.log(error);
		// You might want to handle the error based on your application requirements
	}
};

export const updateOrder = async (event, intent) => {
	try {
		const shippingData = {
			tracking: '',
			vendor: 'USPS',
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
			phone: event.customer_details ? event.customer_details.phone || '' : '',
		};

		let updatedOrder = null;

		if (intent) {
			updatedOrder = await Order.create({
				stripePaymentId: data.stripePaymentId,
				shipping: data.shipping,
				prices: data.prices,
				discounts: data.discounts,
				shipName: data.shipName,
				shipAdd: data.shipAdd,
				phone: data.phone,
				status: [{ type: 'processing', timestamp: new Date() }],
			});
			console.log('Success: Order updated');
		} else {
			// You can add logic here for cases where intent is not provided (else block)
			console.log('Intent not provided, handle accordingly');
		}

		console.log(updatedOrder);
	} catch (error) {
		console.error('Error updating order:', error.message);
		// Consider sending a more specific error response
		throw new Error(`Server Error: ${error.message}`);
	}
};

export default createOrder;
