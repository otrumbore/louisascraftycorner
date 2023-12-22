import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import LoadingModal from '../../components/LoadingModal';
import { LOCALIP } from '../../config';

const AddProduct = () => {
	const [storeId, setStoreId] = useState('');
	const [name, setName] = useState('');
	const [description, setDesciption] = useState('');
	const [price, setPrice] = useState('');
	const [type, setType] = useState('');
	const [category, setCategory] = useState('');
	const [tags, setTags] = useState('handmade');
	const [inventory, setInventory] = useState('');
	const [img, setImg] = useState('');
	const [sale, setSale] = useState(0);
	const [rating, setRating] = useState('');

	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const handleAddProduct = () => {
		const data = {
			storeId,
			name,
			description,
			price,
			sale,
			type,
			category,
			rating,
			tags,
			inventory,
			img,
		};
		setLoading(true);
		axios
			.post(`http://${LOCALIP}:5555/products`, data)
			.then(() => {
				setLoading(false);
				enqueueSnackbar(`Product ${data.name} added`, {
					variant: 'success',
					anchorOrigin: { horizontal: 'right', vertical: 'top' },
				});
				navigate('/admin');
			})
			.catch((error) => {
				setLoading(false);
				enqueueSnackbar('Could not add product', {
					variant: 'error',
					anchorOrigin: { horizontal: 'right', vertical: 'top' },
				});
				console.log(error);
			});
	};

	return (
		<div className='p-4'>
			<BackButton />
			<h1 className='text-3xl my-4'>Add Product</h1>
			<LoadingModal loading={loading} />
			<div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
				<div className='my-4'>
					<label className='text-xl mr-4 text-gray-500'>Store ID</label>
					<input
						type='text'
						value={storeId}
						onChange={(e) => setStoreId(e.target.value)}
						className='border-2 border-gray-500 px-4 py-2 w-full'
					/>
				</div>
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
						onChange={(e) => setDesciption(e.target.value)}
						className='border-2 border-gray-500 px-4 py-2 w-full resize-none'
						rows={6}
					/>
				</div>
				<div className='my-4'>
					<label className='text-xl mr-4 text-gray-500'>Price</label>
					<input
						type='text'
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						className='border-2 border-gray-500 px-4 py-2 w-full'
					/>
				</div>
				<div className='my-4'>
					<label className='text-xl mr-4 text-gray-500'>Type</label>
					<input
						type='text'
						value={type}
						onChange={(e) => setType(e.target.value)}
						className='border-2 border-gray-500 px-4 py-2 w-full'
					/>
				</div>
				<div className='my-4'>
					<label className='text-xl mr-4 text-gray-500'>Category</label>
					<input
						type='text'
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						className='border-2 border-gray-500 px-4 py-2 w-full'
					/>
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
					<label className='text-xl mr-4 text-gray-500'>Stock Available</label>
					<input
						type='text'
						value={inventory}
						onChange={(e) => setInventory(e.target.value)}
						className='border-2 border-gray-500 px-4 py-2 w-full'
					/>
				</div>
				<button className='p-2 bg-sky-300 m-8' onClick={handleAddProduct}>
					Save
				</button>
			</div>
		</div>
	);
};

export default AddProduct;
