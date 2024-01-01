import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ViewOrder from './ViewOrder';

const Orders = () => {
	const [viewOrder, setViewOrder] = useState('');
	const [orders, setOrders] = useState([
		{
			date: '12/22/23',
			itemCount: 6,
			orderNum: 4728367,
			total: '28.76',
		},
		{
			date: '12/23/23',
			itemCount: 6,
			orderNum: 4728332,
			total: '104.06',
		},
		{
			date: '12/24/23',
			itemCount: 6,
			orderNum: 4728309,
			total: '198.39',
		},
		{
			date: '12/28/23',
			itemCount: 6,
			orderNum: 4728316,
			total: '18.72',
		},
		// Add more orders as needed...
	]);

	useEffect(() => {
		setViewOrder(''); // Reset viewOrder whenever the component re-renders
	}, []);

	return (
		<>
			{!viewOrder ? (
				<div className='w-full'>
					<div className='flex w-full'>
						<h3 className='text-xl'>Your Purchases</h3>
					</div>
					<div className='mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4'>
						{orders.map((item, i) => (
							<div
								key={i}
								className='border-4 border-slate-300 p-4 rounded-md space-y-4'
							>
								<div className='flex flex-wrap w-full items-center justify-between'>
									<p>Date: {item.date}</p>
									<p>Items: {item.itemCount}</p>
									<p>Track Order</p>
								</div>
								<div className='flex flex-wrap w-full items-center justify-between'>
									<p>Order# {item.orderNum}</p>
									<p>Total: ${item.total}</p>
									<p
										className='cursor-pointer'
										onClick={() => {
											setViewOrder(item.orderNum);
										}}
									>
										View Order
									</p>
								</div>
							</div>
						))}
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
