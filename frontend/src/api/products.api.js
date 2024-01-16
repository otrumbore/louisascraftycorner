import axios from 'axios';

const API_URL = import.meta.env.VITE_SERVER_API_URL;

export const getProducts = async () => {
	try {
		const response = await axios.get(`${API_URL}/api/products`);
		return response.data.data;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const getProduct = async (id) => {
	try {
		const response = await axios.get(`${API_URL}/api/products/${id}`);
		return response.data.data;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const addProduct = async (data) => {
	try {
		const response = await axios.post(`${API_URL}/api/products/`, data, {
			headers: {
				'Content-Type': 'multipart/form-data',
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
		const response = await axios.put(`${API_URL}/api/products/${id}`, data);

		return response;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export default getProducts;
