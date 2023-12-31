import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ViewOrder from './ViewOrder';

const Orders = () => {
	const [viewOrder, setViewOrder] = useState('');

	useEffect(() => {
		return () => {
			setViewOrder('');
		};
	}, []);

	return (
		<>
			{!viewOrder ? (
				<div className='w-full'>
					<div className='flex w-full'>
						<h3 className='text-xl'>Your Purchases</h3>
					</div>
					<div className='mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4'>
						<div className='border-4 border-slate-300 p-4 rounded-md space-y-4'>
							<div className='flex flex-wrap w-full items-center justify-between'>
								<p>Date: 12/23/2023</p>
								<p>Items: 6</p>
								<p>Track Order</p>
							</div>
							<div className='flex flex-wrap w-full items-center justify-between'>
								<p>Order# 4728367</p>
								<p>Total: $28.76</p>
								<p
									onClick={() => {
										setViewOrder('4728367');
									}}
								>
									View Order
								</p>
							</div>
						</div>

						<div className='border-4 border-slate-300 p-4 rounded-md space-y-4'>
							<div className='flex flex-wrap w-full items-center justify-between'>
								<p>Date: 12/23/2023</p>
								<p>Items: 6</p>
								<p>Track Order</p>
							</div>
							<div className='flex flex-wrap w-full items-center justify-between'>
								<p>Order# 4728367</p>
								<p>Total: $28.76</p>
								<p>View Order</p>
							</div>
						</div>
						<div className='border-4 border-slate-300 p-4 rounded-md space-y-4'>
							<div className='flex flex-wrap w-full items-center justify-between'>
								<p>Date: 12/23/2023</p>
								<p>Items: 6</p>
								<p>Track Order</p>
							</div>
							<div className='flex flex-wrap w-full items-center justify-between'>
								<p>Order# 4728367</p>
								<p>Total: $28.76</p>
								<p>View Order</p>
							</div>
						</div>
						<div className='border-4 border-slate-300 p-4 rounded-md space-y-4'>
							<div className='flex flex-wrap w-full items-center justify-between'>
								<p>Date: 12/23/2023</p>
								<p>Items: 6</p>
								<p>Track Order</p>
							</div>
							<div className='flex flex-wrap w-full items-center justify-between'>
								<p>Order# 4728367</p>
								<p>Total: $28.76</p>
								<p>View Order</p>
							</div>
						</div>
					</div>
				</div>
			) : (
				<>
					<ViewOrder orderNum={viewOrder} setViewOrder={setViewOrder} />
				</>
			)}
		</>
	);
};

export default Orders;
