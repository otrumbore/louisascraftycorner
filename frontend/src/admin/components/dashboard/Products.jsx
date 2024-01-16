import React, { useEffect, useState } from 'react';
import LoadingModal from '../../../components/LoadingModal';
import ProductModal from './ProductModal';
import DeleteModal from '../DeleteModal';
import {
	MdAdd,
	MdOutlineVisibilityOff,
	MdOutlineVisibility,
	MdOutlineEdit,
} from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import getProducts, { updateProduct } from '../../../api/products.api';

const Products = ({ archived }) => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const { enqueueSnackbar } = useSnackbar();

	const [showModal, setShowModal] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(null);

	const fetchProducts = async (archived) => {
		setLoading(true);
		try {
			const fetchedProducts = await getProducts(); // Await the asynchronous function
			let filteredProducts = [];

			if (archived) {
				filteredProducts = fetchedProducts.filter(
					(product) => product.archived === true
				);
			} else {
				filteredProducts = fetchedProducts.filter(
					(product) => product.archived === false
				);
			}

			// Sort products to show inactive ones at the bottom
			filteredProducts.sort((a, b) => {
				// Inactive products (active: false) should come after active ones
				if (!a.active && b.active) {
					return 1;
				}
				// Active products (active: true) should come before inactive ones
				if (a.active && !b.active) {
					return -1;
				}
				// For products with the same active status, maintain their order
				return 0;
			});

			//console.log(filteredProducts);

			setProducts(filteredProducts);
			setLoading(false); // Update loading state when data is fetched
			//console.log(filteredProducts);
		} catch (error) {
			console.error(error);
			setLoading(false); // Update loading state in case of error
			return (
				<div className='mt-8 w-full justify-center text-xl'>
					Could not load products refresh to try again.
				</div>
			);
		} finally {
			setLoading(false);
		}
	};

	const sendProductUpdate = async (id, data, name) => {
		setLoading(true);
		try {
			const response = await updateProduct(id, data);
			console.log(response);
			if (
				(response.status === 200 || response.status === 201) &&
				(data.active || !data.active)
			) {
				enqueueSnackbar(name + `'s active status set to ` + data.active, {
					variant: 'success',
				});
			}
			fetchProducts(archived);
		} catch (error) {
			console.error(error);
			setLoading(false);
			enqueueSnackbar('Could not set product to inactive', {
				variant: 'error',
			});
		}
	};

	const openModal = (productId) => {
		setShowModal(productId);
	};

	const closeModal = () => {
		fetchProducts(archived);
		setShowModal(null);
	};

	const openDeleteModal = (productId) => {
		setShowDeleteModal(productId);
	};

	const closeDeleteModal = () => {
		setShowDeleteModal(null);
	};

	useEffect(() => {
		fetchProducts(archived);
	}, [archived, showModal]);

	const adminNotifications = [
		{ text: '111111 - low inventory' },
		{ text: '111112 - low inventory' },
		{ text: '111111 - low inventory' },
		{ text: '111112 - low inventory' },
	];
	// Calculate counts of active and inactive products
	const activeCount = products.filter(
		(product) => product.active === true
	).length;
	const inactiveCount = products.filter(
		(product) => product.active === false
	).length;

	return (
		<>
			<LoadingModal loading={loading} />

			<div className='mt-4 w-full'>
				<div
					className={`${
						archived && 'hidden'
					} flex flex-col lg:flex-row lg:gap-4 lg:mb-4`}
				>
					<div className='lg:w-[52%] bg-yellow-400 p-4 text-black grid grid-cols-1 lg:grid-cols-2 flex-wrap justify-center rounded-md border-4 border-primary border-dashed'>
						{adminNotifications.map((item, i) => (
							<p key={i}>{i + 1 + ': ' + item.text}</p>
						))}
					</div>
					<div className='lg:w-[25%] lg:my-0 my-4 flex items-center justify-between p-4 border-4 border-primary border-dashed rounded-md'>
						<p>Total: {products.length}</p>
						<p>Active: {activeCount}</p>
						<p>Inactive: {inactiveCount}</p>
					</div>
					<div className='hidden lg:flex lg:w-[25%] p-4 border-4 border-primary border-dashed items-center justify-end rounded-md'>
						<Link to={'/admin/addproduct'} className='btn-outline px-0 py-0'>
							<MdAdd className='text-5xl' />
						</Link>
					</div>
				</div>
				{!products && (
					<p className='w-full text-center text-xl'>
						No products have been found
					</p>
				)}
				<div
					className={` w-full grid grid-cols-1 border-4 border-primary rounded-md`}
				>
					<div
						className='relative w-full flex px-4 py-4 cursor-pointer items-center border-b-2 border-slate-400 gap-4'
						//onClick={}//openModal(user._id)}
					>
						<div className='lg:w-[5%] text-left text-lg font-bold'>Store #</div>
						<div className='lg:w-[25%] text-left text-lg font-bold'>Name</div>
						<div className='hidden lg:block w-[10%] text-left text-lg font-bold'>
							Price
						</div>
						<div className='hidden lg:block w-[5%] text-left text-lg font-bold'>
							QTY
						</div>
						<div className='hidden lg:block w-[5%] text-left text-lg font-bold'>
							Rating
						</div>
						<div className='hidden lg:block w-[15%] text-left text-lg font-bold'></div>

						<div className='hidden lg:block w-[12%] text-left text-lg font-bold'>
							<p>Status</p>
						</div>
						<div className='hidden lg:block w-[15%] text-left text-lg font-bold pl-4'>
							<p>Last Update</p>
						</div>

						<div className='absolute right-0 pr-4 flex w-[15%] gap-2 items-center justify-end text-lg font-bold'>
							Actions
						</div>
					</div>
					{products.map((product) => (
						<div
							key={product._id}
							className='relative w-full flex px-4 py-4 border-b-2 border-slate-300 items-center'
						>
							<button
								onClick={() => openModal(product._id)}
								className='flex w-full cursor-pointer items-center gap-4'
							>
								<div className='lg:w-[5%] text-left text-wrap'>
									{product.storeId}
								</div>
								<div className='lg:w-[25%] text-left text-wrap'>
									{product.name} - {product.type}
								</div>
								<div className='hidden w-[10%] lg:flex gap-2 text-wrap'>
									<p className={`${product.sale > 0 && 'line-through'}`}>
										${product.price}
									</p>
									{product.sale > 0 && (
										<p className='text-red-600'>${product.sale}</p>
									)}
								</div>

								<div className='hidden lg:flex w-[5%] text-wrap'>
									<p className={`text-left text-wrap `}>{product.inventory}</p>
								</div>
								<div className='hidden lg:flex w-[5%] text-wrap'>
									<p className={`text-left text-wrap `}>{product.rating}/5</p>
								</div>
								<div className='hidden lg:flex w-[15%] text-wrap'></div>

								<div className='hidden lg:flex w-[12%] text-wrap justify-between items-center'>
									{product.active ? (
										<p
											className={`text-left text-wrap bg-green-400 text-white px-3 py-1 rounded-md`}
										>
											Active
										</p>
									) : (
										<p
											className={`text-left text-wrap bg-orange-400 text-white px-3 py-1 rounded-md`}
										>
											Inactive
										</p>
									)}
									{product.sale > 0 && (
										<p
											className={`text-left text-wrap bg-red-500 text-white px-3 py-1 rounded-md`}
										>
											On Sale
										</p>
									)}
								</div>
								<div className='hidden lg:flex w-[15%] text-wrap pl-4'>
									<p className={`text-wrap `}>
										{product.updatedAt
											? new Date(product.updatedAt).toLocaleString('en-US', {
													hour: 'numeric',
													minute: 'numeric',
													hour12: true,
													day: 'numeric',
													month: 'numeric',
													year: 'numeric',
											  })
											: 'No Recent Update'}
									</p>
								</div>
							</button>
							<div className='absolute right-0 pr-2 flex min-w-[5%] items-center justify-end'>
								<Link
									to={`/admin/editproduct/${product._id}`}
									className='btn-ghost px-2'
								>
									<MdOutlineEdit size={25} />
								</Link>
								<button
									className={`btn-ghost px-2 ${
										product.active ? 'text-orange-400' : 'text-green-400'
									}`}
									onClick={() => {
										const data = { active: !product.active };
										sendProductUpdate(product._id, data, product.name);
									}}
								>
									{product.active ? (
										<MdOutlineVisibilityOff className='' size={25} />
									) : (
										<MdOutlineVisibility className='' size={25} />
									)}
								</button>
							</div>
							{showModal === product._id && (
								<ProductModal product={product} onClose={closeModal} />
							)}
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default Products;
