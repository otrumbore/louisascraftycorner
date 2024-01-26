import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
	storeId: { type: Number },
	productName: { type: String },
	quantity: { type: Number },
	price: { type: Number },
	sale: { type: Number },
});

const shippingSchema = new mongoose.Schema({
	tracking: { type: String },
	carrier: { type: String },
	method: { type: String },
});

const pricesSchema = new mongoose.Schema({
	discounts: { type: Number },
	subtotal: { type: Number },
	shipping: { type: Number },
	tax: { type: Number },
	total: { type: Number },
});

const returnSchema = new mongoose.Schema({
	returnNumber: { type: String },
	tracking: { type: String },
	refundAmount: { type: String },
});

const discountsSchema = new mongoose.Schema({
	discountCode: { type: String },
	promoCode: { type: String },
});

const ordersSchema = mongoose.Schema(
	{
		email: { type: String },
		username: { type: String },
		userId: { type: String, unique: false },
		orderId: { type: Number, unique: true },
		stripePaymentId: { type: String },
		items: [itemSchema],
		shipping: shippingSchema,
		billName: { type: String },
		billAdd: {
			line1: { type: String },
			line2: { type: String },
			city: { type: String },
			state: { type: String },
			postalCode: { type: Number },
			country: { type: String, default: 'US' },
		},
		shipName: { type: String },
		shipAdd: {
			line1: { type: String },
			line2: { type: String },
			city: { type: String },
			state: { type: String },
			postal_code: { type: Number },
			country: { type: String, default: 'US' },
		},
		phone: { type: String },
		status: [
			{
				type: {
					type: String,
					enum: [
						'created',
						'processing',
						'paid',
						'crafting',
						'shipped',
						'delivered',
						'payment_failed',
					], // Add your status types
				},
				timestamp: {
					type: Date,
				},
			},
		],
		active: {
			type: Boolean,
			default: false,
		},
		prices: pricesSchema,
		discounts: discountsSchema,
		customerNotes: { type: String },
		return: returnSchema,
		source: { type: String },
	},
	{
		timestamps: true,
	}
);
// Pre-save middleware to generate 6-digit unique ID
ordersSchema.pre('save', async function (next) {
	try {
		let generatedId;
		do {
			generatedId = Math.floor(10000000 + Math.random() * 90000000); // Generate a random 8-digit number
		} while ((await this.constructor.findOne({ orderId: generatedId })) !== null); // Check if it already exists
		this.orderId = generatedId; // Set the unique ID
		next();
	} catch (error) {
		next(error);
	}
});

export const Order = mongoose.model('orders', ordersSchema);
