import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import {
	MdOutlineDescription,
	MdPriceCheck,
	MdOutlineStarBorder,
	MdOutlineCategory,
} from 'react-icons/md';
import { useSnackbar } from 'notistack';
import { IoPricetagsOutline } from 'react-icons/io5';
import { FaLocationArrow } from 'react-icons/fa';
import { SiMonkeytype } from 'react-icons/si';
import { updateProduct } from '../../../api/products.api';
import { Link, useNavigate } from 'react-router-dom';
import DefaultProductImg from '../../../assets/product-img/default.png';

const capitalizeFirstLetter = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

const ProductModal = ({ product, onClose }) => {
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const capitalizedCategory = capitalizeFirstLetter(product.category);
	const capitalizedType = capitalizeFirstLetter(product.type);

	const toggleActive = (data) => {
		updateProduct(product._id, data);
		product.active
			? enqueueSnackbar(`${product.storeId} no longer active`, {
					variant: 'success',
			  })
			: enqueueSnackbar(`${product.storeId} is now active`, {
					variant: 'success',
			  });
		onClose();
	};

	const toggleArchived = (data) => {
		updateProduct(product._id, data);
		data.archived
			? enqueueSnackbar(`${product.storeId} is deleted`, {
					variant: 'success',
			  })
			: enqueueSnackbar(`${product.storeId} is recovered`, {
					variant: 'success',
			  });

		onClose();
	};

	return (
		<div
			className='fixed inset-0 bg-primary bg-opacity-10 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center cursor-auto'
			onClick={onClose}
		>
			<div
				onClick={(event) => event.stopPropagation()}
				className='w-[600px] max-w-full max-h-[80vh] bg-white rounded-xl p-4 flex flex-col relative'
			>
				<div className='overflow-y-auto overflow-scroll'>
					<div className='btn-outline absolute text-red-600 right-4 top-4 cursor-pointer px-2 bg-white'>
						<AiOutlineClose className='text-3xl' onClick={onClose} />
					</div>

					<h2 className='w-fit text-xs px-4 py-1 bg-primary text-white rounded-md reounded-lg'>
						System ID: {product._id}
					</h2>

					<div className='mt-4 flex w-full items-center justify-center gap-4'>
						{product.sale > 0 && (
							<h2 className='w-fit text-sm px-4 py-1 bg-red-200 text-red-600 rounded-md'>
								On Sale
							</h2>
						)}
						<p
							className={`${
								product.active ? 'bg-green-500 text-white' : 'bg-orange-400'
							} text-sm px-4 py-1 rounded-md`}
						>
							{product.active ? 'Active' : 'Inactive'}
						</p>
					</div>

					<h4 className='my-2 text-lg text-primary'>
						Store ID: {product.storeId}
					</h4>
					<div className='grid grid-cols-2'>
						<div className='flex justify-start items-center gap-x-2'>
							<MdOutlineDescription className='text-primary text-2xl' />
							<h2 className='my-1'>{product.name}</h2>
						</div>
						<div className='flex justify-end items-center gap-x-2'>
							<h2 className='my-1'>
								{product.rating !== undefined && product.rating > 0
									? product.rating + '/5'
									: 'No Rating'}
							</h2>
							<MdOutlineStarBorder className='text-primary text-2xl' />
						</div>
						<div className='flex justify-start items-center gap-x-2'>
							<MdPriceCheck className='text-primary text-2xl' />
							{product.sale > 0 ? (
								<h2 className='my-1 line-through text-red-400'>
									${product.price}
								</h2>
							) : (
								<h2 className='my-1'>${product.price}</h2>
							)}
						</div>
						<div className='flex justify-end items-center gap-x-2'>
							<h2 className='my-1'>
								{product.sale > 0 ? '$' + product.sale : 'No Active Sale'}
							</h2>
							<IoPricetagsOutline className='text-primary text-2xl' />
						</div>
						<div className='flex justify-start items-center gap-x-2'>
							<MdOutlineCategory className='text-primary text-2xl' />
							<h2 className='my-1'>{capitalizedCategory}</h2>
						</div>
						<div className='flex justify-end items-center gap-x-2'>
							<h2 className='my-1'>{capitalizedType}</h2>
							<SiMonkeytype className='text-primary text-2xl' />
						</div>
						<div className='flex justify-start items-center gap-x-2'>
							<SiMonkeytype className='text-primary text-2xl' />
							{product.inventory < 3 ? (
								<h2 className='my-1 text-red-400'>
									{product.inventory} left in stock
								</h2>
							) : (
								<h2 className='my-1'>{product.inventory} left in stock</h2>
							)}
						</div>
						<div className='flex justify-end items-center gap-x-2'>
							<h2 className='my-1'>{product.storageLocation}</h2>
							<FaLocationArrow className='text-xl text-primary' />
						</div>
						<div className='flex justify-start items-center gap-x-2'>
							<strong>Scroll down for more</strong>
						</div>
					</div>

					{/* Description */}
					<div className='mt-4 p-2 max-h-[40vh] border border-gray-300 rounded-md overflow-y-auto'>
						<p className='font-bold'>Description:</p>
						<p className='whitespace-pre-line'>{product.description}</p>
					</div>
					<div className='flex gap-2 justify-between'>
						<div className='mt-4 h-[150px] lg:flex justify-center w-[35%]'>
							<img
								src={product.image ? product.image : DefaultProductImg}
								alt={product.name + ' image'}
								className='h-full w-fit object-cover rounded-2xl'
							/>
						</div>

						{/* Tags */}
						<div className='mt-4 p-2 w-[65%] border border-gray-300 rounded-md overflow-y-auto'>
							<p className='font-bold'>Search Tags:</p>
							<p>{product.tags}</p>
						</div>
					</div>
				</div>

				<div className='flex flex-col gap-4 lg:flex-row w-full mt-4 justify-between items-center text-wrap'>
					<button
						onClick={() => {
							const data = { archived: !product.archived, active: false };
							toggleArchived(data);
						}} // Wrap the function call in an arrow function
						className='btn bg-red-600 hover:bg-red-700 text-white w-full lg:w-auto'
					>
						{product.archived ? 'Recover Product?' : 'Delete Product?'}
					</button>
					<button
						onClick={() => {
							const data = { active: !product.active };
							toggleActive(data);
						}} // Wrap the function call in an arrow function
						className={`${
							product.archived && 'hidden'
						} btn-outline w-full lg:w-auto`}
					>
						{product.active ? 'Make Inactive' : 'Make Active'}
					</button>

					<Link
						to={`/admin/editproduct/${product._id}`}
						className='btn w-full lg:w-auto'
					>
						Edit
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ProductModal;
