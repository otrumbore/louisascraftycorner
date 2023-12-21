import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { MdOutlineDescription, MdPriceCheck } from 'react-icons/md';
import { SiMonkeytype } from 'react-icons/si';
import LoadingModal from '../components/LoadingModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const DeleteModal = ({ product, onClose }) => {
	const [loading, setLoading] = useState(false);
	const naviagte = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const handleDeleteBook = () => {
		setLoading(true);
		axios
			.delete(`http://10.0.0.85:5555/products/${product._id}`)
			.then((response) => {
				enqueueSnackbar('Product deleted sucessfully, reloading...', {
					variant: 'success',
					anchorOrigin: { horizontal: 'right', vertical: 'top' },
				});
				//onClose();
				// Perform a page refresh
				// Set a timer before reloading the page
				setTimeout(() => {
					onClose();
					setLoading(false);
					window.location.reload();
				}, 1000); // Set the timer to 1500 milliseconds (1.5 seconds) - Change as needed
			})
			.catch((error) => {
				setLoading(false);
				alert('Error deleting book');
				console.log(error);
			});
	};
	return (
		<div
			className='fixed inset-0 overflow-y-auto bg-gray-800 bg-opacity-25 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center'
			onClick={onClose}
		>
			<div
				onClick={(event) => event.stopPropagation()}
				className='w-[600px] max-w-full max-h-[80vh] bg-white rounded-xl p-4 flex flex-col relative'
			>
				{loading && <LoadingModal loading={loading} />}
				<AiOutlineClose
					className='absolute right-6 top-6 text-3xl text-red-600 cursor-pointer'
					onClick={onClose}
				/>
				<h2 className='w-fit text-xs px-4 py-1 bg-purple-300 rounded-md reounded-lg'>
					System ID: {product._id}
				</h2>
				<h4 className='my-2 text-lg text-gray-500'>Store ID: {product.id}</h4>
				<h1 className='text-3xl my-4'>Delete Product?</h1>

				<div className='grid grid-cols-2'>
					<div className='flex justify-start items-center gap-x-2'>
						<MdOutlineDescription className='text-purple-600 text-2xl' />
						<h2 className='my-1'>{product.name}</h2>
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

					<div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[575px] p-8 mx-auto'>
						<h3 className='text-xl'>
							Are you sure you want to delete this product?
						</h3>
						<button
							className='p-4 bg-red-600 text-white m-8 w-full'
							onClick={handleDeleteBook}
						>
							Yes, delete it!
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DeleteModal;
