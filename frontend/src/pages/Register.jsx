import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const Register = () => {
	const API_URL = import.meta.env.VITE_SERVER_API_URL;

	const [formData, setFormData] = useState({
		name: '',
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	const { name, username, email, password, confirmPassword } = formData;

	const [registerError, setRegisterError] = useState('');
	const { enqueueSnackbar } = useSnackbar();

	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async (e) => {
		e.preventDefault();

		try {
			// Check if any form fields are empty
			if (!name || !username || !email || !password || !confirmPassword) {
				// Handle empty field(s) - you can show an error message to the user
				setRegisterError('Please fill in all fields!');
				console.error('Please fill in all fields');
				return;
			}

			// Validate email using regex pattern
			const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailPattern.test(email)) {
				setRegisterError('Please enter a valid email address!');
				return;
			}

			if (confirmPassword !== password) {
				setRegisterError('Passwords do not match!');
				return;
			}

			const newUser = {
				name: name.trim(),
				username: username.trim(),
				email: email.trim(),
				password: password.trim(),
			};

			// Make a POST request to your backend API
			const res = await axios.post(`http://${API_URL}/user/register`, newUser);

			enqueueSnackbar(
				'Welcome ' + name + ', Please confirm your email to login!',
				{
					variant: 'success',
					anchorOrigin: {
						horizontal: 'center',
						vertical: 'top',
					},
					autoHideDuration: 10000,
				}
			);
			//console.log('User registered:', res.data); // Log the response data (for verification, remove in production)

			// Clear form fields after successful registration
			setFormData({
				name: '',
				username: '',
				email: '',
				password: '',
				confirmPassword: '',
			});

			// Handle any further actions after successful registration (redirect, show success message, etc.)
		} catch (error) {
			console.error('Registration error:', error.message);
			enqueueSnackbar('Error: ' + error.message, {
				variant: 'error',
				anchorOrigin: {
					horizontal: 'center',
					vertical: 'top',
				},
				autoHideDuration: 10000,
			});
			// Handle error responses (show error message to the user, etc.)
		}
	};

	return (
		<div className={`p-4 mt-[8rem] w-full min-h-[65vh] flex justify-center`}>
			<div className='flex flex-col mt-[5%] w-full h-full max-w-[1400px] items-center justify-center'>
				<h2 className='text-3xl mb-8'>Happy to have you join us!</h2>
				<div className='w-full lg:w-[40%]'>
					{registerError && (
						<div className='flex mb-4 py-2 px-2 w-full justify-center border-2 border-red-400 bg-red-200 rounded-md'>
							{registerError}
						</div>
					)}
					<form onSubmit={onSubmit} className='mt-2 space-y-2'>
						<div>
							<input
								type='text'
								className='p-4 w-[100%] border-4 rounded-md text-lg border-slate-300'
								placeholder='Name'
								name='name'
								value={name}
								onChange={onChange}
								required // Make the name field required
							/>
						</div>
						<div>
							<input
								type='text'
								className='p-4 w-[100%] border-4 rounded-md text-lg border-slate-300'
								placeholder='Username'
								name='username'
								value={username}
								onChange={onChange}
								required // Make the username field required
								minLength='4' // Set minimum length for the username
							/>
						</div>
						<div>
							<input
								type='email'
								className='p-4 w-[100%] border-4 rounded-md text-lg border-slate-300'
								placeholder='Email Address'
								name='email'
								value={email}
								onChange={onChange}
								required // Make the email field required
							/>
						</div>
						<div>
							<input
								type='password'
								className='p-4 w-[100%] border-4 rounded-md text-lg border-slate-300'
								placeholder='Password'
								name='password'
								value={password}
								onChange={onChange}
								required // Make the password field required
								minLength='6' // Set minimum length for the password
							/>
						</div>
						<div>
							<input
								type='password'
								className='p-4 w-[100%] border-4 rounded-md text-lg border-slate-300'
								placeholder='Confirm Password'
								name='confirmPassword'
								value={confirmPassword}
								onChange={onChange}
								required // Make the password field required
								minLength='6' // Set minimum length for the password
							/>
						</div>
						<div className='flex justify-end'>
							<button
								type='submit'
								className='w-full lg:w-auto mt-4 border-2 px-8 py-2 border-slate-400 bg-slate-300 hover:bg-slate-400 hover:border-slate-500 hover:text-white hover:shadow-slate-400 hover:shadow-lg rounded-md transition-all duration-300'
							>
								Register
							</button>
						</div>
					</form>
					<div className='mt-12 mb-20 flex flex-col lg:flex-row w-full justify-center items-center'>
						<h4 className='mt-4 lg:pr-4'>Already have an account?</h4>
						<Link className='w-full lg:w-auto' to='/login'>
							<button className='w-full lg:w-auto mt-4 border-2 px-8 py-2 border-slate-400 bg-slate-300 hover:bg-slate-400 hover:border-slate-500 hover:text-white hover:shadow-slate-400 hover:shadow-lg rounded-md transition-all duration-300'>
								Login
							</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;
