import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import LoadingModal from '../../components/LoadingModal';
import { LOCALIP } from '../../config';

const EditProduct = () => {
	const [storeId, setStoreId] = useState('');
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [type, setType] = useState('');
	const [category, setCategory] = useState('');
	const [tags, setTags] = useState('');
	const [inventory, setInventory] = useState('');
	const [img, setImg] = useState('');
	const [sale, setSale] = useState(0);
	const [rating, setRating] = useState('');

	const { id } = useParams();

	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		setLoading(true);
		axios
			.get(`http://${LOCALIP}:5555/products/${id}`)
			.then((response) => {
				setStoreId(response.data.data.storeId);
				setName(response.data.data.name);
				setDescription(response.data.data.description);
				setPrice(response.data.data.price);
				setSale(response.data.data.sale);
				setType(response.data.data.type);
				setCategory(response.data.data.category);
				setRating(response.data.data.rating);
				setTags(response.data.data.tags);
				setInventory(response.data.data.inventory);
				setImg(response.data.data.img);

				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				enqueueSnackbar('Could not retrieve product', {
					variant: 'error',
					anchorOrigin: { horizontal: 'right', vertical: 'top' },
				});
				console.log(error);
				navigate('/admin');
			});
	}, []);

	const handleEditProduct = () => {
		//const id = storeId;
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
		console.log(id);
		axios
			.put(`http://${LOCALIP}:5555/products/${id}`, data)
			.then(() => {
				setLoading(false);
				enqueueSnackbar('Product updated', {
					variant: 'success',
					anchorOrigin: { horizontal: 'right', vertical: 'top' },
				});
				navigate('/admin');
			})
			.catch((error) => {
				setLoading(false);
				enqueueSnackbar('Could not update product', {
					variant: 'error',
					anchorOrigin: { horizontal: 'right', vertical: 'top' },
				});
				console.log(error);
			});
	};

	return (
		<div className='p-4 mt-[8rem]'>
			<BackButton />
			<h1 className='text-3xl my-4'>Edit Product</h1>
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
						onChange={(e) => setDescription(e.target.value)}
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
					<label className='text-xl mr-4 text-gray-500'>Sale?</label>
					<input
						type='text'
						value={sale}
						onChange={(e) => setSale(e.target.value)}
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
					<label className='text-xl mr-4 text-gray-500'>Rating</label>
					<input
						type='text'
						value={rating || ''}
						onChange={(e) => setRating(e.target.value)}
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
				<button className='p-2 bg-sky-300 m-8' onClick={handleEditProduct}>
					Save
				</button>
			</div>
		</div>
	);
};

export default EditProduct;
