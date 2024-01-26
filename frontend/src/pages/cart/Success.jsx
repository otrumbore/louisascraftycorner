import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';

const Success = () => {
	const { orderId } = useParams();
	const { clearCart } = useCart();
	const { userDetails } = useUser();

	useEffect(() => {
		clearCart();
	}, []);

	return (
		<div className='flex flex-col items-center justify-center min-h-[75vh]'>
			<div className='bg-slate-200 p-8 border-4 border-dotted border-primary rounded-md shadow-2xl w-96 text-center'>
				<svg
					className='text-green-500 w-16 h-16 mx-auto mb-4'
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					fill='currentColor'
				>
					<path
						fillRule='evenodd'
						d='M10 18a8 8 0 100-16 8 8 0 000 16zM4.93 6.95a1 1 0 011.41-1.41l3.07 3.07 6.24-6.24a1 1 0 111.41 1.41l-7 7a1 1 0 01-1.41 0L4.93 6.95z'
						clipRule='evenodd'
					/>
				</svg>
				<h1 className='text-2xl font-semibold mb-2'>
					Order Successfully Placed!
				</h1>
				<h3 className='mb-2 text-xl'>
					Thank You, {userDetails.name.split(' ')[0]}
				</h3>
				<p className='text-gray-600 mb-4'>
					Your order, under #{orderId}, has been successfully processed.
				</p>
				<div className='flex justify-center'>
					<Link to={'/shop'} className='btn'>
						Continue Shopping
					</Link>
				</div>
				<div className='flex justify-center'>
					<Link to={'/user/dashboard#orders'} className='btn-outline'>
						View My Orders
					</Link>
				</div>
				<p className='text-gray-600 mt-4'>
					Thank you for your support and business!!
				</p>
			</div>
		</div>
	);
};

export default Success;
