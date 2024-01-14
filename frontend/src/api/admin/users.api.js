import axios from 'axios';

const API_URL = import.meta.env.VITE_SERVER_API_URL;

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

export const updateUser = async (id) => {
	try {
		const respone = await axios.get(`${API_URL}/api/user/updateUser/${id}`);
		return respone;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const createNewUser = async (data) => {
	try {
	} catch (error) {}
};

export default getUsers;
