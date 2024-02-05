import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { updateUser } from '../../api/users.api';
import LoadingModal from '../../components/LoadingModal';
import { useSnackbar } from 'notistack';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const Settings = () => {
	const { userDetails, addUserDetails } = useUser();
	const [loading, setLoading] = useState(false);
	const { enqueueSnackbar } = useSnackbar();
	const [saveDisable, setSaveDisable] = useState(true);

	const [formData, setFormData] = useState({
		name: '',
		shipAddress: {
			line1: '',
			line2: '',
			city: '',
			state: '',
			postalCode: '',
			country: 'US',
		},
	});

	const [updateError, setUpdateError] = useState('');

	useEffect(() => {
		setFormData({
			name: userDetails.name || '',
			shipAddress: {
				line1: userDetails.shipAddress?.line1 || '',
				line2: userDetails.shipAddress?.line2 || '',
				city: userDetails.shipAddress?.city || '',
				state: userDetails.shipAddress?.state || '',
				postalCode: userDetails.shipAddress?.postalCode || '',
				country: 'US',
			},
		});
	}, [userDetails]);

	const trimFormData = (data) => {
		const trimmedData = { ...data };

		// Trim values for top-level properties
		Object.keys(trimmedData).forEach((key) => {
			if (typeof trimmedData[key] === 'string') {
				trimmedData[key] = trimmedData[key].trim();
			}
		});

		// Trim values for shipAddress properties
		trimmedData.shipAddress = { ...trimmedData.shipAddress };
		Object.keys(trimmedData.shipAddress).forEach((key) => {
			if (typeof trimmedData.shipAddress[key] === 'string') {
				trimmedData.shipAddress[key] = trimmedData.shipAddress[key].trim();
			}
		});

		return trimmedData;
	};

	const onChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
			shipAddress: {
				...formData.shipAddress,
				[name]: value,
			},
		});
		setSaveDisable(false);
	};

	const sendUserUpdate = async () => {
		setLoading(true);
		setUpdateError(null);

		try {
			const trimmedFormData = trimFormData(formData);
			const response = await updateUser(userDetails._id, trimmedFormData);
			// Assuming the API response contains updated user details
			addUserDetails(response.data); // Update user details in the context
			enqueueSnackbar('Information has been updated!', {
				variant: 'success',
			});
			setSaveDisable(true);
		} catch (error) {
			console.error(error);
			setUpdateError('Error updating user details. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const onSubmit = (e) => {
		e.preventDefault();
		sendUserUpdate();
		// Add any other necessary actions after submitting the form
	};

	return (
		<div className='w-full'>
			{/* <LoadingModal loading={loading} /> */}
			<div className='flex w-full justify-center items-center'>
				<h3 className='text-2xl lg:text-3xl mb-6'>Profile Settings</h3>
			</div>
			<div>
				{updateError && (
					<div className='flex justify-center'>
						<div className='flex mb-4 py-2 px-2 w-full lg:w-[50%] justify-center border-2 border-red-400 bg-red-200 rounded-md'>
							{updateError}
						</div>
					</div>
				)}
				<div className=''>
					<form
						onSubmit={onSubmit}
						className='w-full grid grid-cols-1 lg:grid-cols-2 gap-4'
					>
						<div className='flex flex-col gap-4 mt-2'>
							<div className='text-lg w-full text-center font-bold'>
								User Details:
							</div>
							<div>
								<input
									type='text'
									className='input'
									placeholder='Name'
									name='name'
									value={formData.name || ''}
									onChange={onChange}
									required // Make the name field required
								/>
							</div>
							<div>
								<input
									type='text'
									className='input bg-gray-200 cursor-not-allowed'
									placeholder='Username'
									name='username'
									value={userDetails.username || ''}
									//onChange={onChange}
									disabled={true}
									//required // Make the username field required
									//minLength='4' // Set minimum length for the username
								/>
							</div>
							<div>
								<input
									type='email'
									className='input bg-gray-200 cursor-not-allowed'
									placeholder='Email Address'
									name='email'
									value={userDetails.email || ''}
									disabled={true}
									//onChange={onChange}
									//required // Make the email field required
								/>
							</div>
						</div>
						<div className='flex flex-col gap-4 mt-2'>
							<div className='text-lg w-full text-center font-bold'>
								Shipping Address:
							</div>
							<div>
								<input
									type='text'
									className='input'
									placeholder='Address Line 1'
									name='line1'
									value={formData.shipAddress.line1 || ''}
									onChange={onChange}
									//required // Make the name field required
								/>
							</div>
							<div>
								<input
									type='text'
									className='input'
									placeholder='Address Line 2'
									name='line2'
									value={formData.shipAddress.line2 || ''}
									onChange={onChange}
									//required // Make the name field required
								/>
							</div>
							<div className='flex flex-col lg:flex-row lg:justify-between gap-2'>
								<div className='w-full'>
									<input
										type='text'
										className='input'
										placeholder='City'
										name='city'
										value={formData.shipAddress.city || ''}
										onChange={onChange}
										//required // Make the name field required
									/>
								</div>
								<div className='flex gap-2'>
									<div className='lg:w-[35%]'>
										<input
											type='text'
											className='input'
											placeholder='State'
											name='state'
											value={formData.shipAddress.state || ''}
											onChange={onChange}
											//required // Make the email field required
										/>
									</div>
									<div className='lg:w-[65%]'>
										<input
											type='text'
											className='input'
											placeholder='Zip Code'
											name='postalCode'
											value={formData.shipAddress.postalCode || ''}
											onChange={onChange}
											//disabled={true}
											//required // Make the username field required
											//minLength='4' // Set minimum length for the username
										/>
									</div>
								</div>
							</div>

							<div className='flex justify-end'>
								<button
									type='submit'
									className={` mt-1 px-10 py-3 w-full lg:w-auto btn disabled:opacity-50 disabled:cursor-progress`}
									disabled={saveDisable || loading}
								>
									{loading ? (
										<span className='flex'>
											<AiOutlineLoading3Quarters className='h-5 w-5 mr-2 animate-spin' />
											Saving Changes...
										</span>
									) : saveDisable ? (
										'No Changes Made'
									) : (
										'Save Changes'
									)}
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Settings;
