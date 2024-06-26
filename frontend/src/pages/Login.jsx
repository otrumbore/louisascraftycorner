import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useSnackbar } from 'notistack';
import { useNavigate, Link, useParams } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import the js-cookie library
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import sendErrorLog, { sendActivityLog } from '../api/logging.api';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { updateUser } from '../api/users.api';

const Login = () => {
	const API_URL = import.meta.env.VITE_SERVER_API_URL;
	const apiKey = import.meta.env.VITE_APP_APIKEY;
	const { status, userParam } = useParams();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		username: '',
		password: '',
	});
	const [usernamePattern, setUsernamePattern] = useState('');
	const [passwordPattern, setPasswordPattern] = useState('');

	const {
		addUserDetails,
		sendActivityStatus,
		setUserFavorites,
		getUserDetails,
	} = useUser();
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const [loginError, setLoginError] = useState('');

	const { username, password } = formData;

	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword((prevState) => !prevState);
	};

	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
	};

	const loginUser = async () => {
		try {
			const res = await axios.post(
				`${API_URL}/api/user/login`,
				{
					username,
					password,
					lastActivity: new Date(),
				},
				{
					headers: {
						'api-key': apiKey,
					},
				}
			);

			console.log(res);

			// Set token in a cookie with expiration time (adjust the expiry as needed)
			const now = new Date();
			const expirationTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // Expiry in 8 hours
			Cookies.set('token', res.data.token, {
				expires: expirationTime,
				path: '/',
			});

			//console.log(res.data.token);

			// Fetch user data after successful login
			fetchUserData();
		} catch (error) {
			console.error('Login error:', error.message);
			const errorData = {
				userId: username,
				errorData: { error: 'Login attempt error: ' + error, page: 'login' },
				browser: navigator.userAgent,
			};
			sendErrorLog(errorData);
			setLoginError('Wrong username or password');
			// Check if the error message indicates email validation
			if (
				error.response &&
				error.response.data &&
				error.response.data.message === 'emailValidation'
			) {
				// Handle email validation error
				setLoginError(
					'Email needs validation. Email has been resent. Please check your email.'
				);
			} else if (
				error.response &&
				error.response.data &&
				error.response.data.message === 'tooManyAttempts'
			) {
				// Handle email validation error
				setLoginError(
					'Account is disbaled due to too many failed login attempts!'
				);
			}
		} finally {
			setLoading(false);
		}
	};

	const fetchUserData = async () => {
		try {
			const token = Cookies.get('token');
			if (!token) {
				enqueueSnackbar('No token', { variant: 'error' });
				setLoading(false);
				return;
			}

			const res = await axios.get(`${API_URL}/api/user/getUser`, {
				headers: { Authorization: `Bearer ${token}`, 'api-key': apiKey },
			});

			if (!res.data.enabled || !res.data.emailValidated) {
				sendActivityStatus(false);

				// Clear the token cookie using js-cookie
				Cookies.remove('token');

				// Clear userDetails context
				addUserDetails({});
				setUserFavorites([]);

				if (res.data.failedAttempts >= 3) {
					enqueueSnackbar(
						`${res.data.username} has been locked. Too many failed attempts.`,
						{
							variant: 'warning',
						}
					);
					return;
				}

				if (!res.data.enabled) {
					enqueueSnackbar(`Username ${res.data.username} is disabled.`, {
						variant: 'info',
					});
					return;
				}

				if (!res.data.emailValidated) {
					enqueueSnackbar(`${res.data.username} has not validated email`, {
						variant: 'info',
					});
					return;
				}

				return;
			}
			// const data2 = {
			// 	user: { username: userDetails.username, userId: userDetails._id },
			// 	activityData: {
			// 		activity: 'edited ' + data.name + ' product',
			// 		page: 'admin/editproduct',
			// 	},
			// 	browser: '',
			// };

			try {
				const activity = {
					user: { username: res.data.username, userId: res.data.userId },
					activityData: { activity: 'sucessful login', page: 'login' },
					browser: navigator.userAgent,
				};

				sendActivityLog(activity);
			} catch (error) {
				console.log('could not send activity log');
			}

			getUserDetails();
			sendActivityStatus(true);
			enqueueSnackbar(`Welcome back, ${res.data.username}`, {
				variant: 'success',
			});
			navigate('/user/dashboard');
		} catch (error) {
			console.error('User data fetch error:', error);
			const errorData = {
				user: { username: username, userId: '' },
				errorData: { error: 'Unsucessful login ' + error, page: 'login' },
				browser: navigator.userAgent,
			};
			sendErrorLog(errorData);
			enqueueSnackbar('Failed to fetch user data', { variant: 'error' });
		} finally {
			setLoading(false);
		}
	};

	const validateInputs = () => {
		if (
			!new RegExp(usernamePattern).test(username) ||
			!new RegExp(passwordPattern).test(password)
		) {
			!username.match(new RegExp(usernamePattern)) &&
				setLoginError(
					'Username must be alphanumeric with optional period, underscore, hyphen, and exclamation mark.'
				);
			!password.match(new RegExp(passwordPattern)) &&
				setLoginError(
					'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and be at least 8 characters long.'
				);
			setLoading(false);
			return false;
		}
		return true;
	};

	const onSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		setShowPassword(false);

		setUsernamePattern(
			/^[a-zA-Z0-9._!-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$|^[a-zA-Z0-9._!-]{4,30}$/
		);
		setPasswordPattern(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/
		);

		if (validateInputs()) {
			setLoginError(''); // Clear the login error message if both fields meet the pattern requirements
			// Proceed with login if validation passes
			loginUser();
			return;
		}

		setLoading(false);
	};

	useEffect(() => {
		window.scroll(0, 0);
		document.title = "Login | Louisa's Custom Crafts";
		const token = Cookies.get('token');

		if (token) {
			//fetchUserData();
			navigate('/user/dashboard');
		}

		if (userParam) {
			setFormData({ ...formData, username: userParam.trim() });
		}

		if (status === 'verify-success') {
			enqueueSnackbar(`Email has been validated, you may log in!`, {
				variant: 'success',
			});
		} else if (status === 'verify-fail') {
			enqueueSnackbar(
				`Email verification unsuccessful! Please log in to resend another validation  email!`,
				{
					variant: 'error',
				}
			);
		}
	}, []);

	return (
		<div className={`p-4 w-full min-h-[65vh] flex justify-center`}>
			<div className='flex flex-col mt-[5%] w-full h-full max-w-[1400px] items-center justify-center'>
				<h2 className='text-3xl mb-8'>Welcome Back!</h2>
				<div className='w-full lg:w-[40%]'>
					{loginError && (
						<div className='flex mb-4 py-2 px-2 w-full justify-center border-2 border-red-400 bg-red-200 rounded-md'>
							{loginError}
						</div>
					)}
					<form onSubmit={onSubmit} className='mt-2 space-y-2'>
						<div className='relative'>
							<input
								type='text'
								className={`input ${
									!username.match(usernamePattern) ? 'border-red-500' : null
								}`}
								placeholder='Username or Email'
								name='username'
								value={username}
								onChange={onChange}
								required
								minLength={4} // Example: Minimum length validation
								maxLength={30} // Example: Maximum length validation
								title={'Username or Email'}
								//pattern='^[a-zA-Z0-9._!-]{4,30}$' // Example: Pattern validation
								tabIndex={1}
							/>
							{username && (
								<button
									type='button'
									onClick={() => {
										setFormData({ ...formData, username: '' });
									}}
									className='absolute right-4 top-1/2 transform -translate-y-1/2 focus:outline-none text-gray-500 z-[100]'
								>
									<MdClose size={25} />
								</button>
							)}
						</div>
						<div className='relative'>
							<input
								type={showPassword ? 'text' : 'password'}
								tabIndex={2}
								className={`input ${
									!password.match(passwordPattern) ? 'border-red-500' : null
								}`}
								placeholder='Password'
								name='password'
								value={password}
								onChange={onChange}
								required
								minLength={8}
								//pattern='^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()]).{8,}$'
								title='Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and be at least 8 characters long.'
							/>
							{password && (
								<button
									type='button'
									onClick={togglePasswordVisibility}
									className='absolute right-12 top-1/2 transform -translate-y-1/2 focus:outline-none text-gray-500'
								>
									{showPassword ? (
										<FaRegEyeSlash size={22} />
									) : (
										<FaRegEye size={22} />
									)}
								</button>
							)}
							{password && (
								<button
									type='button'
									onClick={() => {
										setFormData({ ...formData, password: '' });
									}}
									className='absolute right-4 top-1/2 transform -translate-y-1/2 focus:outline-none text-gray-500 z-[100]'
								>
									<MdClose size={25} />
								</button>
							)}
						</div>
						<div className='flex flex-col-reverse lg:flex-row w-full justify-between items-center'>
							<Link to={'/user/forgot/password'} className='mt-4 pl-1 text-sm'>
								Forgot username or password?
							</Link>
							<button
								type='submit'
								className={`btn px-16 py-2 w-full lg:w-auto mt-4`}
								tabIndex={3}
								disabled={loading}
							>
								{loading ? (
									<span className='flex'>
										<AiOutlineLoading3Quarters className='h-5 w-5 mr-2 animate-spin' />
										Crafting...
									</span>
								) : (
									'Login'
								)}
							</button>
						</div>
					</form>
					<div className='mt-12 mb-20 flex flex-col lg:flex-row w-full justify-center items-center'>
						<h4 className='mt-4 lg:pr-4'>Need an account?</h4>
						<Link className='w-full lg:w-auto' to='/register'>
							<button className='w-full lg:w-auto mt-4 btn-outline'>
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
