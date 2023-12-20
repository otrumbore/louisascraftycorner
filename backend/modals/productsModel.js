import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
	{
		id: {
			type: Number,
			required: true,
			validate: {
				validator: function (value) {
					// Validation for positive numbers with a maximum of 6 digits
					return (
						Number.isInteger(value) && value > 0 && value.toString().length <= 6
					);
				},
				message: 'ID must be a positive number with a maximum of 6 digits',
			},
		},
		name: {
			type: String,
			required: true,
			trim: true,
			// Additional validation or sanitization for the name field, if needed
		},
		description: {
			type: String,
			required: true,
			// Additional validation or sanitization for the description field, if needed
		},
		price: {
			type: Number,
			required: true,
			validate: {
				validator: function (value) {
					// Validation for positive numbers with up to 2 decimal places
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
					// Validation for positive numbers with up to 2 decimal places
					return value >= 0 && /^\d+(\.\d{1,2})?$/.test(value.toString());
				},
				message:
					'Sale price must be a positive number with up to 2 decimal places',
			},
		},
		type: {
			type: String,
			required: true,
			// Additional validation or sanitization for the 'type' field, if needed
		},
		category: {
			type: String,
			required: true,
			// Additional validation or sanitization for the 'category' field, if needed
		},
		rating: {
			type: Number,
			validate: {
				validator: function (value) {
					// Validation for rating within the range of 1 to 5
					return value >= 1 && value <= 5;
				},
				message: 'Rating must be between 1 and 5',
			},
		},
		tags: {
			type: String,
			required: true,
			// Additional validation or sanitization for the 'tags' field, if needed
		},
		inventory: {
			type: Number,
			required: true,
			validate: {
				validator: function (value) {
					// Validation for positive numbers for inventory
					return value >= 0;
				},
				message: 'Inventory must be a positive number',
			},
		},
		img: {
			type: String,
			default: 'default-product.png', // Default value for 'img'
			// Additional validation or sanitization for the 'img' field, if needed
		},
	},
	{
		timestamps: true,
	}
);

export const Product = mongoose.model('products', productSchema);
