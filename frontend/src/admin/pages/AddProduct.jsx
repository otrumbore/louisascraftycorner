import React, { useEffect, useState } from 'react';
import BackButton from '../components/BackButton';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import LoadingModal from '../../components/LoadingModal';
import { addProduct } from '../../api/products.api';
import errorLogging, { sendActivityLog } from '../../api/admin/logging.api';
import { useUser } from '../../context/UserContext';
import ImageUpload, { sendImageURL } from '../components/ImageUpload';

import { MdAttachMoney } from 'react-icons/md';

const AddProduct = () => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState(
		`Note: Please be advised that the handcrafted nature of our products may result in variations in wood grain and finish, adding distinct character to each item. Additionally, slight differences in dimensions are expected due to the bespoke craftsmanship. It's important to note that the final product may vary slightly from the images on our website or promotional materials. Your understanding of these inherent characteristics is greatly appreciated as we strive to deliver uniquely crafted pieces.`
	);
	const [price, setPrice] = useState('');
	const [type, setType] = useState('');
	const [category, setCategory] = useState('');
	const [tags, setTags] = useState('handmade');
	const [inventory, setInventory] = useState('');
	const [image, setImage] = useState(null);
	const [sale, setSale] = useState(0);
	const [rating, setRating] = useState(0);
	const active = false;
	const archived = false;

	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const { userDetails } = useUser();

	const handleImageChange = (e) => {
		const selectedImage = e.target.files[0];

		// Check if an image is selected
		if (selectedImage) {
			// Check image type (optional)
			if (selectedImage.type.startsWith('image/')) {
				// Update the image state
				setImage(selectedImage);
			} else {
				// Show an error message or provide feedback to the user
				console.error('Invalid file type. Please choose an image file.');
				enqueueSnackbar('Invalid file type. Please choose an image file.', {
					variant: 'error',
				});
			}
		}
	};

	useEffect(() => {
		console.log(image);
	}, [image]);

	useEffect(() => {
		window.scroll(0, 0);
	}, []);

	const handleAddProduct = async () => {
		let img = sendImageURL();
		console.log(img);
		const data = {
			name,
			description,
			price,
			sale,
			type,
			category,
			rating,
			tags,
			inventory,
			image: img,
			active,
			archived,
		};

		const formData = new FormData();
		for (const key in data) {
			formData.append(key, data[key]);
		}

		//console.log('image log 2: ', image);
		setLoading(true);
		try {
			const response = await addProduct(data); // Await the asynchronous function
			if (response.status === 201 || response.status === 200) {
				setLoading(false); // Update loading state when data is fetched
				enqueueSnackbar(`Product ${data.name} added`, {
					variant: 'success',
				});
				try {
					const data2 = {
						user: { username: userDetails.username, userId: userDetails._id },
						activityData: {
							activity: 'added product ' + data.name,
							page: 'admin/addproduct',
						},
						browser: '',
					};

					const res = await sendActivityLog(data2);
				} catch (error) {
					console.error('could not send actvity log:', error);
				}

				navigate('/admin#products');
			} else {
				setLoading(false);
				enqueueSnackbar('Could not add product', {
					variant: 'error',
				});
			}
		} catch (error) {
			console.error(error);
			setLoading(false); // Update loading state in case of error
			return (
				<div className='mt-8 w-full justify-center text-xl'>
					Could not load product refresh to try again.
				</div>
			);
		}
	};

	return (
		<div className='mt-[8rem] p-4'>
			<LoadingModal loading={loading} />

			<div className='flex flex-col border-2 border-primary rounded-xl w-[1200px] p-4 mx-auto'>
				<div className=' mb-2 flex'>
					<BackButton />
					<h1 className='text-3xl w-full text-center'>Add Product</h1>
				</div>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
					<div>
						<div className='my-4'>
							<label className='text-xl mr-4 text-gray-500'>Name</label>
							<input
								type='text'
								value={name}
								onChange={(e) => setName(e.target.value)}
								className='input'
								placeholder='Name'
							/>
						</div>

						<div className='my-4'>
							<label className='text-xl mr-4 text-gray-500'>Description</label>
							<textarea
								type='text'
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className='input px-4 py-2 w-full resize-none'
								rows={6}
							/>
						</div>
						<ImageUpload />
					</div>
					<div>
						<div className='my-4'>
							<div className='flex'>
								<label className='w-full text-xl text-gray-500'>Price</label>
								<label className='ml-4 w-full text-xl text-gray-500'>
									Stock Available
								</label>
							</div>
							<div className='flex gap-4'>
								<div className='relative flex w-full items-center'>
									<input
										type='text'
										value={price}
										onChange={(e) => setPrice(e.target.value)}
										className='input text-xl pl-6'
										placeholder='0.00'
									/>
									<MdAttachMoney
										size={25}
										className='absolute left-1 top-[1.4rem] text-gray-500'
									/>
								</div>
								<div className='w-full'>
									<input
										type='text'
										value={inventory}
										onChange={(e) => setInventory(e.target.value)}
										className='input'
									/>
								</div>
							</div>
						</div>
						<div className='my-4'>
							<div className='flex'>
								<label className='text-xl w-full text-gray-500'>Type</label>
								<label className='ml-4 text-xl w-full text-gray-500'>
									Collection
								</label>
							</div>
							<div className='flex gap-4'>
								<input
									type='text'
									value={type}
									onChange={(e) => setType(e.target.value)}
									className='input'
								/>
								<input
									type='text'
									value={category}
									onChange={(e) => setCategory(e.target.value)}
									className='input'
								/>
							</div>
						</div>

						<div className='mt-7 mb-5'>
							<label className='text-xl mr-4 text-gray-500'>
								Tags (separate with commas)
							</label>
							<input
								type='text'
								value={tags}
								onChange={(e) => setTags(e.target.value)}
								className='input'
							/>
						</div>
						<div className='w-full flex justify-end'>
							<button className='btn w-[35%]' onClick={handleAddProduct}>
								Save
							</button>
						</div>
					</div>
				</div>

				{/* <div className='my-4'>
					<label className='text-xl mr-4 text-gray-500'>Image</label>
					<input
						type='file'
						name='image'
						accept='image/*'
						onChange={handleImageChange}
						className='border-2 border-gray-500 px-4 py-2 w-full'
					/>
					<div className='flex justify-center'>
						{image && (
							<img
								src={URL.createObjectURL(image)}
								alt='Selected Preview'
								style={{ maxWidth: '50%', marginTop: '8px' }}
							/>
						)}
					</div>
				</div> */}
			</div>
		</div>
	);
};

export default AddProduct;
