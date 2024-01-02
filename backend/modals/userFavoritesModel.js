import mongoose from 'mongoose';

const favoritesSchema = mongoose.Schema(
	{
		email: {
			type: String,
			unique: true,
			required: true,
			trim: true,
			lowercase: true, // Convert email to lowercase to ensure consistency
			validate: {
				validator: function (value) {
					// Basic email format validation using regex
					return /^\S+@\S+\.\S+$/.test(value);
				},
				message: 'Invalid email format',
			},
		},
		userId: {
			type: String,
			required: true,
		},
		items: [
			{
				itemId: String,
			},
		],
	},
	{
		timestamps: true,
	}
);

export const Favorites = mongoose.model('user_favorites', favoritesSchema);
