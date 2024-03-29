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
		agreeTerms: {
			type: Boolean,
			default: true,
			//required: true,
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
		shipAddress: {
			line1: String,
			line2: String,
			city: String,
			state: String,
			country: {
				type: String,
				default: 'US',
			},
			postalCode: String,
		},
		billAddress: {
			line1: String,
			line2: String,
			city: String,
			state: String,
			country: {
				type: String,
				default: 'US',
			},
			postalCode: String,
		},
		emailVerificationToken: {
			type: String,
		},
		passwordReset: {
			lastReset: { type: Date, default: null },
			verificationToken: {
				token: { type: String, default: '' },
				expDate: { type: Date, default: null },
			},
		},
		failedAttempts: {
			type: Number,
			default: 0,
		},
		totalSpent: {
			type: Number,
			default: 0,
		},
		rewards: {
			spent: { type: Number, default: 0 },
			reward1Used: { type: Boolean, default: false },
			reward2Used: { type: Boolean, default: false },
			reward3Used: { type: Boolean, default: false },
			completed: { type: Number, default: 0 },
			extra_discount: { type: String, default: '' },
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

export const User = mongoose.model('users', userSchema);
