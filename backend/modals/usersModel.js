import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true, // Trim whitespace from the beginning and end of the name
		},
		username: {
			type: String,
			unique: true,
			required: true,
			trim: true,
			validate: {
				validator: function (value) {
					// Regular expression pattern for allowed characters in username (letters, numbers, underscores)
					return /^[a-zA-Z0-9_]+$/.test(value);
				},
				message: 'Username can only contain letters, numbers, and underscores',
			},
		},
		password: {
			type: String,
			required: true,
		},
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
		phoneNumber: {
			type: String,
			validate: {
				validator: function (value) {
					// Simple regex to check if the phone number contains only digits and optional dashes or spaces
					return /^\d[-\s\d]*$/.test(value);
				},
				message: 'Invalid phone number format',
			},
		},
		role: {
			type: String,
			enum: ['user', 'moderator', 'admin'],
			default: 'user',
		},
		emailMarketing: {
			type: Boolean,
			default: true,
		},
		emailValidated: {
			type: Boolean,
			default: false,
		},
		lastActivity: {
			type: Date,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		enabled: {
			type: Boolean,
			default: false,
		},
		profilePicture: {
			type: String,
			default: 'default',
		},
		dateOfBirth: {
			type: Date,
		},
		address: {
			street: String,
			city: String,
			state: String,
			country: {
				type: String,
				default: 'US',
			},
			postalCode: String,
		},
	},
	{
		timestamps: true,
	}
);

export const User = mongoose.model('users', userSchema);
