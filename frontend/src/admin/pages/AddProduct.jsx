import React, { useEffect, useState } from 'react';
import BackButton from '../components/BackButton';
import { useNavigate, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import LoadingModal from '../../components/LoadingModal';
import { addProduct } from '../../api/products.api';
import errorLogging, { sendActivityLog } from '../../api/logging.api';
import { useUser } from '../../context/UserContext';
import ImageUpload, { sendImageURL } from '../components/ImageUpload';
import { MdAttachMoney } from 'react-icons/md';
import getSettings from '../../api/siteSettings.api';

const AddProduct = () => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState(
		`Note: Please be advised that the handcrafted nature of our products may result in variations in wood grain and finish, adding distinct character to each item. Additionally, slight differences in dimensions are expected due to the bespoke craftsmanship. It's important to note that the final product may vary slightly from the images on our website or promotional materials. Your understanding of these inherent characteristics is greatly appreciated as we strive to deliver uniquely crafted pieces.`
	);
	const [price, setPrice] = useState('');
	const [type, setType] = useState('');
	const [category, setCategory] = useState('');
	const [collections, setCollections] = useState([]);
	const [tags, setTags] = useState('Home Decor, Handmade');
	const [inventory, setInventory] = useState('');
	const [image, setImage] = useState(null);
	const [sale, setSale] = useState(0);
	const [rating, setRating] = useState(0);
	const [manCost, setManCost] = useState('');
	const [storageLocation, setStorageLocation] = useState('');
	const [measurements, setMeasurements] = useState('');
	const active = false;
	const archived = false;

	const [inputError, setInputError] = useState([]);

	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const { userDetails, userRole } = useUser();

	const fetchSettings = async () => {
		try {
			const fetchedSettings = await getSettings();
			setCollections(fetchedSettings.collections);
		} catch (error) {
			console.log(error);
		}
	};

	const checkUser = async () => {
		setLoading(true);
		try {
			if (userDetails._id && userRole() < 2) {
				navigate('/user/dashboard');
				return;
			}
			fetchSettings();
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

	const handleAddProduct = async () => {
		let img = sendImageURL();

		setInputError([]);

		const validateInput = (input, inputName) => {
			const trimmedInput = String(input).trim();
			if (trimmedInput === '') {
				setInputError((prevErrors) => [...prevErrors, inputName]);
				return false;
			}
			return true;
		};

		const validateInputNumber = (input, inputName) => {
			const trimmedInput = String(input).trim();
			if (trimmedInput === '' || isNaN(Number(trimmedInput))) {
				setInputError((prevErrors) => [...prevErrors, inputName]);
				return false;
			}
			return true;
		};

		const isValidName = validateInput(name, 'name');
		const isValidDescription = validateInput(description, 'description');
		const isValidPrice = validateInputNumber(price, 'price');
		const isValidSale = validateInputNumber(sale, 'sale');
		const isValidType = validateInput(type, 'type');
		const isValidCategory = validateInput(category, 'category');
		const isValidRating = validateInputNumber(rating, 'rating');
		const isValidTags = validateInput(tags, 'tags');
		const isValidMeasurements = validateInput(measurements, 'measurements');
		const isValidManCost = validateInputNumber(manCost, 'manCost');
		const isValidInventory = validateInputNumber(inventory, 'inventory');
		const isValidStorageLocation = validateInput(storageLocation, 'storage');

		console.log(inputError);

		if (
			isValidName &&
			isValidDescription &&
			isValidPrice &&
			isValidSale &&
			isValidType &&
			isValidCategory &&
			isValidRating &&
			isValidTags &&
			isValidStorageLocation &&
			isValidMeasurements &&
			isValidManCost &&
			isValidInventory
		) {
			const data = {
				name: name.trim(),
				description: description.trim(),
				price: price.trim(),
				sale: sale,
				type: type.trim(),
				category: category.trim(),
				rating: rating,
				tags: tags.trim(),
				measurements: measurements.trim(),
				manCost: manCost.trim(),
				storageLocation: storageLocation.trim(),
				inventory: inventory.trim(),
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
		} else {
			enqueueSnackbar('Errors are marked below, please fix!', {
				variant: 'error',
			});
		}
	};

	return (
		<div className='mt-[8rem] p-4'>
			<LoadingModal loading={loading} />

			<div className='flex flex-col border-4 border-primary rounded-xl max-w-[1200px] p-4 mx-auto'>
				<div className=' mb-2 flex'>
					<BackButton destination='/admin#products' />
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
								className={`input ${
									inputError.includes('name') && 'border-red-600'
								}`}
								placeholder='Name'
							/>
						</div>

						<div className='my-4'>
							<label className='text-xl mr-4 text-gray-500'>Description</label>
							<textarea
								type='text'
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className={`input px-4 py-2 w-full resize-none ${
									inputError.includes('description') && 'border-red-600'
								}`}
								rows={6}
							/>
						</div>
						<ImageUpload />
						<p className='hidden'>
							Please Note: Before uploading, change picture resolution/size to a
							height of 500px.
						</p>
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
										className={`input text-xl pl-6 ${
											inputError.includes('price') && 'border-red-600'
										}`}
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
										className={`input ${
											inputError.includes('inventory') && 'border-red-600'
										}`}
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
									className={`input py-3 ${
										inputError.includes('type') && 'border-red-600'
									}`}
								/>
								<select
									onChange={(e) => setCategory(e.target.value)}
									className={`w-full py-3 px-2 border-4 border-primary focus:border-6 rounded-md text-lg bg-gray-100 ${
										inputError.includes('category') && 'border-red-600'
									}`}
								>
									<option value=''>Choose Collection...</option>
									{collections.map((item, i) => (
										<option key={i} value={item.name}>
											{item.name}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className='mt-4'>
							<label className='text-xl mr-4 text-gray-500'>
								Tags (separate with commas)
							</label>
							<input
								type='text'
								value={tags}
								onChange={(e) => setTags(e.target.value)}
								className={`input ${
									inputError.includes('tags') && 'border-red-600'
								}`}
							/>
						</div>

						<div className='flex gap-4 mt-4'>
							<div className='w-full'>
								<label className='text-xl mr-4 text-gray-500'>
									Manufacturing Cost
								</label>
								<input
									type='text'
									value={manCost}
									onChange={(e) => setManCost(e.target.value)}
									placeholder='0.00'
									className={`input ${
										inputError.includes('manCost') && 'border-red-600'
									}`}
								/>
							</div>

							<div className='w-full'>
								<label className='text-xl mr-4 text-gray-500'>
									Measurements (W x H)
								</label>
								<input
									type='text'
									value={measurements}
									onChange={(e) => setMeasurements(e.target.value)}
									placeholder=''
									className={`input ${
										inputError.includes('measurements') && 'border-red-600'
									}`}
								/>
							</div>
						</div>
						<div className='w-full mt-4'>
							<label className='text-xl mr-4 text-gray-500'>
								Storage Location
							</label>
							<input
								type='text'
								value={storageLocation}
								onChange={(e) => setStorageLocation(e.target.value)}
								placeholder=''
								className={`input ${
									inputError.includes('measurements') && 'border-red-600'
								}`}
							/>
						</div>
						<div className='w-full mt-5 flex justify-end gap-4'>
							<Link className='btn-outline' to={'/admin#settings'}>
								Add a Collection?
							</Link>
							<button className='btn w-[35%]' onClick={handleAddProduct}>
								Save
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddProduct;
