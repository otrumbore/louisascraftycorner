import React, { useEffect, useState } from 'react';
import { getAllOrders } from '../../../api/orders.api';
import LoadingModal from '../../../components/LoadingModal';

const Orders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchOrders = async () => {
		setLoading(true);
		try {
			const fetchedOrders = await getAllOrders();
			const filteredOrders = fetchedOrders.filter(
				(order) => order.active === true
			);
			setOrders(filteredOrders);
			//console.log(fetchedOrders);
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

	const paidOrders = orders
		.filter((order) => order.status.some((status) => status.type === 'paid'))
		.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

	const recentOrders = orders
		.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
		.slice(0, 5);

	return (
		<>
			<LoadingModal loading={loading} />
			<div className='mt-4 flex flex-col lg:flex-row justify-between items-start gap-4'>
				<div className='border-4 w-full border-primary p-4 rounded-md lg:w-[50%]'>
					<div className='flex w-full justify-between items-center border-b-4 pb-3 mb-2'>
						<div>
							<h5 className='text-lg'>
								Unfulfilled Orders - {paidOrders.length}
							</h5>
							<p className='text-xs'>
								{paidOrders.length} orders need to be shipped
							</p>
						</div>
						<div>
							<button className='btn-outline p-2'>View All</button>
						</div>
					</div>

					<table className='w-full'>
						<thead>
							<tr className='font-bold border-b-2'>
								<th className='py-2 text-left'>Order # / Email</th>
								<th className='text-center'>Date / # Items</th>
								<th className='py-2 text-right'>Price / Status</th>
							</tr>
						</thead>
						<tbody>
							{paidOrders.map((order, i) => (
								<tr key={i} className='border-b'>
									<td className='py-2'>
										<div className='flex flex-col'>
											<div>{order.orderId}</div>
											<div>{order.email}</div>
										</div>
									</td>
									<td className='text-center'>
										{new Date(order.createdAt).toLocaleString(undefined, {
											year: 'numeric',
											month: 'numeric',
											day: 'numeric',
											// hour: 'numeric',
											// minute: 'numeric',
											// hour12: true,
										})}
									</td>
									<td className='py-2'>
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

				<div className='border-4 w-full border-primary p-4 rounded-md lg:w-[50%]'>
					<div className='flex w-full justify-between items-center border-b-4 pb-3 mb-2'>
						<div>
							<h5 className='text-lg'>Recent Sales</h5>
							<p className='text-xs'>
								you made {orders.length} sales this month
							</p>
						</div>
						<div>
							<button className='btn-outline p-2'>View All</button>
						</div>
					</div>
					<table className='w-full'>
						<thead>
							<tr className='font-bold border-b-2'>
								<th className='py-2 text-left'>Order # / Email</th>
								<th className='text-center'>Date / # Items</th>
								<th className='py-2 text-right'>Price / Status</th>
							</tr>
						</thead>
						<tbody>
							{recentOrders.map((order, i) => (
								<tr key={i} className='border-b'>
									<td className='py-2'>
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
									<td className='py-2'>
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
		</>
	);
};

export default Orders;
