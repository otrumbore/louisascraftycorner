import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
	{
		storeId: {
			type: Number,
			unique: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		price: {
			type: Number,
			required: true,
			validate: {
				validator: function (value) {
					return value >= 0 && /^\d+(\.\d{1,2})?$/.test(value.toString());
				},
				message: 'Price must be a positive number with up to 2 decimal places',
			},
		},
		sale: {
			type: Number,
			required: true,
			validate: {
				validator: function (value) {
					return value >= 0 && /^\d+(\.\d{1,2})?$/.test(value.toString());
				},
				message:
					'Sale price must be a positive number with up to 2 decimal places',
			},
		},
		type: {
			type: String,
			required: true,
			trim: true,
		},
		category: {
			type: String,
			required: true,
			trim: true,
		},
		rating: {
			type: Number,
			validate: {
				validator: function (value) {
					return value >= 0 && value <= 5;
				},
				message: 'Rating must be between 0 and 5',
			},
			default: 0,
		},
		tags: {
			type: String,
			required: true,
			trim: true,
		},
		measurements: {
			type: String,
		},
		manCost: {
			type: Number,
			validate: {
				validator: function (value) {
					return value >= 0;
				},
				message: 'Inventory must be a positive number',
			},
		},
		storageLocation: {
			type: String,
			trim: true,
			default: 'N/A',
		},
		inventory: {
			type: Number,
			required: true,
			validate: {
				validator: function (value) {
					return value >= 0;
				},
				message: 'Inventory must be a positive number',
			},
		},
		image: {
			type: String,
		},
		images: [{ type: String }],
		active: {
			type: Boolean,
			default: false,
		},
		archived: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

// Pre-save middleware to generate 6-digit unique ID
productSchema.pre('save', async function (next) {
	try {
		let generatedId;
		do {
			generatedId = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit number
		} while ((await this.constructor.findOne({ storeId: generatedId })) !== null); // Check if it already exists
		this.storeId = generatedId; // Set the unique ID
		next();
	} catch (error) {
		next(error);
	}
});

export const Product = mongoose.model('products', productSchema);
