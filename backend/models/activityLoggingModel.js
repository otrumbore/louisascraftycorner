import mongoose from 'mongoose';

const activityLoggingSchema = mongoose.Schema(
	{
		user: {
			username: {
				type: String,
				default: 'guest',
			},
			userId: {
				type: String,
				default: '0',
			},
		},
		activityData: {
			activity: { type: String },
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
