import mongoose from 'mongoose';

const pagesSchema = mongoose.Schema(
	{
		page_name: { type: String, required: true },
		content: [
			{
				name: { type: String },
				title: { type: String },
				image: { type: String, default: '' },
				data: { type: String, required: true },
				link: { type: String, default: '/' },
				active: { type: Boolean, default: false },
			},
		],
	},
	{
		timestamps: true,
	}
);

export const Page = mongoose.model('pages', pagesSchema);
