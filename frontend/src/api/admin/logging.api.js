import axios from 'axios';

const API_URL = import.meta.env.VITE_SERVER_API_URL;

//sending error logs to the db for error handling and debugging
const sendErrorLog = async () => {
	try {
		const response = await axios.get(`${API_URL}/api/user/getUsers`);
		return response.data.data;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const getErrorLogs = async () => {};

export const sendActivityLog = async () => {};

export const getActivityLog = async () => {};

export default sendErrorLog;
