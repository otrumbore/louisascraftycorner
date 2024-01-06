import axios from 'axios';
import { LOCALIP } from '../config';

const getProducts = async () => {
	try {
		const response = await axios.get(`http://${LOCALIP}:5555/products`);
		return response.data.data;
	} catch (error) {
		console.log(error);
		return []; // Return an empty array or handle errors accordingly
	}
};

export default getProducts;
