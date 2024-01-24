import axios from 'axios';

const API_URL = import.meta.env.VITE_SERVER_API_URL;

const getSettings = async () => {
	try {
		const response = await axios.get(`${API_URL}/api/admin/site_settings`);
		//console.log(response.data.data[0]);
		return response.data.data[0];
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const getSetting = async (id) => {
	try {
		const response = await axios.get(
			`${API_URL}/api/admin/site_settings/${id}`
		);
		return response.data.data;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const updateSetting = async (data) => {
	const id = '658722f06968a772f2cdde55'; //sitesettings id temp needs fix
	try {
		const token = Cookies.get('token');
		const response = await axios.put(
			`${API_URL}/api/admin/site_settings/${id}`,
			data
		);
		//console.log(response);
		return response;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export default getSettings;
