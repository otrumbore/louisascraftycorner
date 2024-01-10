import axios from 'axios';
import { LOCALIP } from '../config';

const getSettings = async () => {
	try {
		const response = await axios.get(
			`http://${LOCALIP}:5555/admin/site_settings`
		);
		console.log(response.data.data[0]);
		return response.data.data[0];
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const getSetting = async (id) => {
	try {
		const response = await axios.get(
			`http://${LOCALIP}:5555/admin/site_settings/${id}`
		);
		return response.data.data;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const updateSetting = async (id, data) => {
	try {
		const response = await axios.put(
			`http://${LOCALIP}:5555/admin/site_settings/${id}`,
			data
		);
		console.log(response);
		return response;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export default getSettings;
