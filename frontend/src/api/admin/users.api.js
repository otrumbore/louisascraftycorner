import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_SERVER_API_URL;
const token = Cookies.get('token');

const getUsers = async () => {
	try {
		const response = await axios.get(`${API_URL}/api/user/getUsers`);
		return response.data.data;
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
	} catch (error) {}
};

export default getUsers;
