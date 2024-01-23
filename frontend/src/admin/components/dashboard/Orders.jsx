import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrder } from '../../../api/orders.api';
import LoadingModal from '../../../components/LoadingModal';
import OrderModal from './OrderModal';

const Orders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState('');
	const [showProgressOrders, setshowProgressOrders] = useState(false);
	const [progressOrdersMap, setProgressOrdersMap] = useState([]);
	const [unfulText, setUnfulText] = useState('');

	const fetchOrders = async () => {
		setLoading(true);
		try {
			const fetchedOrders = await getAllOrders();
			const activeOrders = fetchedOrders.filter(
				(order) => order.active === true
			);
			setOrders(activeOrders);
			setshowProgressOrders(true);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();
		window.scroll(0, 0);
	}, []);

	const openModal = (orderId) => {
		setShowModal(orderId);
	};

	const closeModal = () => {
		setShowModal('');
		fetchOrders();
	};

	const paidOrders = orders
		.filter((order) => order.status.some((status) => status.type === 'paid'))
		.filter(
			(order) => !order.status.some((status) => status.type === 'shipped')
		)
		.filter((order) => {
			return !unfulText || order.orderId.includes(unfulText);
		})
		.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

	const recentOrders = orders
		.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
		.slice(0, 10); //add 30 day limit

	const shippedOrders = orders
		.filter((order) => order.status.some((status) => status.type === 'paid'))
		.filter((order) => order.status.some((status) => status.type === 'shipped'))
		.filter(
			(order) => !order.status.some((status) => status.type === 'delivered')
		)
		.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

	const pastOrders = orders
		.filter((order) =>
			order.status.some((status) => status.type === 'delivered')
		)
		.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

	const progressOrders = orders
		.filter((order) =>
			order.status.some((status) => status.type === 'crafting')
		)
		.filter(
			(order) => !order.status.some((status) => status.type === 'shipped')
		)
		.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

	useEffect(() => {
		if (showProgressOrders) {
			setProgressOrdersMap(progressOrders);
		} else {
			setProgressOrdersMap(recentOrders);
		}
	}, [showProgressOrders]);

	return (
		<>
			<LoadingModal loading={loading} />
			<div className='mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4'>
				<div className='border-4 w-full border-primary p-4 rounded-md'>
					<div className='flex w-full justify-between items-center border-b-4 pb-3 mb-2'>
						<div>
							<h5 className='text-lg'>
								Unfulfilled Orders - {paidOrders.length}
							</h5>
							<p className='text-xs'>
								{paidOrders.length} orders need to be shipped
							</p>
						</div>
						<div className='flex justify-end'>
							{/* <button className='btn-outline p-2'>View All</button> */}
							<input
								type='text'
								name='unfulText'
								className='input py-2 lg:w-[50%] lg:focus:w-full transform duration-500'
								placeholder='Search...'
								onChange={(e) => setUnfulText(e.target.value)}
							/>
						</div>
					</div>
					<div className='overflow-y-auto max-h-96'>
						<table className='w-full'>
							<thead className='sticky top-0 bg-gray-100 z-10'>
								<tr className='font-bold border-b-4 border-primary px-1'>
									<th className='py-2 text-left'>Order # / Email</th>
									<th className='text-center'>Date / # Items</th>
									<th className='py-2 text-right'>Price / Status</th>
								</tr>
							</thead>
							<tbody>
								{paidOrders.map((order, i) => (
									<tr
										onClick={() => openModal(order)}
										key={i}
										className={`border-b-2 border-primary cursor-pointer ${
											order.status[order.status.length - 1].type === 'paid'
												? 'bg-green-200'
												: order.status[order.status.length - 1].type ===
												  'payment_failed'
												? 'bg-red-300'
												: 'bg-orange-300'
										}`}
									>
										<td className='py-2 pl-2'>
											<div className='flex flex-col'>
												<div>{order.orderId}</div>
												<div>{order.email}</div>
											</div>
										</td>
										<td className='text-center'>
											<div className='py-2'>
												<div className='flex flex-col'>
													<div>
														{new Date(order.createdAt).toLocaleString(
															undefined,
															{
																year: 'numeric',
																month: 'numeric',
																day: 'numeric',
																// hour: 'numeric',
																// minute: 'numeric',
																// hour12: true,
															}
														)}
													</div>
													<div>{order.items.length} item(s)</div>
												</div>
											</div>
										</td>
										<td className='py-2 pr-2'>
											<div className='flex flex-col items-end'>
												<div>
													$
													{order.prices.total
														? (order.prices.total / 100).toFixed(2)
														: '0.00'}
												</div>
												<div>
													{order.status[
														order.status.length - 1
													].type.toUpperCase()}
												</div>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
				{/* IN PROGRESS ORDER / RECENT SALES */}
				<div className='border-4 w-full border-primary p-4 rounded-md'>
					<div className='flex w-full justify-between items-center border-b-4 pb-3 mb-2'>
						<div>
							<h5 className='text-lg'>
								{showProgressOrders ? 'In Progress' : 'Recent Orders'}
							</h5>
							<p className='text-xs'>
								{showProgressOrders
									? progressOrders.length + ' currently in progress'
									: `you made ${orders.length} sales this month`}
							</p>
						</div>
						<div>
							<button
								className='btn-outline p-2'
								onClick={() => setshowProgressOrders(!showProgressOrders)}
							>
								{!showProgressOrders ? 'In Progress' : 'Recent Orders'}
							</button>
						</div>
					</div>
					<div className='overflow-y-auto max-h-96'>
						<table className='w-full'>
							<thead className='sticky top-0 bg-gray-100 z-10'>
								<tr className='font-bold border-b-4 border-primary'>
									<th className='py-2 text-left'>Order # / Email</th>
									<th className='text-center'>Date / # Items</th>
									<th className='py-2 text-right'>Price / Status</th>
								</tr>
							</thead>
							<tbody>
								{progressOrdersMap.map((order, i) => (
									<tr
										key={i}
										className={`border-b-2 border-primary ${
											order.status[order.status.length - 1].type === 'crafting'
												? 'bg-orange-300'
												: order.status[order.status.length - 1].type === 'paid'
												? 'bg-green-300'
												: order.status[order.status.length - 1].type ===
												  'shipped'
												? 'bg-blue-200'
												: order.status[order.status.length - 1].type ===
												  'delivered'
												? 'bg-gray-200'
												: null
										}`}
									>
										<td className='py-2 pl-1'>
											<div className='flex flex-col'>
												<div>{order.orderId}</div>
												<div>{order.email}</div>
											</div>
										</td>
										<td className='text-center'>
											<div className='py-2'>
												<div className='flex flex-col'>
													<div>
														{new Date(order.createdAt).toLocaleString(
															undefined,
															{
																year: 'numeric',
																month: 'numeric',
																day: 'numeric',
																// hour: 'numeric',
																// minute: 'numeric',
																// hour12: true,
															}
														)}
													</div>
													<div>{order.items.length} item(s)</div>
												</div>
											</div>
										</td>
										<td className='py-2 pr-1'>
											<div className='flex flex-col items-end'>
												<div>${(order.prices.total / 100).toFixed(2)}</div>
												<div>
													{order.status[
														order.status.length - 1
													].type.toUpperCase()}
												</div>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
				{/* SHIPPED ORDERS */}
				<div className='border-4 w-full border-primary p-4 rounded-md'>
					<div className='flex w-full justify-between items-center border-b-4 pb-3 mb-2'>
						<div>
							<h5 className='text-lg'>Shipped</h5>
							<p className='text-xs'>{shippedOrders.length} order(s) shipped</p>
						</div>
						<div>
							<button className='btn-outline p-2'>View All</button>
						</div>
					</div>
					<div className='overflow-y-auto max-h-96'>
						<table className='w-full'>
							<thead className='sticky top-0 bg-gray-100 z-10'>
								<tr className='font-bold border-b-4 border-primary'>
									<th className='py-2 text-left'>Order # / Email</th>
									<th className='text-center'>Date / # Items</th>
									<th className='py-2 text-right'>Price / Status</th>
								</tr>
							</thead>
							<tbody>
								{shippedOrders.map((order, i) => (
									<tr
										key={i}
										className={`border-b-2 border-primary bg-blue-200`}
									>
										<td className='py-2 pl-1'>
											<div className='flex flex-col'>
												<div>{order.orderId}</div>
												<div>{order.email}</div>
											</div>
										</td>
										<td className='text-center'>
											<div className='py-2'>
												<div className='flex flex-col'>
													<div>
														{new Date(order.createdAt).toLocaleString(
															undefined,
															{
																year: 'numeric',
																month: 'numeric',
																day: 'numeric',
																// hour: 'numeric',
																// minute: 'numeric',
																// hour12: true,
															}
														)}
													</div>
													<div>{order.items.length} item(s)</div>
												</div>
											</div>
										</td>
										<td className='py-2 pr-1'>
											<div className='flex flex-col items-end'>
												<div>${(order.prices.total / 100).toFixed(2)}</div>
												<div>
													{order.status[
														order.status.length - 1
													].type.toUpperCase()}
												</div>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
				{/* PAST/DELIVERED ORDERS */}
				<div className='border-4 w-full border-primary p-4 rounded-md'>
					<div className='flex w-full justify-between items-center border-b-4 pb-3 mb-2'>
						<div>
							<h5 className='text-lg'>Past Orders</h5>
							<p className='text-xs'>
								{pastOrders.length} order(s) delivered in last year
							</p>
						</div>
						<div>
							<button className='btn-outline p-2'>View All</button>
						</div>
					</div>
					<table className='w-full'>
						<thead className='sticky top-0 bg-gray-100 z-10'>
							<tr className='font-bold border-b-4 border-primary'>
								<th className='py-2 text-left'>Order # / Email</th>
								<th className='text-center'>Date / # Items</th>
								<th className='py-2 text-right'>Price / Status</th>
							</tr>
						</thead>
						<tbody>
							{pastOrders.map((order, i) => (
								<tr key={i} className={`border-b-2 border-primary bg-gray-200`}>
									<td className='py-2 pl-1'>
										<div className='flex flex-col'>
											<div>{order.orderId}</div>
											<div>{order.email}</div>
										</div>
									</td>
									<td className='text-center'>
										<div className='py-2'>
											<div className='flex flex-col'>
												<div>
													{new Date(order.createdAt).toLocaleString(undefined, {
														year: 'numeric',
														month: 'numeric',
														day: 'numeric',
														// hour: 'numeric',
														// minute: 'numeric',
														// hour12: true,
													})}
												</div>
												<div>{order.items.length} item(s)</div>
											</div>
										</div>
									</td>
									<td className='py-2 pr-2'>
										<div className='flex flex-col items-end'>
											<div>${(order.prices.total / 100).toFixed(2)}</div>
											<div>
												{order.status[
													order.status.length - 1
												].type.toUpperCase()}
											</div>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			{showModal && <OrderModal order={showModal} onClose={closeModal} />}
		</>
	);
};

export default Orders;
