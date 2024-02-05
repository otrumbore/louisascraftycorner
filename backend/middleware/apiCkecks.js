import { v4 as uuidv4 } from 'uuid';
import { siteSettings } from '../models/siteSettingsModel.js';
import bcrypt from 'bcryptjs';

// Generate API key
export const generateApiKey = async () => {
	const genApi = uuidv4();
	console.log('generated website api: ', genApi);

	const hashedAPIKey = await bcrypt.hash(genApi, 10);
	try {
		// Assuming `siteSettings` is a Mongoose model, use `updateOne` instead of `findOneAndUpdate`
		await siteSettings.updateOne(
			{ name: 'settings' },
			{ $set: { apiKey: hashedAPIKey } }
		);
	} catch (error) {
		// Handle the error appropriately, you can log it or throw it
		console.error('Error generating API key:', error);
		throw new Error('Could not generate API key');
	}

	return genApi;
};

export const validateApiKey = async (req, res, next) => {
	const apiKey = req.headers['api-key'];

	if (!apiKey) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	//console.log(apiKey);

	try {
		const siteSettingsData = await siteSettings.findOne({ name: 'settings' });

		if (!siteSettingsData || !siteSettingsData.apiKey) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const apiMatch = await bcrypt.compare(apiKey, siteSettingsData.apiKey);

		//console.log('api key match: ', apiMatch);

		if (!apiMatch) {
			return res.status(401).json({ error: 'Unauthorized' });
		}
		next();
	} catch (error) {
		console.error('Error validating API key:', error);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
};

export default validateApiKey;
