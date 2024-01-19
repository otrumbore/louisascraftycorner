import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
	storeId: { type: Number },
	price: { type: Number },
	sale: { type: Number },
});

const shippingSchema = new mongoose.Schema({
	tracking: { type: String },
	vendor: { type: String },
	method: { type: String },
});

const pricesSchema = new mongoose.Schema({
	discounts: { type: String },
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

discountsSchema = new mongoose.Schema({
	discountCode: { type: String },
	promoCode: { type: String },
});

const ordersSchema = mongoose.Schema(
	{
		email: { type: String },
		username: { type: String },
		userId: { type: String },
		orderNum: { type: String },
		items: [itemSchema],
		shipping: shippingSchema,
		billName: { type: String },
		billAdd: {
			line1: { type: String },
			line2: { type: String },
			city: { type: String },
			state: { type: String },
			zip: { type: Number },
			country: { type: String, defualt: 'US' },
		},
		shipName: { type: String },
		shipAdd: {
			streetAdd1: { type: String },
			streetAdd2: { type: String },
			city: { type: String },
			state: { type: String },
			zip: { type: Number },
			country: { type: String, defualt: 'US' },
		},
		phone: { type: String },
		altEmail: { type: String },
		status: [{ type: String }, { timestamps: true }],
		prices: pricesSchema,
		dicounts: discountsSchema,
		customerNotes: { type: String },
		return: returnSchema,
		source: { type: String },
	},
	{
		timestamps: true,
	}
);

export const Order = mongoose.model('orders', ordersSchema);
