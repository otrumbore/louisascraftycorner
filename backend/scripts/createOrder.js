import { Order } from '../models/ordersModel.js';
import { Product } from '../models/productsModel.js';
import { User } from '../models/usersModel.js';
import { sendNewOrderTextEmail, sendReceiptEmail } from './nodeMailer.js';

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
			updateUserTotalSpent(userDetails.email, prices.total);
		}

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

		if (source === 'retail') {
			sendReceiptEmail(newOrder);
		}

		updateInventory(processedCartItems);

		// Access orderId directly from the newOrder object
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

				const subtotal = priceData.subtotal;
				updateUserTotalSpent(event.customer_email, subtotal);

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

				const orderDetails = await Order.findOneAndUpdate(
					{ orderId: orderId },
					updatedOrder,
					{ new: true }
				);
				sendReceiptEmail(orderDetails);
				let testOrder = false;
				if (orderDetails.customerNotes === 'test') {
					testOrder = true;
				}
				const textData = {
					total: orderDetails.prices.total,
					orderId: orderDetails.orderId,
				};
				sendNewOrderTextEmail(textData, testOrder);
				console.log('sending receipt to customer');
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

		//console.log('updated order data: ', updatedOrder);
	} catch (error) {
		console.error('Error updating order:', error);
		// Consider sending a more specific error response
		throw new Error(`Server Error: ${error}`);
	}
};

const updateUserTotalSpent = async (email, subtotal) => {
	console.log('running rewards update');
	try {
		const user = await User.findOne({ email: email });

		if (!user) {
			console.log(`User not found with email ${email}`);
			return;
		}

		const totalSpent = user.totalSpent + parseFloat(subtotal);
		const currSpent = user.rewards.spent;
		const currCompleted = user.rewards.completed || 0;
		let updateRewards = user.rewards;

		if (user.rewards.spent >= 2500 && !user.rewards.reward1Used) {
			updateRewards = {
				...updateRewards,
				spent: currSpent + parseFloat(subtotal),
				reward1Used: true,
			};
		} else if (
			user.rewards.spent >= 5000 &&
			user.rewards.reward1Used &&
			!user.rewards.reward2Used
		) {
			updateRewards = {
				spent: parseFloat(subtotal),
				reward2Used: false,
				reward1Used: false,
				completed: currCompleted + 1,
			};
		} else {
			updateRewards = {
				...updateRewards,
				spent: currSpent + parseFloat(subtotal),
			};
		}

		console.log(updateRewards);

		const updatedUser = await User.findOneAndUpdate(
			{ email: email },
			{
				$set: {
					totalSpent: totalSpent,
					rewards: updateRewards,
				},
			},
			{
				new: true,
			}
		);

		if (!updatedUser) {
			console.log(`Could not update users total spent or rewards.`);
			return;
		}

		console.log('user total spent has been updated!');
	} catch (error) {
		console.log(error);
		// You might want to handle the error based on your application requirements
	}
};

export default createOrder;
