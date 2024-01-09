import axios from 'axios';
import { LOCALIP } from '../config';

const getProducts = async () => {
	try {
		const response = await axios.get(`http://${LOCALIP}:5555/products`);
		return response.data.data;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const getProduct = async (id) => {
	try {
		const response = await axios.get(`http://${LOCALIP}:5555/products/${id}`);
		return response.data.data;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export default getProducts;
