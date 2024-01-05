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

					addUserDetails(userDetailsResponse.data);

					const favoritesResponse = await axios.get(
						`http://${LOCALIP}:5555/api/user/favorites/${userDetailsResponse.data._id}`,
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					);

					setUserFavorites(favoritesResponse.data.data.items); // Assuming favoritesResponse.data contains a count property
					//console.log(userFavorites); // Logging the length of the items array

					//setLoading(false);
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
				setUserFavoritesCount({});
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
					console.log('Activity status updated:', response.data);
				})
				.catch((error) => {
					console.error('Error updating activity status:', error.message);
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

	return (
		<UserContext.Provider
			value={{
				userDetails,
				addUserDetails,
				isAdmin,
				sendActivityStatus,
				userFavorites,
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
