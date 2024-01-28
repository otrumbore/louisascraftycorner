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

			//console.log(fetchedOrders);
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
	//  'cash'
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
						<h3 className='text-2xl lg:text-3xl font-semibold'>
							Purchase History
						</h3>
					</div>
					{orders.length === 0 && !loading ? (
						<div className='flex w-full items-center justify-center mt-4'>
							<h5 className='text-xl '>No purchases yet 😔</h5>
						</div>
					) : (
						<div className='w-full'>
							<div className='max-w-full mt-8 w-full'>
								<div className='border-4 border-primary rounded-md w-full'>
									<table className='min-w-full bg-slate-100'>
										<thead>
											<tr className='border-b-4'>
												<th className='py-2 px-4 text-left'>Order #</th>
												<th className='py-2 px-4 '>Date</th>
												<th className='py-2 px-4 max-lg:hidden'>Items</th>
												<th className='py-2 px-4 max-lg:hidden'>Total</th>
												<th className='py-2 px-4 max-lg:hidden'>Status</th>
												<th className='py-2 px-4 text-right'></th>
											</tr>
										</thead>
										<tbody className='table-auto'>
											{orders.map((row) => (
												<tr key={row.orderId} className='border-b-2'>
													<td className='py-2 px-4 text-left'>{row.orderId}</td>
													<td className='py-2 px-4 text-center'>
														{row.createdAt
															? new Date(row.createdAt).toLocaleString(
																	'en-US',
																	{
																		year: 'numeric',
																		month: 'numeric',
																		day: 'numeric',
																		// hour: 'numeric',
																		// minute: 'numeric',
																		// hour12: true,
																	}
															  )
															: ''}
													</td>
													<td className='py-2 px-4 text-center max-lg:hidden'>
														{row.items.length}
													</td>

													<td className='py-2 px-4 text-center max-lg:hidden'>
														${parseFloat(row.prices.total / 100).toFixed(2)}
													</td>
													<td className='py-2 px-4 text-center max-lg:hidden'>
														<p
															className={`${
																row.status.length > 0
																	? row.status[row.status.length - 1].type ===
																			'shipped' ||
																	  row.status[row.status.length - 1].type ===
																			'paid'
																		? 'text-green-600'
																		: row.status[row.status.length - 1].type ===
																				'crafting' ||
																		  row.status[row.status.length - 1].type ===
																				'created' ||
																		  row.status[row.status.length - 1].type ===
																				'processing'
																		? 'text-orange-400'
																		: row.status[row.status.length - 1].type ===
																		  'payment_failed'
																		? 'text-red-600'
																		: 'text-primary'
																	: ''
															}`}
														>
															{row.status.length > 0
																? row.status[
																		row.status.length - 1
																  ].type.toUpperCase()
																: 'No Status'}
														</p>
													</td>
													<td className='py-2 px-4 flex items-center justify-end border-b space-x-4'>
														{row.shipping && row.shipping.tracking ? (
															<a
																target='_blank'
																href={`https://tools.usps.com/go/TrackConfirmAction?tRef=fullpage&tLc=2&text28777=&tLabels=${row.shipping.tracking}`}
																className='btn-outline text-gray-600 py-2 w-fit px-3'
															>
																<span className='hidden lg:block'>Track</span>
																<MdOutlineLocalShipping size={30} />
															</a>
														) : (
															<p>Not Shipped</p>
														)}
														<button
															className='btn py-2 w-fit px-3'
															onClick={() => setViewOrder(row)}
														>
															<span className='hidden lg:block'>View</span>
															<GrOverview size={30} />
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
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
