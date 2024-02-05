import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_SERVER_API_URL;
const apiKey = import.meta.env.VITE_APP_APIKEY;

//sending error logs to the db for error handling and debugging
const sendErrorLog = async (data) => {
	try {
		const response = await axios.post(`${API_URL}/api/error_logging`, data, {
			headers: {
				'api-key': apiKey,
			},
		});
		return response;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const getErrorLogs = async () => {
	try {
		const token = Cookies.get('token');
		const response = await axios.get(`${API_URL}/api/error_logging`, {
			headers: {
				'api-key': apiKey,
			},
		});
		return response.data.data;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const sendActivityLog = async (data) => {
	try {
		const response = await axios.post(`${API_URL}/api/activity_logging`, data, {
			headers: {
				'api-key': apiKey,
			},
		});
		return response;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const getActivityLogs = async () => {
	try {
		const token = Cookies.get('token');
		const response = await axios.get(`${API_URL}/api/activity_logging`, {
			headers: {
				'api-key': apiKey,
			},
		});
		return response.data.data;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export default sendErrorLog;
