import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const API_URL = import.meta.env.VITE_SERVER_API_URL;
const apiKey = import.meta.env.VITE_APP_APIKEY;

const ForgotUsername = ({ setError, error }) => {
	const [userEmail, setUserEmail] = useState('');
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();

	const handleGetUsername = async () => {
		try {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(userEmail)) {
				setError('Invalid email format');
				return;
			}

			const res = await axios.get(
				`${API_URL}/api/user/forgot-username/${userEmail.trim()}`,
				{
					headers: {
						'api-key': apiKey,
					},
				}
			);

			enqueueSnackbar(
				'If the user does exist, you will receive an email with your username!',
				{ variant: 'info' }
			);
			setUserEmail('');
			console.log(res);
			navigate('/login');
		} catch (err) {
			console.error('Error fetching username:', err);
		}
	};

	return (
		<div className='w-full'>
			<div className='flex flex-col gap-y-4'>
				<input
					type='email'
					className={`input ${error && 'border-red-600'}`}
					placeholder='Email'
					value={userEmail}
					onChange={(e) => {
						setUserEmail(e.target.value);
					}}
				/>
				<button className='btn' onClick={handleGetUsername}>
					Get Username
				</button>
			</div>
		</div>
	);
};

const ForgotPassword = ({ setError, error }) => {
	const [username, setUsername] = useState('');
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const handleResetPassword = async () => {
		try {
			const res = await axios.get(
				`${API_URL}/api/user/forgot-password/${username.trim()}`,
				{
					headers: {
						'api-key': apiKey,
					},
				}
			);

			enqueueSnackbar(
				'If the user does exist, you will receive an email with instructions to reset your password!',
				{ variant: 'info' }
			);
			setUsername('');
			console.log(res);
			navigate('/login');
		} catch (err) {
			console.error('Error fetching username:', err);
		}
	};
	return (
		<div className='w-full'>
			<div className='flex flex-col gap-y-4'>
				<input
					type='text'
					placeholder='Username'
					className='input'
					value={username}
					onChange={(e) => {
						setUsername(e.target.value);
					}}
				/>
				<button
					className='btn disabled:opacity-50 disabled:cursor-not-allowed'
					onClick={handleResetPassword}
					//disabled={true}
				>
					Reset Password
				</button>
			</div>
		</div>
	);
};

const ForgotUser = () => {
	const { page } = useParams();
	const navigate = useNavigate();
	const [forgotView, setForgotView] = useState('password');
	const [forgetError, setForgetError] = useState('');

	useEffect(() => {
		if (page && (page === 'username' || page === 'password')) {
			setForgotView(page);
		} else {
			navigate('/login');
		}
		document.title = "Forgot User | Louisa's Crafty Corner";
		window.scroll(0, 0);
	}, [page, navigate]);

	const handleError = (error) => {
		setForgetError(error);
	};

	return (
		<div className='p-4 w-full min-h-[65vh]'>
			<div className='flex flex-col items-center'>
				<h2 className='text-2xl text-gray-600 text-center mb-4'>
					Forgot Username or Password?
				</h2>
				<div className='mt-4 flex justify-center items-center'>
					<button
						className={`${
							forgotView === 'username' ? 'btn' : 'btn-outline'
						} rounded-r-none hover:ring-0 hover:ring-offset-0`}
						onClick={() => setForgotView('username')}
					>
						Forgot Username?
					</button>
					<button
						className={`${
							forgotView === 'password' ? 'btn' : 'btn-outline'
						} rounded-l-none hover:ring-0 hover:ring-offset-0`}
						onClick={() => setForgotView('password')}
					>
						Forgot Password?
					</button>
				</div>
				{forgetError && (
					<div className='flex mt-8 py-2 px-2 w-full lg:max-w-[30%] justify-center border-2 border-red-400 bg-red-200 rounded-md'>
						{forgetError}
					</div>
				)}
				<div
					className={`mt-4 flex w-full justify-center lg:max-w-[30%] transition-all duration-300`}
				>
					{forgotView === 'username' ? (
						<ForgotUsername setError={handleError} error={forgetError} />
					) : (
						<ForgotPassword setError={handleError} error={forgetError} />
					)}
				</div>
			</div>
		</div>
	);
};

export default ForgotUser;
