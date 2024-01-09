import React from 'react';
import { BiUserCircle } from 'react-icons/bi';
import { AiOutlineClose } from 'react-icons/ai';
import { PiBookOpenTextLight } from 'react-icons/pi';
import {
	MdOutlineDescription,
	MdPriceCheck,
	MdOutlineStarBorder,
	MdOutlineCategory,
} from 'react-icons/md';
import { IoPricetagsOutline } from 'react-icons/io5';
import { SiMonkeytype } from 'react-icons/si';

const capitalizeFirstLetter = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

const ProductModal = ({ product, onClose }) => {
	const capitalizedCategory = capitalizeFirstLetter(product.category);
	const capitalizedType = capitalizeFirstLetter(product.type);

	return (
		<div
			className='fixed inset-0 overflow-y-auto bg-gray-800 bg-opacity-25 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center cursor-auto'
			onClick={onClose}
		>
			<div
				onClick={(event) => event.stopPropagation()}
				className='w-[600px] max-w-full max-h-[80vh] bg-white rounded-xl p-4 flex flex-col relative'
			>
				<AiOutlineClose
					className='absolute right-6 top-6 text-3xl text-red-600 cursor-pointer'
					onClick={onClose}
				/>
				<h2 className='w-fit text-xs px-4 py-1 bg-purple-300 rounded-md reounded-lg'>
					System ID: {product._id}
				</h2>
				{product.sale > 0 && (
					<div className='mt-4 flex w-full items-center justify-center'>
						<h2 className='w-fit text-xs px-4 py-1 bg-red-200 text-red-600 rounded-md reounded-lg'>
							Active Sale
						</h2>
					</div>
				)}

				<h4 className='my-2 text-lg text-gray-500'>
					Store ID: {product.storeId}
				</h4>
				<div className='grid grid-cols-2'>
					<div className='flex justify-start items-center gap-x-2'>
						<MdOutlineDescription className='text-purple-600 text-2xl' />
						<h2 className='my-1'>{product.name}</h2>
					</div>
					<div className='flex justify-end items-center gap-x-2'>
						<h2 className='my-1'>
							{product.rating !== undefined && product.rating > 0
								? product.rating + '/5'
								: 'No Rating'}
						</h2>
						<MdOutlineStarBorder className='text-purple-600 text-2xl' />
					</div>
					<div className='flex justify-start items-center gap-x-2'>
						<MdPriceCheck className='text-purple-600 text-2xl' />
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
						<IoPricetagsOutline className='text-purple-600 text-2xl' />
					</div>
					<div className='flex justify-start items-center gap-x-2'>
						<MdOutlineCategory className='text-purple-600 text-2xl' />
						<h2 className='my-1'>{capitalizedCategory}</h2>
					</div>
					<div className='flex justify-end items-center gap-x-2'>
						<h2 className='my-1'>{capitalizedType}</h2>
						<SiMonkeytype className='text-purple-600 text-2xl' />
					</div>
					<div className='flex justify-start items-center gap-x-2'>
						<SiMonkeytype className='text-purple-600 text-2xl' />
						{product.inventory < 3 ? (
							<h2 className='my-1 text-red-400'>
								{product.inventory} left in stock
							</h2>
						) : (
							<h2 className='my-1'>{product.inventory} left in stock</h2>
						)}
					</div>
					<div className='flex justify-end items-center gap-x-2'>
						{/* <h2 className='my-1'>{capitalizedType}</h2>
						<SiMonkeytype className='text-purple-600 text-2xl' /> */}
					</div>
				</div>

				{/* Description */}
				<div className='mt-4 p-2 max-h-[40vh] border border-gray-300 rounded-md overflow-y-auto'>
					<p className='font-bold'>Description:</p>
					<p className='whitespace-pre-line'>{product.description}</p>
				</div>

				{/* Tags */}
				<div className='mt-4 p-2 border border-gray-300 rounded-md overflow-y-auto'>
					<p className='font-bold'>Search Tags:</p>
					<p>{product.tags}</p>
				</div>
			</div>
		</div>
	);
};

export default ProductModal;
