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
		return eventsPage.data.data;
	} catch (error) {
		console.log(error);
	}
};

export const getAboutPage = async () => {
	try {
		const aboutPage = await axios.get(`${API_URL}/api/pages/about`, {
			headers: {
				'api-key': apiKey,
			},
		});
		return aboutPage.data.data;
	} catch (error) {
		console.log(error);
	}
};

export const getHomePage = async () => {
	try {
		const homePage = await axios.get(`${API_URL}/api/pages/home`, {
			headers: {
				'api-key': apiKey,
			},
		});

		return homePage.data.data;
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
		return response;
	} catch (error) {
		console.log(error);
	}
};

export default getAboutPage;
