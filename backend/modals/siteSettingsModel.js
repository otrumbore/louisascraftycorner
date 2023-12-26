import mongoose from 'mongoose';

const siteSettingsSchema = mongoose.Schema(
	{
		website_banner: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

export const siteSettings = mongoose.model('site_settings', siteSettingsSchema);
