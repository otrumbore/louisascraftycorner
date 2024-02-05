import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_SERVER_API_URL;
const apiKey = import.meta.env.VITE_APP_APIKEY;

export const getProducts = async () => {
	try {
		const response = await axios.get(`${API_URL}/api/products`, {
			headers: {
				'api-key': apiKey,
			},
		});
		return response.data.data;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const getProduct = async (id) => {
	try {
		const response = await axios.get(`${API_URL}/api/products/${id}`, {
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

export const addProduct = async (data) => {
	try {
		const token = Cookies.get('token');
		const response = await axios.post(`${API_URL}/api/products/`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
				'api-key': apiKey,
			},
		});
		return response;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const updateProduct = async (id, data) => {
	try {
		const token = Cookies.get('token');
		const response = await axios.put(`${API_URL}/api/products/${id}`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
				'api-key': apiKey,
			},
		});
		return response;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const getProductStoreIds = async () => {
	try {
		const response = await axios.get(`${API_URL}/api/products`, {
			headers: {
				'api-key': apiKey,
			},
		});

		const data = response.data.data.map((product) => ({
			name: product.name,
			storeId: product.storeId,
		}));

		return data;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export default getProducts;
