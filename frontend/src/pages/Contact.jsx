import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

const ContactPage = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		message: '',
	});
	const { enqueueSnackbar } = useSnackbar();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle form submission logic here, such as sending data to backend or displaying it
		console.log(formData); // For demonstration, logs form data to the console
		// You can perform further actions like sending data to the server
	};

	return (
		<div className='p-4 mt-[8rem] min-h-[65vh] w-full max-w-[1400px] flex justify-center'>
			<div className='flex mt-[5%] w-full h-full justify-center items-center'>
				<div className='w-full lg:w-[40%] flex flex-col justify-center items-center rounded-md'>
					<h3 className='text-3xl mb-8'>Contact Us</h3>
					<form className='w-full' onSubmit={handleSubmit}>
						<div className='mb-4 flex items-center gap-4'>
							<input
								type='text'
								id='name'
								name='name'
								value={formData.name}
								onChange={handleChange}
								className='input'
								placeholder='Name'
								required
							/>
						</div>
						<div className='mb-4 flex items-center gap-4'>
							<input
								type='email'
								id='email'
								name='email'
								placeholder='Email'
								value={formData.email}
								onChange={handleChange}
								className='input'
								required
							/>
						</div>
						<div className='mb-4'>
							<textarea
								id='message'
								name='message'
								placeholder='Message...'
								value={formData.message}
								onChange={handleChange}
								className='input'
								rows='4'
								required
							></textarea>
						</div>
						<div className='flex justify-end'>
							<button
								//type='submit'
								onClick={() => {
									enqueueSnackbar('Did not submit...Coming soon!', {
										variant: 'info',
										anchorOrigin: {
											horizontal: 'center',
											vertical: 'top',
										},
										autoHideDuration: 2000,
									});
								}}
								className='btn'
							>
								Submit
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ContactPage;
