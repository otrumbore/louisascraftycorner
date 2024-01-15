import mongoose from 'mongoose';

const errorLoggingSchema = mongoose.Schema(
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
		//collection: 'error_logging',
	}
);

export const errorLogging = mongoose.model('error_logs', errorLoggingSchema);
