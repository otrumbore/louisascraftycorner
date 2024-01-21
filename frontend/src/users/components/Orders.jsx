import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ViewOrder from './ViewOrder';
import { MdOutlineLocalShipping } from 'react-icons/md';
import { GrOverview } from 'react-icons/gr';
import getOrders from '../../api/orders.api';
import { useUser } from '../../context/UserContext';

const Orders = () => {
	const [viewOrder, setViewOrder] = useState('');
	const [orders, setOrders] = useState([]);
	const { userDetails } = useUser();
	const [loading, setLoading] = useState(false);

	const fetchOrders = async () => {
		setLoading(true);
		try {
			const waitForUserId = async () => {
				while (!userDetails._id) {
					// Wait for 100 milliseconds before checking again
					await new Promise((resolve) => setTimeout(resolve, 100));
				}
			};

			// Wait for userDetails._id to be set
			await waitForUserId();

			const orders = await getOrders(userDetails._id);
			console.log(orders);
			setOrders(orders);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setViewOrder(''); // Reset viewOrder whenever the component re-renders
		fetchOrders();
	}, []);

	// enum: [
	// 	'created',
	// 	'processing',
	// 	'paid',
	// 	'crafting',
	// 	'shipped',
	// 	'delivered',
	// 	'payment_failed',
	// ],

	return (
		<>
			{!viewOrder ? (
				<div className='w-full'>
					<div className='flex w-full justify-center'>
						<h3 className='text-2xl lg:text-3xl'>Your Purchases</h3>
					</div>
					{orders.length <= 0 ? (
						<div className='flex w-full items-center justify-center mt-4'>
							<h5 className='text-lg'>HMMM...No purchases yet 😔</h5>
						</div>
					) : (
						<div className='mt-8 grid grid-cols-1 lg:grid-cols-2 w-full gap-4'>
							{orders.map((item, i) => (
								<div
									key={i}
									className='border-2 border-primary p-4 rounded-md space-y-4'
								>
									<div className='flex flex-wrap items-center justify-center'>
										<div className='flex gap-2'>
											Status:{' '}
											<p
												className={`${
													item.status.length > 0
														? item.status[item.status.length - 1].type ===
																'shipped' ||
														  item.status[item.status.length - 1].type ===
																'paid' ||
														  item.status[item.status.length - 1].type ===
																'delivered'
															? 'text-green-600'
															: item.status[item.status.length - 1].type ===
																	'crafting' ||
															  item.status[item.status.length - 1].type ===
																	'created' ||
															  item.status[item.status.length - 1].type ===
																	'processing'
															? 'text-orange-400'
															: item.status[item.status.length - 1].type ===
															  'payment_failed'
															? 'text-red-600'
															: ''
														: ''
												}`}
											>
												{item.status.length > 0
													? item.status[
															item.status.length - 1
													  ].type.toUpperCase()
													: 'No Status'}
											</p>
										</div>
									</div>
									<div className='flex flex-wrap w-full items-center justify-between'>
										<p>
											Date:{' '}
											{new Date(item.createdAt).toLocaleString('en-US', {
												year: 'numeric',
												month: 'numeric',
												day: 'numeric',
												hour: 'numeric',
												minute: 'numeric',
												hour12: true,
											})}
										</p>
										<p>
											Items:{' '}
											{item.items.reduce((acc, curr) => acc + curr.quantity, 0)}
										</p>
										<p className='flex space-x-2 items-center justify-center text-gray-600'>
											<span className='hidden lg:block'>Track</span>
											<MdOutlineLocalShipping size={30} />
										</p>
									</div>
									<div className='flex flex-wrap w-full items-center justify-between'>
										<p>Order# {item.orderId}</p>
										<p>Total: ${item.prices.total / 100}</p>
										<button
											className='cursor-pointer'
											onClick={() => {
												setViewOrder(item.orderId);
											}}
										>
											<p className='flex space-x-2 items-center justify-center text-gray-600'>
												<span className='hidden lg:block'>View</span>
												<GrOverview size={30} />
											</p>
										</button>
									</div>
								</div>
							))}
						</div>
					)}
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
