import React, { useEffect, useState } from 'react';
import BackButton from '../components/BackButton';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import LoadingModal from '../../components/LoadingModal';
import { addProduct } from '../../api/products.api';
import errorLogging, { sendActivityLog } from '../../api/admin/logging.api';
import { useUser } from '../../context/UserContext';

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
				nqueueSnackbar('Invalid file type. Please choose an image file.', {
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
			image: image,
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
			const response = await addProduct(formData); // Await the asynchronous function
			if (response.status === 201 || response.status === 200) {
				setLoading(false); // Update loading state when data is fetched
				enqueueSnackbar(`Product ${data.name} added`, {
					variant: 'success',
				});
				try {
					const data = [
						{
							userId: userDetails._id,
							activityData: {
								activity: 'added new product ' + data.name,
								page: 'admin/addproduct',
							},
							browser: '',
						},
					];

					const res = await sendActivityLog(data);
				} catch (error) {
					console.error('could not send actvity log:', error);
				}
				//console.log(response);
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
			<BackButton />
			<h1 className='text-3xl my-4'>Add Product</h1>
			<LoadingModal loading={loading} />
			<div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
				<div className='my-4'>
					<label className='text-xl mr-4 text-gray-500'>Name</label>
					<input
						type='text'
						value={name}
						onChange={(e) => setName(e.target.value)}
						className='border-2 border-gray-500 px-4 py-2 w-full'
					/>
				</div>
				<div className='my-4'>
					<label className='text-xl mr-4 text-gray-500'>Description</label>
					<textarea
						type='text'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className='border-2 border-gray-500 px-4 py-2 w-full resize-none'
						rows={6}
					/>
				</div>
				<div className='my-4'>
					<div className='flex'>
						<label className='w-full text-xl text-gray-500'>Price</label>
						<label className='ml-4 w-full text-xl text-gray-500'>
							Stock Available
						</label>
					</div>
					<div className='flex gap-4'>
						<input
							type='text'
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							className='border-2 border-gray-500 px-4 py-2 w-full'
						/>
						<input
							type='text'
							value={inventory}
							onChange={(e) => setInventory(e.target.value)}
							className='border-2 border-gray-500 px-4 py-2 w-full'
						/>
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
							className='border-2 border-gray-500 px-4 py-2 w-full'
						/>
						<input
							type='text'
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className='border-2 border-gray-500 px-4 py-2 w-full'
						/>
					</div>
				</div>

				<div className='my-4'>
					<label className='text-xl mr-4 text-gray-500'>
						Tags (separate with commas)
					</label>
					<input
						type='text'
						value={tags}
						onChange={(e) => setTags(e.target.value)}
						className='border-2 border-gray-500 px-4 py-2 w-full'
					/>
				</div>
				<div className='my-4'>
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
				</div>
				<button className='p-2 bg-sky-300 m-8' onClick={handleAddProduct}>
					Save
				</button>
			</div>
		</div>
	);
};

export default AddProduct;
