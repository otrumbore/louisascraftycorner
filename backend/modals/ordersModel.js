import mongoose from 'mongoose';

const ordersSchema = mongoose.Schema(
	{
		email: {
			type: String,
		},
		userID: {},
		orderNum: {},
		items: {
			storeId: {
				type: Number,
			},
			price: { type: Number },
			sale: { type: Number },
		},
		shipping: {
			tracking: { type: String },
			vendor: { type: String },
			method: { type: String },
		},
		billName: { type: String },
		billAdd: {
			streetAdd1: { type: String },
			streetAdd2: { type: String },
			city: { type: String },
			zip: { type: Number },
		},
		shipName: { type: String },
		shipAdd: {
			streetAdd1: { type: String },
			streetAdd2: { type: String },
			city: { type: String },
			zip: { type: Number },
		},
		phone: { type: String },
		altEmail: { type: String },
		status: {
			type: { type: String },
			timestamps: true,
		},
		prices: {
			discounts: { type: String },
			subtotal: { type: Number },
			shipping: { type: Number },
			tax: { type: Number },
			total: { type: Number },
		},
		customerNotes: { type: String },
		return: {
			returnNumber: { type: String },
			tracking: { type: String },
			refundAmount: { type: String },
		},
		source: {
			//mobile, website, craftshow?
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

export const Order = mongoose.model('orders', ordersSchema);
