import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_SERVER_API_URL;

//requires admin
export const getAllOrders = async () => {
	try {
		const token = Cookies.get('token');
		const response = await axios.get(`${API_URL}/api/orders`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data.data;
	} catch (error) {
		console.log(error);
		return [];
	}
};

// user get orders
export const getOrders = async (userId, email) => {
	try {
		const token = Cookies.get('token');
		let url = `${API_URL}/api/orders/${userId}`;

		if (email) {
			url += `?email=${email}`;
		}

		const response = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data.data;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const getOrder = async (id) => {
	try {
		const response = await axios.get(`${API_URL}/api/orders/${id}`);
		return response.data.data;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const createOrder = async (data) => {
	try {
		const token = Cookies.get('token');
		const response = await axios.post(`${API_URL}/api/orders/`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const updateOrder = async (id, data) => {
	try {
		const token = Cookies.get('token');
		const response = await axios.put(`${API_URL}/api/orders/${id}`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export default getOrders;
