import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { getUserByUsernameAndEmail } from '../api/admin/users.api';

const Register = () => {
	const API_URL = import.meta.env.VITE_SERVER_API_URL;

	const [formData, setFormData] = useState({
		name: '',
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	const [agreeTerms, setAgreeTerms] = useState(false);

	const { name, username, email, password, confirmPassword } = formData;

	const [registerError, setRegisterError] = useState('');
	const { enqueueSnackbar } = useSnackbar();

	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleCheckboxChange = () => {
		setAgreeTerms(!agreeTerms);
	};

	const onSubmit = async (e) => {
		e.preventDefault();

		try {
			// Check if any form fields are empty
			if (!name || !username || !email || !password || !confirmPassword) {
				// Handle empty field(s) - you can show an error message to the user
				setRegisterError('Please fill in all fields!');
				window.scroll(0, 0);
				console.error('Please fill in all fields');
				return;
			}

			if (!agreeTerms) {
				setRegisterError('Must agree to Terms and Privacy Policy!');
				window.scroll(0, 0);
				return;
			}

			// Validate email using regex pattern
			const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailPattern.test(email)) {
				setRegisterError('Please enter a valid email address!');
				window.scroll(0, 0);
				return;
			}

			const passwordPattern =
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()]).{8,}$/;
			if (confirmPassword !== password) {
				if (!passwordPattern.test(password)) {
					setRegisterError('Passwords do not match!');
				}

				window.scroll(0, 0);
				return;
			}

			//validate if username already exists return and send an error
			const usernameExists = await getUserByUsernameAndEmail(username);
			const emailExists = await getUserByUsernameAndEmail(email);

			if (usernameExists) {
				setRegisterError('Username is already taken. Please choose another.');
				window.scroll(0, 0);
				return;
			}

			if (emailExists) {
				setRegisterError('Email is already in use.');
				window.scroll(0, 0);
				return;
			}

			const newUser = {
				name: name.trim(),
				username: username.trim(),
				email: email.trim(),
				password: password.trim(),
				enabled: true,
			};

			// Make a POST request to your backend API
			const res = await axios.post(`${API_URL}/api/user/register`, newUser);

			enqueueSnackbar(
				'Welcome ' + name + ', please confirm your email to login!',
				{
					variant: 'success',
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
					<form onSubmit={onSubmit} className='flex flex-col gap-4 mt-2'>
						<div>
							<input
								type='text'
								className='input'
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
								className='input'
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
								className='input'
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
								className='input'
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
								className='input'
								placeholder='Confirm Password'
								name='confirmPassword'
								value={confirmPassword}
								onChange={onChange}
								required // Make the password field required
								minLength='6' // Set minimum length for the password
							/>
						</div>
						<div className='flex w-full justify-center items-center'>
							<input
								type='checkbox'
								id='agreeTerms'
								name='agreeTerms'
								checked={agreeTerms}
								onChange={handleCheckboxChange}
								className='mr-2'
							/>
							<label htmlFor='agreeTerms'>
								I agree to the{' '}
								<Link to='/info/terms' className='text-primary'>
									Terms of Use
								</Link>{' '}
								and{' '}
								<Link to='/info/privacy' className='text-primary'>
									Privacy Policy
								</Link>
							</label>
						</div>

						<div className='flex justify-end'>
							<button
								type='submit'
								className={`${
									!agreeTerms && 'opacity-50 cursor-not-allowed'
								} mt-1 px-10 py-3 w-full lg:w-auto btn`}
								disabled={!agreeTerms}
							>
								Register
							</button>
						</div>
					</form>
					<div className='mt-12 mb-20 flex flex-col lg:flex-row w-full justify-center items-center'>
						<h4 className='mt-4 lg:pr-4 lg:mt-0'>Already have an account?</h4>
						<Link className='w-full lg:w-auto btn-outline' to='/login'>
							Login
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;
