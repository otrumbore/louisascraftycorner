import mongoose from 'mongoose';

const siteSettingsSchema = mongoose.Schema(
	{
		website_banner: {
			type: String,
		},
		collections: [{ name: String }],
		apiKey: { type: String, default: '' },
	},
	{
		timestamps: true,
	}
);

export const siteSettings = mongoose.model('site_settings', siteSettingsSchema);
