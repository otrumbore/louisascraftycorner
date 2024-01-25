import React from 'react';
import { useParams, Link } from 'react-router-dom';

const Success = () => {
	const { orderId } = useParams();

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
				<h3 className='mb-2 text-xl'>Thank You!</h3>
				<p className='text-gray-600 mb-4'>
					Your order with ID {orderId} has been successfully processed.
				</p>
				<div className='flex justify-center'>
					<Link to={'/shop'} className='btn'>
						Continue Shopping
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Success;
