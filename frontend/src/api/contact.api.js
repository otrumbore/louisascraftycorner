import axios from 'axios';

const API_URL = import.meta.env.VITE_SERVER_API_URL;
const apiKey = import.meta.env.VITE_APP_APIKEY;

export const sendContactEmail = async (data) => {
	try {
		const res = await axios.post(`${API_URL}/api/contact`, data, {
			headers: {
				'api-key': apiKey,
			},
		});
		return res;
	} catch (error) {
		console.error('Error sending contact email:', error);
		throw error;
	}
};

export default sendContactEmail;
