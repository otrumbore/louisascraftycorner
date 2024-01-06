import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import LoadingModal from '../components/LoadingModal';
import { LOCALIP } from '../config';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export function UserProvider({ children }) {
	const navigate = useNavigate();
	const [userDetails, setUserDetails] = useState({});
	const [userFavorites, setUserFavorites] = useState([]);
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);
	const [userIsActive, setUserIsActive] = useState(true);

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
						`http://${LOCALIP}:5555/user/getUser`,
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
					} else {
						// If 'password' field doesn't exist, set userDetails directly
						addUserDetails(userDetailsResponse.data);
					}
				} catch (error) {
					console.error('Error fetching user details or favorites:', error);
					setLoading(false);
				}
			} else {
				setLoading(false);
				navigate('/');
			}
		} catch (error) {
			const token = Cookies.get('token');
			if (token) {
				Cookies.remove('token');
				setUserDetails({});
				navigate('/login');
			}
			console.error('User data fetch error:', error.message);
			enqueueSnackbar('Failed to fetch user data', {
				variant: 'error',
				anchorOrigin: {
					horizontal: 'center',
					vertical: 'top',
				},
				autoHideDuration: 5000,
			});
		}
	};

	const getUserFavorites = async () => {
		try {
			const token = Cookies.get('token');
			if (token) {
				const favoritesResponse = await axios.get(
					`http://${LOCALIP}:5555/api/user/favorites/${userDetails._id}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				setUserFavorites(favoritesResponse.data.data.items);
			}
		} catch (error) {}
	};
	// Log userFavorites when it changes
	useEffect(() => {
		//console.log(userFavorites);
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
					`http://${LOCALIP}:5555/user/updateUser/${userDetails._id}`,
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
		//console.log('userContext: ', userDetails);
	};

	const isAdmin = () => {
		if (userDetails && userDetails.role === 'admin') {
			return true;
		}
		return false;
	};

	const removeFromFavorites = async (storeId) => {
		console.log(userFavorites);
		console.log('storeId: ' + storeId);
		try {
			const token = Cookies.get('token');
			// Find the index of the item to remove from userFavorites
			const updatedFavorites = userFavorites.filter(
				(item) => item.itemId !== storeId
			);

			console.log('updated: ', updatedFavorites);

			setUserFavorites(updatedFavorites);

			// Prepare the data object to send to the API
			const dataToSend = { items: updatedFavorites };

			// Update userFavorites with the filtered array
			//setUserFavorites(updatedFavorites);

			// Send the updated userFavorites to the server by userId
			const favoritesResponse = await axios.put(
				`http://${LOCALIP}:5555/api/user/favorites/${userDetails._id}`,
				dataToSend,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			getUserFavorites();
			console.log(favoritesResponse);

			// Update the local state with the updated favorites received from the server
			// setUserFavorites(favoritesResponse.data.data.items);
		} catch (error) {
			console.error('Error removing from favorites:', error);
			// Handle error scenarios or display a message to the user
		}
	};

	const addToFavorites = async (storeId) => {
		try {
			const token = Cookies.get('token');

			// Fetch the details of the item to be added to favorites using its storeId
			// For example

			// Add the fetched item details to the userFavorites array
			// For example:
			const updatedFavorites = [...userFavorites, { itemId: storeId }];

			console.log(updatedFavorites);

			// Update userFavorites with the updated array
			setUserFavorites(updatedFavorites);

			// Prepare the data object to send to the API
			const dataToSend = { items: updatedFavorites };

			// Send the updated userFavorites to the server by userId
			// For example:
			const favoritesResponse = await axios.put(
				`http://${LOCALIP}:5555/api/user/favorites/${userDetails._id}`,
				dataToSend,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			// After successful addition, update the component state or fetch the updated favorites
			// For example:
			getUserFavorites();

			// You might need to fetch the updated favorites again from the server or handle the addition locally based on your app's architecture
		} catch (error) {
			console.error('Error adding to favorites:', error);
			// Handle error scenarios or display a message to the user
		}
	};

	return (
		<UserContext.Provider
			value={{
				userDetails,
				addUserDetails,
				isAdmin,
				sendActivityStatus,
				userFavorites,
				setUserFavorites,
				removeFromFavorites,
				addToFavorites,
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
