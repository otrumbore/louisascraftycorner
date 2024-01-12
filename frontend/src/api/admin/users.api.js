import axios from 'axios';
import { LOCALIP } from '../../config';

const getUsers = async () => {
	try {
		const response = await axios.get(`http://${LOCALIP}:5555/user/getUsers`);
		return response.data.data;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export default getUsers;
