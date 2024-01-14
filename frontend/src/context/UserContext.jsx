import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import LoadingModal from '../components/LoadingModal';

import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export function UserProvider({ children }) {
	const navigate = useNavigate();
	const [userDetails, setUserDetails] = useState({});
	const [userFavorites, setUserFavorites] = useState([]);
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);
	const [userIsActive, setUserIsActive] = useState(true);

	const API_URL = import.meta.env.VITE_SERVER_API_URL;

	let inactivityTimer;

	const userTrackingEvents = [
		'mousemove',
		'keypress',
		'touchstart',
		'touchend',
		'click',
		'scroll',
		'input',
		'change',
		'focus',
	];

	const getUserDetails = async () => {
		try {
			const token = Cookies.get('token');
			if (token) {
				try {
					const userDetailsResponse = await axios.get(
						`${API_URL}/api/user/getUser`,
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					);

					if ('password' in userDetailsResponse.data) {
						const { password, ...userDetailsWithoutPassword } =
							userDetailsResponse.data;
						// userDetailsWithoutPassword now contains all properties from userDetailsResponse.data except 'password'

						// Assuming addUserDetails is a function to set userDetails in your state
						addUserDetails(userDetailsWithoutPassword);
						console.log('password found still not remvoed!');
					} else {
						// If 'password' field doesn't exist, set userDetails directly
						addUserDetails(userDetailsResponse.data);
						console.log('password not found so not remvoed!');
					}
				} catch (error) {
					console.error('Error fetching user details or favorites:', error);
					setLoading(false);
				}
			} else {
				setLoading(false);
			}
		} catch (error) {
			const token = Cookies.get('token');
			if (token) {
				Cookies.remove('token');
				setUserDetails({});
				setUserFavorites([]);
				navigate('/login');
			}
			console.error('User data fetch error:', error.message);
			enqueueSnackbar('Failed to fetch user data', {
				variant: 'error',
			});
		}
	};

	const getUserFavorites = async () => {
		try {
			const token = Cookies.get('token');
			if (token) {
				const favoritesResponse = await axios.get(
					`${API_URL}/api/user/favorites/${userDetails._id}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				setUserFavorites(favoritesResponse.data.data.items);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		setLoading(false);
	}, [userFavorites, userDetails]);

	// Function to send user activity status to the server
	const sendActivityStatus = (isActive) => {
		const token = Cookies.get('token');

		if (token && userDetails._id) {
			const config = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};

			const activityData = {
				isActive,
				// Include other relevant data if needed
			};
			axios
				.put(
					`${API_URL}/api/user/updateUser/${userDetails._id}`,
					activityData,
					config
				)
				.then((response) => {
					//console.log('Activity status updated:', response.data);
				})
				.catch((error) => {
					//console.error('Error updating activity status:', error.message);
				});
		}
	};

	useEffect(() => {
		setLoading(true);
		getUserDetails();
		sendActivityStatus(true);

		return () => {
			sendActivityStatus(false);
		};
	}, []);

	const resetInactivityTimer = () => {
		clearTimeout(inactivityTimer);
		inactivityTimer = setTimeout(() => {
			setUserIsActive(false);
			sendActivityStatus(false);
		}, 5 * 60 * 1000); // 5 minutes (converted to milliseconds)
	};

	const handleUserActivity = () => {
		!userIsActive && sendActivityStatus(true) && setUserIsActive(true);
		resetInactivityTimer();
	};

	useEffect(() => {
		if (userDetails._id) {
			console.log(userDetails);
			getUserFavorites();
			sendActivityStatus(true);

			const eventListener = () => handleUserActivity();

			userTrackingEvents.forEach((event) => {
				window.addEventListener(event, eventListener);
			});

			resetInactivityTimer();

			return () => {
				userTrackingEvents.forEach((event) => {
					window.removeEventListener(event, eventListener);
				});
				clearTimeout(inactivityTimer);
			};
		}
	}, [userDetails]);

	const addUserDetails = (userDetails) => {
		setUserDetails(userDetails);
	};

	const userRole = () => {
		if (
			userDetails &&
			(userDetails.role === 'admin' || userDetails.role === 'moderator')
		) {
			if (userDetails.role === 'admin') {
				return 3;
			}
			return 2;
		}
		return 1;
	};

	const removeFromFavorites = async (storeId) => {
		try {
			const token = Cookies.get('token');

			const updatedFavorites = userFavorites.filter(
				(item) => item.itemId !== storeId
			);

			setUserFavorites(updatedFavorites);

			const dataToSend = { items: updatedFavorites };

			// Update userFavorites with the filtered array
			//setUserFavorites(updatedFavorites);

			const favoritesResponse = await axios.put(
				`${API_URL}/api/user/favorites/${userDetails._id}`,
				dataToSend,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			getUserFavorites();
		} catch (error) {
			console.error('Error removing from favorites:', error);
		}
	};

	const addToFavorites = async (storeId) => {
		try {
			const token = Cookies.get('token');
			const updatedFavorites = [...userFavorites, { itemId: storeId }];
			setUserFavorites(updatedFavorites);
			const dataToSend = { items: updatedFavorites };
			const favoritesResponse = await axios.put(
				`${API_URL}/api/user/favorites/${userDetails._id}`,
				dataToSend,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			getUserFavorites();
		} catch (error) {
			console.error('Error adding to favorites:', error);
		}
	};

	return (
		<UserContext.Provider
			value={{
				userDetails,
				addUserDetails,
				userRole,
				sendActivityStatus,
				userFavorites,
				setUserFavorites,
				removeFromFavorites,
				addToFavorites,
				getUserDetails,
			}}
		>
			<LoadingModal loading={loading} />
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	return useContext(UserContext);
}
