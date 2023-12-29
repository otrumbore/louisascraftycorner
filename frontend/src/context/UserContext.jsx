import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import LoadingModal from '../components/LoadingModal';

const UserContext = createContext();

export function UserProvider({ children }) {
	const [userDetails, setUserDetails] = useState({});
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getUserDetails = async () => {
			try {
				const token = Cookies.get('token');
				if (token) {
					const res = await axios.get('http://10.0.0.85:5555/user/getUser', {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

					addUserDetails(res.data);
					//console.log(res.data.roles);
					setLoading(false);
				} else {
					setLoading(false);
				}
			} catch (error) {
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

		setLoading(true);
		getUserDetails();
	}, []);

	const addUserDetails = (userDetails) => {
		setUserDetails(userDetails);
		//console.log('userContext: ', userDetails);
	};

	const isAdmin = () => {
		if (
			userDetails &&
			Array.isArray(userDetails.roles) &&
			userDetails.roles.includes
		) {
			return userDetails.roles.includes('admin');
		}
		return false;
	};

	return (
		<UserContext.Provider value={{ userDetails, addUserDetails, isAdmin }}>
			<LoadingModal loading={loading} />
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	return useContext(UserContext);
}
