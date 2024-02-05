import express from 'express';
import { sendContactEmail } from '../scripts/nodeMailer.js';
import validateApiKey from '../middleware/apiCkecks.js';

const router = express.Router();

router.post('/', validateApiKey, (req, res) => {
	try {
		//const {name, email, message} = req.body;
		sendContactEmail(req.body);
		console.log('email sending');
		res.status(200).json({ message: 'contact message sent' });
	} catch (err) {
		res.status(500).json({ message: 'Server error: Could not send email!' });
	}
});

export default router;
