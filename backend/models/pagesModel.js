import mongoose from 'mongoose';

const pagesSchema = mongoose.Schema(
	{
		page_name: { type: String, required: true },
		content: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

export const Page = mongoose.model('pages', pagesSchema);
