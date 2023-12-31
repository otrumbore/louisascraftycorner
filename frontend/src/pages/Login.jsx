import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useSnackbar } from 'notistack';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import the js-cookie library
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const Login = () => {
	const [formData, setFormData] = useState({
		username: '',
		password: '',
	});

	// Pattern for username: Alphanumeric with optional period, underscore, hyphen, and exclamation mark
	const [usernamePattern, setUsernamePattern] = useState('');

	// Pattern for password: At least 8 characters with at least one uppercase, one lowercase, one number, and one special character
	const [passwordPattern, setPasswordPattern] = useState('');

	const { addUserDetails, sendActivityStatus } = useUser();
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const [loginError, setLoginError] = useState('');

	const { username, password } = formData;

	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword((prevState) => !prevState);
	};

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
				sendActivityStatus(true);
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

		setUsernamePattern('/^[a-zA-Z0-9._!-]{4,30}$/');
		setPasswordPattern(
			'/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[!@#$%^&*()]).{8,}$/'
		);

		if (!username.match(usernamePattern) || !password.match(passwordPattern)) {
			!username.match(usernamePattern) &&
				setLoginError(
					'Username must be alphanumeric with optional period, underscore, hyphen, and exclamation mark.'
				);
			!password.match(passwordPattern) &&
				setLoginError(
					'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and be at least 8 characters long.'
				);
		} else {
			setLoginError(''); // Clear the login error message if both fields meet the pattern requirements

			// Proceed with login if validation passes
			loginUser();
		}
	};

	useEffect(() => {
		const token = Cookies.get('token');

		if (token) {
			fetchUserData();
		}
	}, []);

	return (
		<div className={`p-4 mt-[8rem] w-full min-h-[65vh] flex justify-center`}>
			<div className='flex flex-col mt-[5%] w-full h-full max-w-[1400px] items-center justify-center'>
				<h2 className='text-3xl mb-8'>Welcome Back!</h2>
				<div className='w-full lg:w-[40%]'>
					{loginError && (
						<div className='flex mb-4 py-2 px-2 w-full justify-center border-2 border-red-400 bg-red-200 rounded-md'>
							{loginError}
						</div>
					)}
					<form onSubmit={onSubmit} className='mt-2 space-y-2'>
						<div>
							<input
								type='text'
								className={`p-4 w-[100%] border-4 rounded-md text-lg ${
									!username.match(usernamePattern)
										? 'border-red-500'
										: 'border-slate-300'
								}`}
								placeholder='Username'
								name='username'
								value={username}
								onChange={onChange}
								required
								minLength={4} // Example: Minimum length validation
								maxLength={30} // Example: Maximum length validation
								pattern='[a-zA-Z0-9._!-]+' // Example: Pattern validation
							/>
						</div>
						<div className='relative'>
							<input
								type={showPassword ? 'text' : 'password'}
								className={`p-4 w-[100%] border-4 rounded-md text-lg ${
									!password.match(passwordPattern)
										? 'border-red-500'
										: 'border-slate-300'
								}`}
								placeholder='Password'
								name='password'
								value={password}
								onChange={onChange}
								required
								minLength={8}
								pattern='(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}'
								title='Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and be at least 8 characters long.'
							/>
							<button
								type='button'
								onClick={togglePasswordVisibility}
								className='absolute right-6 top-1/2 transform -translate-y-1/2 focus:outline-none text-gray-500'
							>
								{password &&
									(showPassword ? (
										<FaRegEyeSlash size={22} />
									) : (
										<FaRegEye size={22} />
									))}
							</button>
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
					<div className='mt-12 mb-20 flex flex-col lg:flex-row w-full justify-center items-center'>
						<h4 className='mt-4 lg:pr-4'>Need an account?</h4>
						<Link className='w-full lg:w-auto' to='/register'>
							<button className='w-full lg:w-auto mt-4 border-2 px-8 py-2 border-slate-400 bg-slate-300 hover:bg-slate-400 hover:border-slate-500 hover:text-white hover:shadow-slate-400 hover:shadow-lg rounded-md transition-all duration-300'>
								Sign Up
							</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
