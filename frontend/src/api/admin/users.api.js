import axios from 'axios';

const getUsers = async () => {
	const API_URL = import.meta.env.VITE_SERVER_API_URL;
	try {
		const response = await axios.get(`${API_URL}/user/getUsers`);
		return response.data.data;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export default getUsers;
