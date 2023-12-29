import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import the js-cookie library

const Login = () => {
	const [formData, setFormData] = useState({
		username: '',
		password: '',
	});

	const { addUserDetails } = useUser();
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const [loginError, setLoginError] = useState('');

	const { username, password } = formData;

	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const loginUser = async () => {
		try {
			const res = await axios.post('http://10.0.0.85:5555/user/login', {
				username,
				password,
			});

			//console.log('Login successful:', res.data);

			// Set token in a cookie with expiration time (adjust the expiry as needed)
			const now = new Date();
			const expirationTime = new Date(now.getTime() + 3600 * 1000); // Expiry in 1 hour
			Cookies.set('token', res.data.token, {
				expires: expirationTime,
				path: '/',
			});

			// Fetch user data after successful login
			fetchUserData();
		} catch (error) {
			console.error('Login error:', error.message);
			setLoginError('Wrong username or password');
		}
	};

	const fetchUserData = async () => {
		try {
			const token = Cookies.get('token');
			if (token) {
				const res = await axios.get('http://10.0.0.85:5555/user/getUser', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				addUserDetails(res.data);
				enqueueSnackbar('Logged in as ' + res.data.username, {
					variant: 'success',
					anchorOrigin: {
						horizontal: 'center',
						vertical: 'top',
					},
					autoHideDuration: 2000,
				});
				navigate('/user/dashboard');
			}
		} catch (error) {
			console.error('User data fetch error:', error.message);
			enqueueSnackbar('Failed to fetch user data', {
				variant: 'error',
				anchorOrigin: {
					horizontal: 'center',
					vertical: 'top',
				},
				autoHideDuration: 3000,
			});
		}
	};

	const onSubmit = (e) => {
		e.preventDefault();
		loginUser();
	};

	useEffect(() => {
		const token = Cookies.get('token');

		if (token) {
			fetchUserData();
		}
	}, []);

	return (
		<div className={`p-4 mt-[8rem] w-full min-h-[65vh] flex justify-center`}>
			<div className='flex flex-col mt-[10%] w-full h-full max-w-[1400px] items-center justify-center'>
				<h2 className='text-3xl mb-8'>Welcome Back!</h2>
				<div className='w-full lg:w-[40%]'>
					{loginError && (
						<div className='flex mb-4 py-2 w-full justify-center border-2 border-red-400 bg-red-200 rounded-md'>
							{loginError}
						</div>
					)}
					<form onSubmit={onSubmit} className='mt-2 space-y-2'>
						<div>
							<input
								type='text'
								className='p-4 w-[100%] border-4 border-slate-300 rounded-md text-lg'
								placeholder='Username'
								name='username'
								value={username}
								onChange={onChange}
								required
								minLength={4} // Example: Minimum length validation
								maxLength={30} // Example: Maximum length validation
								pattern='[a-zA-Z0-9._-]+' // Example: Pattern validation
							/>
						</div>
						<div>
							<input
								type='password'
								className='p-4 w-[100%] border-4 border-slate-300 rounded-md text-lg'
								placeholder='Password'
								name='password'
								value={password}
								onChange={onChange}
								required
								minLength={8} // Example: Minimum length validation
							/>
						</div>
						<div className='flex flex-col-reverse lg:flex-row w-full justify-between items-center'>
							<p className='mt-4 pl-1 text-sm'>Forgot username or password?</p>
							<button
								type='submit'
								className='w-full lg:w-auto mt-4 border-2 px-12 py-2 border-slate-400 bg-slate-300 hover:bg-slate-400 hover:border-slate-500 hover:text-white hover:shadow-slate-400 hover:shadow-lg rounded-md transition-all duration-300'
							>
								Login
							</button>
						</div>
					</form>
					<div className='mt-12 flex flex-col lg:flex-row w-full justify-center items-center'>
						<h4 className='mt-4 lg:pr-4'>Need an account?</h4>
						<button className='w-full lg:w-auto mt-4 border-2 px-8 py-2 border-slate-400 bg-slate-300 hover:bg-slate-400 hover:border-slate-500 hover:text-white hover:shadow-slate-400 hover:shadow-lg rounded-md transition-all duration-300'>
							Sign Up
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
