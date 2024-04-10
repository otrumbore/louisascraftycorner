import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import sendContactEmail from '../api/contact.api';

const ContactPage = () => {
	const { enqueueSnackbar } = useSnackbar();
	const [contactError, setContactError] = useState('');

	const [contactFormData, setContactFormData] = useState({
		name: '',
		email: '',
		message: '',
	});
	const [bugFormData, setBugFormData] = useState({
		name: '',
		email: '',
		message: '',
	});

	const handleContactChange = (e) => {
		const { name, value } = e.target;
		setContactFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleBugChange = (e) => {
		const { name, value } = e.target;
		setBugFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};
	const isEmailValid = (email) => {
		// Basic email format validation using a regular expression
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleContactSubmit = async (e) => {
		e.preventDefault();

		// Basic validation checks
		if (
			!contactFormData.name ||
			!contactFormData.email ||
			!contactFormData.message
		) {
			setContactError('Please fill in all required fields.');
			return;
		}

		// Additional email validation
		if (!isEmailValid(contactFormData.email)) {
			setContactError('Please enter a valid email address.');
			return;
		}

		try {
			const data = {
				name: contactFormData.name.trim(),
				email: contactFormData.email.trim(),
				message: contactFormData.message.trim(),
			};
			const res = await sendContactEmail(data);
			//console.log(res);
			if (res.status === 200) {
				enqueueSnackbar(
					'Message sent successfully, we will get back to you soon!',
					{
						variant: 'success',
					}
				);
				setContactFormData({ name: '', email: '', message: '' });
			} else {
				enqueueSnackbar('Failed to send message. Please try again!', {
					variant: 'error',
				});
			}
		} catch (err) {
			console.error(err);
			enqueueSnackbar('Failed to send message!', {
				variant: 'error',
			});
		}
	};

	const handleBugSubmit = (e) => {
		e.preventDefault();
		// Handle form submission logic here, such as sending data to backend or displaying it
		console.log(bugFormData); // For demonstration, logs form data to the console
		// You can perform further actions like sending data to the server
	};
	useEffect(() => {
		document.title = "Contact | Louisa's Crafty Corner";
		window.scroll(0, 0);
	}, []);

	return (
		<div className='p-4 mt-[8rem] min-h-[65vh] w-full flex justify-center'>
			<div className='flex w-full max-w-[1400px] h-full justify-center'>
				<div className='w-full flex flex-col items-center justify-center'>
					<h3 className='text-3xl mb-8'>Contact Us</h3>
					<div className='mb-8 text-xl text-center space-y-8'>
						<p>
							<strong>Email: </strong>
							<a
								href='mailto:louisascraftycorner@gmail.com'
								className='text-dark_secondary hover:underline hover:underline-offset-4'
							>
								sales@louisascraftycorner.com
							</a>
						</p>

						<p className='text-2xl'>OR</p>

						<p>Send us a message below.</p>
					</div>
					{contactError && (
						<div className='flex mb-4 py-2 px-2 w-full justify-center border-2 border-red-400 bg-red-200 rounded-md'>
							{contactError}
						</div>
					)}
					<form className='w-full lg:w-[40%]' onSubmit={handleContactSubmit}>
						<div className='mb-4 flex items-center gap-4'>
							<input
								type='text'
								id='name'
								name='name'
								value={contactFormData.name}
								onChange={handleContactChange}
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
								value={contactFormData.email}
								onChange={handleContactChange}
								className='input'
								required
							/>
						</div>
						<div className='mb-4'>
							<textarea
								id='message'
								name='message'
								placeholder='Message...'
								value={contactFormData.message}
								onChange={handleContactChange}
								className='input'
								rows='4'
								required
							></textarea>
						</div>
						<div className='flex w-full justify-end'>
							<button type='submit' className='btn'>
								Send Message
							</button>
						</div>
					</form>
					{/* WEBSITE ISSUE REPORT SECTION */}
					<h3 className='mt-16 text-3xl mb-4'>Issue with the webiste?</h3>
					<p>Please submit a ticket!</p>
					<form
						className='w-full lg:w-[90%] grid grid-cols-1 lg:grid-cols-2 gap-4 justify-center'
						onSubmit={handleBugSubmit}
					>
						<div className='flex flex-col w-full gap-3'>
							<div className='flex items-center'>
								<input
									type='text'
									id='name'
									name='name'
									value={bugFormData.name}
									onChange={handleBugChange}
									className='input'
									placeholder='Name'
									required
								/>
							</div>
							<div className='flex items-center'>
								<input
									type='email'
									id='email'
									name='email'
									placeholder='Email'
									value={bugFormData.email}
									onChange={handleBugChange}
									className='input'
									required
								/>
							</div>
						</div>

						<div className='w-full'>
							<textarea
								id='message'
								name='message'
								placeholder='Description of issue...EX: Page and what you were doing at the time during the problem.'
								value={bugFormData.message}
								onChange={handleBugChange}
								className='input'
								rows='4'
								required
							></textarea>
						</div>
						<div className='flex w-full lg:w-auto justify-end lg:col-span-2'>
							<button
								//type='submit'
								onClick={() => {
									enqueueSnackbar('Did not submit...Coming soon!', {
										variant: 'info',
									});
								}}
								className='btn disabled:opacity-50 disabled:cursor-not-allowed'
								disabled={true}
							>
								Submit Ticket
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ContactPage;
