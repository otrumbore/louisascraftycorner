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

const ordersSchema = mongoose.Schema(
	{
		email: { type: String },
		userID: { type: String },
		orderNum: { type: String },
		items: [itemSchema], // Array of items
		shipping: shippingSchema, // Nested shipping schema
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
		status: [{ type: String }, { timestamps: true }],
		prices: pricesSchema, // Nested prices schema
		customerNotes: { type: String },
		return: returnSchema, // Nested return schema
		source: { type: String },
	},
	{
		timestamps: true,
	}
);

export const Order = mongoose.model('orders', ordersSchema);
