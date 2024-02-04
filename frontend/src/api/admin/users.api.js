import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_SERVER_API_URL;
const apiKey = import.meta.env.VITE_APP_APIKEY;

const getUsers = async () => {
	try {
		const token = Cookies.get('token');
		const response = await axios.get(`${API_URL}/api/user/getUsers`, {
			headers: {
				Authorization: `Bearer ${token}`,
				'api-key': apiKey,
				'Content-Type': 'application/json',
			},
		});
		return response.data.data;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const getUser = async (token) => {
	try {
		const token = Cookies.get('token');
		const response = await axios.get(`${API_URL}/api/user/getUser`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const getUserByUsernameAndEmail = async (usernameEmail) => {
	try {
		const response = await axios.get(
			`${API_URL}/api/user/getUser/${usernameEmail}`
		);
		return response.data.exists || false;
	} catch (error) {
		console.log(error);
		return false;
	}
};

export const updateUser = async (id, data) => {
	try {
		const token = Cookies.get('token');
		if (!token) {
			console.error('Authorization token is missing.');
			return [];
		}
		const response = await axios.put(
			`${API_URL}/api/user/updateUser/${id}`,
			data,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			}
		);

		return response;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const createNewUser = async (data) => {
	try {
		// Make a POST request to your backend API
		const res = await axios.post(`${API_URL}/api/user/register`, data, {
			headers: {
				'api-key': apiKey,
			},
		});
		return res;
	} catch (error) {
		console.error(error);
	}
};

export default getUsers;
