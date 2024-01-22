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
import DefaultProductImg from '../../assets/product-img/default.png';
import getSettings from '../../api/siteSettings.api';

const EditProduct = () => {
	const [storeId, setStoreId] = useState('');
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [type, setType] = useState('');
	const [category, setCategory] = useState('');
	const [collections, setCollections] = useState([]);
	const [tags, setTags] = useState('');
	const [inventory, setInventory] = useState('');
	const [image, setImage] = useState('');
	const [sale, setSale] = useState(0);
	const [manCost, setManCost] = useState(0);
	const [measurements, setMeasurements] = useState('');
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
			setManCost(response.manCost);
			setMeasurements(response.measurements);

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

	const fetchCollections = async () => {
		const fetchedCollections = await getSettings();
		setCollections(fetchedCollections.collections);
	};

	const checkUser = async () => {
		setLoading(true);
		try {
			if (userDetails._id && userRole() < 2) {
				navigate('/user/dashboard');
				return;
			}
			fetchProducts();
			fetchCollections();
		} catch (error) {
			console.error('Admin user: ', error.message);
			navigate('/');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		checkUser();
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
			manCost,
			measurements,
			inventory,
			image: !img ? image : img,
			active,
			archived,
		};
		setLoading(true);
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
		}
	};

	return (
		<div className='p-4 mt-[8rem]'>
			<LoadingModal loading={loading} />
			<div className='flex flex-col border-2 border-primary rounded-xl max-w-[1200px] p-4 mx-auto'>
				<div className='flex items-center'>
					<div>
						<BackButton destination='/admin#products' />
					</div>

					<h1 className='text-3xl my-4 w-full text-center'>
						Edit Product - ID#{storeId}
					</h1>
				</div>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
					<div className='flex flex-col gap-2'>
						<div className={`${userRole() < 3 && 'hidden'}`}>
							<label className='text-xl mr-4 text-gray-500'>Store ID</label>
							<input
								type='text'
								value={storeId}
								onChange={(e) => setStoreId(e.target.value)}
								className='input'
								disabled={userRole() < 3}
							/>
						</div>
						<div>
							<label className='text-xl mr-4 text-gray-500'>Name</label>
							<input
								type='text'
								value={name}
								onChange={(e) => setName(e.target.value)}
								className='input'
							/>
						</div>
						<div>
							<label className='text-xl mr-4 text-gray-500'>Description</label>
							<textarea
								type='text'
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className='input resize-none'
								rows={6}
							/>
						</div>
						<div>
							<div className='flex flex-col justify-center items-center mb-4'>
								Current Image:
								{image && (
									<img
										src={!image ? DefaultProductImg : image}
										alt='Selected Preview'
										style={{ maxWidth: '50%', marginTop: '8px' }}
									/>
								)}
							</div>
							<ImageUpload />
						</div>
					</div>
					<div className='flex flex-col gap-2'>
						<div className='flex items-center gap-2'>
							<div className='flex flex-col w-full'>
								<label className='text-xl text-gray-500'>Price</label>
								<input
									type='text'
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									className='input w-full'
								/>
							</div>
							<div className='flex flex-col w-full'>
								<label className='text-xl text-gray-500'>Sale?</label>
								<input
									type='text'
									value={sale}
									onChange={(e) => setSale(e.target.value)}
									className='input'
								/>
							</div>
						</div>

						<div className='flex gap-2'>
							<div className='flex flex-col w-full'>
								<label className='text-xl text-gray-500'>Type</label>
								<input
									type='text'
									value={type}
									onChange={(e) => setType(e.target.value)}
									className='input'
								/>
							</div>
							<div className='flex flex-col w-full'>
								<label className='text-xl text-gray-500'>Collection</label>
								<select
									value={
										category
										// collections.some((item) => item.name === category)
										// 	? category
										// 	: ''
									}
									onChange={(e) => setCategory(e.target.value)}
									className='border-4 border-primary text-lg focus:border-6 py-5 rounded-md px-2'
								>
									{collections.map((item, i) => (
										<option key={i} value={item.name}>
											{item.name}
										</option>
									))}
									{!collections.some((item) => item.name === category) && (
										<option value={category}>OG: {category}</option>
									)}
									{/* delete above line of code once OGs are added! */}
								</select>
								{/* <input
									type='text'
									value={category}
									onChange={(e) => setCategory(e.target.value)}
									className='input'
								/> */}
							</div>
						</div>

						<div className='flex gap-2'>
							<div>
								<label className='text-xl mr-4 text-gray-500'>
									Manufacturing Cost
								</label>
								<input
									type='text'
									value={manCost}
									onChange={(e) => setManCost(e.target.value)}
									placeholder=''
									className='input'
								/>
							</div>

							<div>
								<label className='text-xl mr-4 text-gray-500'>
									Measurements (W x H)
								</label>
								<input
									type='text'
									value={measurements}
									onChange={(e) => setMeasurements(e.target.value)}
									placeholder=''
									className='input'
								/>
							</div>
						</div>
						<div className='flex gap-2'>
							<div className='flex flex-col w-full'>
								<label className='text-xl mr-4 text-gray-500'>Rating</label>
								<input
									type='text'
									value={rating}
									onChange={(e) => setRating(e.target.value)}
									className='input'
									disabled={userRole() < 3}
								/>
							</div>
							<div className='flex flex-col w-full'>
								<label className='text-xl mr-4 text-gray-500'>
									Stock Available
								</label>
								<input
									type='text'
									value={inventory}
									onChange={(e) => setInventory(e.target.value)}
									className='input'
								/>
							</div>
						</div>
						<label className='text-xl mr-4 text-gray-500'>
							Tags (separate with commas)
						</label>
						<input
							type='text'
							value={tags}
							onChange={(e) => setTags(e.target.value)}
							className='input'
						/>

						<div className='flex w-full h-full gap-4 justify-end items-end'>
							<label className='flex ml-1 items-center'>
								<input
									type='checkbox'
									checked={active}
									onChange={(e) => setActive(e.target.checked)}
									className='mr-2'
								/>
								Make Active?
							</label>
							<button
								className='btn text-xl w-[40%]'
								onClick={handleEditProduct}
							>
								Save
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditProduct;
