import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import LoadingModal from '../../components/LoadingModal';
import { getProduct, updateProduct } from '../../api/products.api';
import { useUser } from '../../context/UserContext';
import { sendActivityLog } from '../../api/admin/logging.api';
import ImageUpload, { sendImageURL } from '../components/ImageUpload';

const EditProduct = () => {
	const [storeId, setStoreId] = useState('');
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [type, setType] = useState('');
	const [category, setCategory] = useState('');
	const [tags, setTags] = useState('');
	const [inventory, setInventory] = useState('');
	const [image, setImage] = useState('');
	const [sale, setSale] = useState(0);
	const [rating, setRating] = useState('');
	const [active, setActive] = useState(false);
	const archived = false;

	const { userRole, userDetails } = useUser();

	const { id } = useParams();

	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const fetchProducts = async () => {
		setLoading(true);
		const response = await getProduct(id);
		console.log(response);
		if (response) {
			setStoreId(response.storeId);
			setName(response.name);
			setDescription(response.description);
			setPrice(response.price);
			setSale(response.sale);
			setType(response.type);
			setCategory(response.category);
			setRating(response.rating);
			setTags(response.tags);
			setInventory(response.inventory);
			setImage(response.image);
			setActive(response.active);

			setLoading(false);
		} else {
			setLoading(false);
			enqueueSnackbar('Could not retrieve product', {
				variant: 'error',
			});
			console.log('Could not get product');
			navigate('/admin');
		}
	};

	useEffect(() => {
		fetchProducts();
		window.scroll(0, 0);
	}, []);

	const handleEditProduct = async () => {
		//const id = storeId;
		let img = sendImageURL();
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
			image: img,
			active,
			archived,
		};
		setLoading(true);
		//console.log(id);
		const response = await updateProduct(id, data);
		if (response.status === 201 || response.status === 200) {
			enqueueSnackbar('Product ' + data.name + ' updated', {
				variant: 'success',
			});

			try {
				const data2 = {
					user: { username: userDetails.username, userId: userDetails._id },
					activityData: {
						activity: 'edited ' + data.name + ' product',
						page: 'admin/editproduct',
					},
					browser: '',
				};
				console.log(data2);
				const res = await sendActivityLog(data2);
				console.log(res);
			} catch (error) {
				console.error('could not send actvity log:', error);
			}
			navigate('/admin#products');
		} else {
			setLoading(false);
			enqueueSnackbar('Could not update product', {
				variant: 'error',
			});
			//console.log(error);
		}
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
						disabled={userRole() < 3}
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
						value={rating}
						onChange={(e) => setRating(e.target.value)}
						className='border-2 border-gray-500 px-4 py-2 w-full'
						disabled={userRole() < 3}
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
				<label className='flex ml-1 items-center'>
					<input
						type='checkbox'
						checked={active}
						onChange={(e) => setActive(e.target.checked)}
						className='mr-2'
					/>
					Make Active?
				</label>
				<div className='my-4'>
					<div className='flex flex-col justify-center items-center'>
						Current Image:
						{image && (
							<img
								src={image}
								alt='Selected Preview'
								style={{ maxWidth: '50%', marginTop: '8px' }}
							/>
						)}
					</div>
				</div>
				<ImageUpload />
				<button className='p-2 bg-sky-300 m-8' onClick={handleEditProduct}>
					Save
				</button>
			</div>
		</div>
	);
};

export default EditProduct;
