import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_SERVER_API_URL;
const apiKey = import.meta.env.VITE_APP_APIKEY;

export const getEventsPage = async () => {
	try {
		const eventsPage = await axios.get(`${API_URL}/api/pages/events`, {
			headers: {
				'api-key': apiKey,
			},
		});
		//console.log(eventsPage.data.data);
		return eventsPage.data.data;
	} catch (error) {
		console.log(error);
	}
};

export const updatePage = async (data) => {
	try {
		const { page_name } = data;
		const token = Cookies.get('token');
		const response = await axios.put(
			`${API_URL}/api/pages/${page_name}`,
			data,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					'api-key': apiKey,
				},
			}
		);
		if (response.status === 200) {
			// Update successful
			return response.data; // You might want to return specific data if available
		} else {
			// Handle other status codes if needed
			console.error(`Unexpected status code: ${response.status}`);
			//throw new Error('Unexpected server response');
			return response.status;
		}
	} catch (error) {
		console.log(error);
	}
};

export const getAboutPage = async () => {
	try {
		const eventsPage = await axios.get(`${API_URL}/api/pages/about`, {
			headers: {
				'api-key': apiKey,
			},
		});
		//console.log(eventsPage.data.data);
		return eventsPage.data.data;
	} catch (error) {
		console.log(error);
	}
};

export default getAboutPage;
