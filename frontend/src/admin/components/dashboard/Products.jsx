import React, { useEffect, useState } from 'react';
import getProducts from '../../../api/products.api';
import LoadingModal from '../../../components/LoadingModal';
import ProductModal from './ProductModal';
import DeleteModal from '../DeleteModal';
import { MdAdd } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Products = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	const [showModal, setShowModal] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(null);

	const fetchProducts = async () => {
		try {
			const fetchedProducts = await getProducts(); // Await the asynchronous function
			const filteredProducts = fetchedProducts.filter(
				(product) => product.archived === false
			);
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
		}
	};

	const openModal = (productId) => {
		setShowModal(productId);
	};

	const closeModal = () => {
		setShowModal(null);
		fetchProducts();
	};

	const openDeleteModal = (productId) => {
		setShowDeleteModal(productId);
	};

	const closeDeleteModal = () => {
		setShowDeleteModal(null);
	};

	useEffect(() => {
		fetchProducts();
	}, []);

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
				<div className='flex flex-col lg:flex-row lg:gap-4 lg:mb-4'>
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
				<div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-4'>
					{products.map((product) => (
						<div
							key={product._id}
							className='w-full p-4 border-4 border-primary rounded-md space-y-2 cursor-pointer'
							onClick={() => openModal(product._id)}
						>
							<div className='w-full flex items-center justify-between'>
								<p className='text-xs'>
									<strong>Store ID:</strong> {product.storeId}
								</p>
								{product.sale > 0 && (
									<p className='text-red-600 text-sm'>On Sale</p>
								)}

								<p className='hidden lg:block text-xs'>
									<strong>System ID:</strong> {product._id}
								</p>
							</div>
							<div className='flex flex-row lg:items-center justify-between'>
								<p
									className='flex-wrap'
									onClick={() => {
										ProductModal(product);
									}}
								>
									{product.name} - {product.type}
								</p>
								<div className='flex flex-wrap lg:items-center gap-2'>
									<p className={`${product.sale > 0 && 'line-through'}`}>
										${product.price}
									</p>
									{product.sale > 0 && (
										<p className='text-red-600'>${product.sale}</p>
									)}
								</div>
							</div>
							<div className='flex justify-between items-center'>
								<p>Inventory: {product.inventory}</p>
								<p>{product.rating}/5</p>
							</div>
							<div className='flex items-center justify-between'>
								<p className='text-xs'>
									<strong>Last Update:</strong> {product.updatedAt}
								</p>
								{product.active ? (
									<p className='text-green-600'>Active</p>
								) : (
									<p className='text-orange-500'>Inactive</p>
								)}
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
