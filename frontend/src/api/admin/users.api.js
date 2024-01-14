import axios from 'axios';

const getUsers = async () => {
	const API_URL = import.meta.env.VITE_SERVER_API_URL;
	try {
		const response = await axios.get(`${API_URL}/api/user/getUsers`);
		return response.data.data;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const getUserByUsername = async (username) => {
	try {
		const response = await axios.get(`${API_URL}/api/user/getUser/:username`);
		return true;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export default getUsers;
