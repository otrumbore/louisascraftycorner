import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const API_URL = import.meta.env.VITE_SERVER_API_URL;
const apiKey = import.meta.env.VITE_APP_APIKEY;

const PasswordReset = () => {
	const { emailToken } = useParams();
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const [newPassword, setNewPassword] = useState('');
	const [conNewPass, setConNewPass] = useState('');
	const [showError, setShowError] = useState('');

	const resetPasswordSubmit = async () => {
		const newPass = newPassword.trim();
		const confirmNewPass = conNewPass.trim();

		// Check if passwords match
		if (newPass !== confirmNewPass) {
			setShowError('New passwords do not match! Please try again!');
			return;
		}

		// Check for password strength
		const isStrongPassword =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
				newPass
			);

		if (!isStrongPassword) {
			setShowError(
				'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character.'
			);
			return;
		}

		try {
			const data = { newPassword: confirmNewPass };
			const res = await axios.put(
				`${API_URL}/api/user/reset-password/${emailToken.trim()}`,
				data,
				{
					headers: {
						'api-key': apiKey,
					},
				}
			);

			console.log(res);

			if (res.status === 200) {
				enqueueSnackbar('Password has successfully been updated!', {
					variant: 'success',
				});
				navigate('/login');
			} else {
				enqueueSnackbar('An error has occurred, please try again', {
					variant: 'error',
				});
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		const token = Cookies.get('token');
		if (!emailToken || token) {
			navigate('/login');
		}
	}, []);
	return (
		<div className='w-full min-h-[65vh] flex justify-center'>
			<div className='w-full max-w-[1200px] flex justify-center'>
				<div className='p-4 w-full flex flex-col gap-8 justify-center items-center'>
					<h2 className='text-2xl font-semibold'>Reset Password</h2>
					{showError && (
						<div className='flex mt-8 py-2 px-2 w-full lg:max-w-[30%] justify-center border-2 border-red-400 bg-red-200 rounded-md'>
							{showError}
						</div>
					)}
					<div className='flex flex-col gap-4 w-full lg:w-[40%]'>
						<input
							type='password'
							className='input'
							placeholder='New Password'
							value={newPassword}
							onChange={(e) => {
								setNewPassword(e.target.value);
							}}
						/>
						<input
							type='password'
							className='input'
							placeholder='Confirm New Password'
							value={conNewPass}
							onChange={(e) => {
								setConNewPass(e.target.value);
							}}
						/>
						<div className='flex lg:justify-end'>
							<button
								className='btn w-full lg:w-[50%]'
								onClick={resetPasswordSubmit}
							>
								Save New Password
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PasswordReset;
