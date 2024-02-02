import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

const ContactPage = () => {
	const { enqueueSnackbar } = useSnackbar();

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

	const handleContactSubmit = (e) => {
		e.preventDefault();
		// Handle form submission logic here, such as sending data to backend or displaying it
		console.log(contactFormData); // For demonstration, logs form data to the console
		// You can perform further actions like sending data to the server
	};

	const handleBugSubmit = (e) => {
		e.preventDefault();
		// Handle form submission logic here, such as sending data to backend or displaying it
		console.log(bugFormData); // For demonstration, logs form data to the console
		// You can perform further actions like sending data to the server
	};

	return (
		<div className='p-4 mt-[8rem] min-h-[65vh] w-full flex justify-center'>
			<div className='flex w-full max-w-[1400px] h-full justify-center'>
				<div className='w-full flex flex-col items-center justify center rounded-md'>
					<h3 className='text-3xl mb-8'>Contact Us</h3>
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
								Submit
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
