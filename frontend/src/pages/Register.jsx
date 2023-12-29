import React, { useState } from 'react';
import axios from 'axios'; // Import Axios

const Register = () => {
	const [formData, setFormData] = useState({
		name: '',
		username: '',
		email: '',
		password: '',
	});

	const { name, username, email, password } = formData;

	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async (e) => {
		e.preventDefault();

		try {
			// Check if any form fields are empty
			if (!name || !username || !email || !password) {
				// Handle empty field(s) - you can show an error message to the user
				console.error('Please fill in all fields');
				return;
			}

			const newUser = {
				name,
				username,
				email,
				password,
			};

			// Make a POST request to your backend API
			const res = await axios.post(
				'http://10.0.0.85:5555/user/register',
				newUser
			); // Replace '/user/register' with your actual endpoint

			console.log('User registered:', res.data); // Log the response data (for verification, remove in production)

			// Clear form fields after successful registration
			setFormData({
				name: '',
				username: '',
				email: '',
				password: '',
			});

			// Handle any further actions after successful registration (redirect, show success message, etc.)
		} catch (error) {
			console.error('Registration error:', error.message);
			// Handle error responses (show error message to the user, etc.)
		}
	};

	return (
		<div className='mt-[8rem]'>
			<h2>Register</h2>
			<form onSubmit={onSubmit}>
				<div>
					<input
						type='text'
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
						placeholder='Password'
						name='password'
						value={password}
						onChange={onChange}
						required // Make the password field required
						minLength='6' // Set minimum length for the password
					/>
				</div>
				<div>
					<button type='submit'>Register</button>
				</div>
			</form>
		</div>
	);
};

export default Register;
