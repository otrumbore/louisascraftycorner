import axios from 'axios';
import { LOCALIP } from '../../config';

//sending error logs to the db for error handling and debugging
const sendErrorLog = async () => {
	try {
		const response = await axios.get(`http://${LOCALIP}:5555/user/getUsers`);
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
