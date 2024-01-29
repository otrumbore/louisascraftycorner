import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_SERVER_API_URL;

export const getEventsPage = async () => {
	try {
		const eventsPage = await axios.get(`${API_URL}/api/pages/events`);
		//console.log(eventsPage.data.data);
		return eventsPage.data.data;
	} catch (error) {
		console.log(error);
	}
};

export const updateEventsPage = async (data) => {
	try {
		console.log('running');
		const token = Cookies.get('token');
		const response = await axios.put(`${API_URL}/api/pages/events`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response.status === 200) {
			// Update successful
			return response.data; // You might want to return specific data if available
		} else {
			// Handle other status codes if needed
			console.error(`Unexpected status code: ${response.status}`);
			throw new Error('Unexpected server response');
		}
	} catch (error) {
		console.log(error);
	}
};

export const getAboutPage = async () => {};

export default getAboutPage;
