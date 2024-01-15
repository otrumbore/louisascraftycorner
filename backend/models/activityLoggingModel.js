import mongoose from 'mongoose';

const activityLoggingSchema = mongoose.Schema(
	{
		userId: {
			type: String,
			default: 'guest',
		},
		errorData: {
			error: { type: String },
			page: { type: String },
		},
		browser: {
			type: String,
		},
	},
	{
		timestamps: true,
		//collection: 'activity_log',
	}
);

export const activityLogging = mongoose.model(
	'activity_logs',
	activityLoggingSchema
);
