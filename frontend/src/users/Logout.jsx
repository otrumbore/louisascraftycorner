import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie'; // Import the js-cookie library
import { useUser } from '../context/UserContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_SERVER_API_URL;

const Logout = () => {
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const { addUserDetails, sendActivityStatus, setUserFavorites } = useUser();

	useEffect(() => {
		const handleLogout = async () => {
			try {
				const token = Cookies.get('token');
				// const logoutRequest = await axios.post(`${API_URL}/api/user/logout`, {
				// 	headers: {
				// 		Authorization: `Bearer ${token}`,
				// 	},
				// });
				sendActivityStatus(false);
				// Clear the token cookie using js-cookie
				Cookies.remove('token', { path: '/' });
				//clear userDetails context
				addUserDetails([]);
				setUserFavorites([]);
				// Show a success notification
				enqueueSnackbar('Logged out successfully', {
					variant: 'success',
				});

				// Redirect to the home page after logout
				navigate('/');
			} catch (error) {
				console.error('Logout error:', error.message);
				enqueueSnackbar('Failed to log out', {
					variant: 'error',
				});
				navigate('/');
			}
		};

		handleLogout(); // Call the logout function when the component mounts

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Run only once when the component mounts

	// This component doesn't render anything visible
	return null;
};

export default Logout;
