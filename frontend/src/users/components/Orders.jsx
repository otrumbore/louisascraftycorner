import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ViewOrder from './ViewOrder';
import { MdOutlineLocalShipping } from 'react-icons/md';
import { GrOverview } from 'react-icons/gr';
import getOrders from '../../api/orders.api';
import { useUser } from '../../context/UserContext';
import LoadingModal from '../../components/LoadingModal';

const Orders = () => {
	const [viewOrder, setViewOrder] = useState([]);
	const [orders, setOrders] = useState([]);
	const { userDetails } = useUser();
	const [loading, setLoading] = useState(false);

	const fetchOrders = async () => {
		setLoading(true);
		try {
			if (!userDetails._id) {
				return;
			}
			const fetchedOrders = await getOrders(userDetails._id, userDetails.email);

			const sortedOrders = fetchedOrders.sort(
				(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
			);

			const filteredOrders = sortedOrders.filter(
				(order) => order.active === true
			);

			console.log(fetchedOrders);
			setOrders(filteredOrders);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setViewOrder([]); // Reset viewOrder whenever the component re-renders
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
			<LoadingModal loading={loading} />
			{viewOrder.length === 0 ? (
				<div className='w-full'>
					<div className='flex w-full justify-center'>
						<h3 className='text-2xl lg:text-3xl'>Your Purchases</h3>
					</div>
					{orders.length <= 0 && !loading ? (
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
											{item.createdAt
												? new Date(item.createdAt).toLocaleString('en-US', {
														year: 'numeric',
														month: 'numeric',
														day: 'numeric',
														hour: 'numeric',
														minute: 'numeric',
														hour12: true,
												  })
												: ''}
										</p>
										<p>
											Items:{' '}
											{item.items.reduce((acc, curr) => acc + curr.quantity, 0)}
										</p>
										{item.shipping && item.shipping.tracking ? (
											<a
												target='_blank'
												href={`https://tools.usps.com/go/TrackConfirmAction?tRef=fullpage&tLc=2&text28777=&tLabels=${item.shipping.tracking}`}
												className='flex space-x-2 items-center justify-center text-gray-600'
											>
												<span className='hidden lg:block'>Track</span>
												<MdOutlineLocalShipping size={30} />
											</a>
										) : (
											'Not Shipped'
										)}
									</div>
									<div className='flex flex-wrap w-full items-center justify-between'>
										<p>Order# {item.orderId}</p>
										<p>Total: ${(item.prices.total / 100 || 0).toFixed(2)}</p>
										<button
											className='cursor-pointer'
											onClick={() => {
												setViewOrder(item);
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
					<ViewOrder order={viewOrder} setViewOrder={setViewOrder} />
				</>
			)}
		</>
	);
};

export default Orders;
