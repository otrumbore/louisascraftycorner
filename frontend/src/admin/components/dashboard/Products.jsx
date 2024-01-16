import React, { useEffect, useState } from 'react';
import LoadingModal from '../../../components/LoadingModal';
import ProductModal from './ProductModal';
import DeleteModal from '../DeleteModal';
import {
	MdAdd,
	MdOutlineVisibilityOff,
	MdOutlineVisibility,
	MdOutlineEdit,
	MdOutlinePreview,
} from 'react-icons/md';
import { VscPreview } from 'react-icons/vsc';
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

	const openModal = (product) => {
		//console.log(productId);
		setShowModal(product);
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

				<div className='pb-4 pr-4 border-4 border-primary rounded-md'>
					<table className='w-full'>
						<thead className='border-b-4 border-primary text-xl font-bold'>
							<tr className=''>
								<th className='max-lg:hidden'>
									<div className='py-4'>Image</div>
								</th>
								<th className='max-md:hidden'>ID</th>
								<th>Name</th>
								<th>Price</th>
								<th>Quantity</th>
								<th>Rating</th>
								<th className='max-lg:hidden'>Status</th>
								<th className='max-lg:hidden'>Last Update</th>
								<th className='max-lg:hidden text-right pr-2'>Actions</th>
							</tr>
						</thead>
						<tbody className=''>
							{products.map((product) => (
								<tr key={product._id} className='border-b-4'>
									<td className='max-lg:hidden'>
										<div className='flex justify-center py-2'>
											<img
												src={product.image}
												className='w-20 h-20 border-2 rounded-md hover:scale-150'
											/>
										</div>
									</td>
									<td className='max-md:hidden text-center'>
										{product.storeId}
									</td>
									<td>
										<div className='flex justify-center gap-1'>
											<p>{product.name}</p>
											<p className='max-lg:hidden'>{'- ' + product.type}</p>
										</div>
									</td>
									<td className='text-center'>${product.price}</td>
									<td className='text-center'>{product.inventory}</td>
									<td className='text-center'>{product.rating}/5</td>
									<td className='max-lg:hidden'>
										<div className='flex items-center justify-center space-x-2'>
											{product.active ? (
												<p
													className={`text-left w-fit text-wrap bg-green-400 text-white px-3 py-1 rounded-md`}
												>
													Active
												</p>
											) : (
												<p
													className={`text-left w-fit text-wrap bg-orange-400 text-white px-3 py-1 rounded-md`}
												>
													Inactive
												</p>
											)}
											{product.sale > 0 && (
												<p
													className={`text-left w-fit text-wrap bg-red-500 text-white px-3 py-1 rounded-md`}
												>
													On Sale
												</p>
											)}
										</div>
									</td>
									<td className='max-lg:hidden'>
										<p className={`text-wrap text-center `}>
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
									</td>
									<td className='max-lg:hidden'>
										<div className='flex flex-col items-end'>
											<div className='flex items-center'>
												<Link
													to={`/admin/editproduct/${product._id}`}
													className='btn-ghost px-2'
												>
													<MdOutlineEdit size={25} />
												</Link>
												<button
													className={`btn-ghost px-2 ${
														product.active
															? 'text-orange-400'
															: 'text-green-400'
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
											<div className='flex items-center'>
												<Link
													to={`/product/${product._id}`}
													className={`btn-ghost px-2 `}
													onClick={() => {
														openModal(product);
													}}
												>
													<MdOutlinePreview className='' size={25} />
												</Link>
												<button
													className={`btn-ghost px-2 `}
													onClick={() => {
														openModal(product);
													}}
												>
													<VscPreview className='' size={25} />
												</button>
											</div>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{showModal && <ProductModal product={showModal} onClose={closeModal} />}
			</div>
		</>
	);
};

export default Products;
