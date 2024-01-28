import React, { useEffect, useState } from 'react';
import { BsCashCoin } from 'react-icons/bs';
import { MdRefresh, MdOutlineCancel } from 'react-icons/md';
import LoadingModal from '../../../components/LoadingModal';
import OrderModal from './OrderModal';
import CashOrderModal from './CashOrderModal';

const Orders = ({ apiOrders, fetchOrders }) => {
	const [orders, setOrders] = useState(apiOrders);
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState('');
	const [showCashModal, setShowCashModal] = useState(false);
	const [boxOneOrders, setBoxOneOrders] = useState('unfulfilled');
	const [boxOneOrdersMap, setBoxOneOrdersMap] = useState([]);
	const [boxTwoOrders, setBoxTwoOrders] = useState('shipped');
	const [boxTwoOrdersMap, setBoxTwoOrdersMap] = useState([]);
	const [boxOneText, setBoxOneText] = useState('');
	const [boxTwoText, setBoxTwoText] = useState('');

	const [unfulfilledOrders, setUnfulfilledOrders] = useState([]);
	const [paidOrders, setPaidOrders] = useState([]);
	const [recentOrders, setRecentOrders] = useState([]);
	const [shippedOrders, setShippedOrders] = useState([]);
	const [pastOrders, setPastOrders] = useState([]);
	const [progressOrders, setProgressOrders] = useState([]);

	useEffect(() => {
		fetchOrders();
		window.scroll(0, 0);
	}, []);

	useEffect(() => {
		setOrders(apiOrders);
		filteredData();
		//console.log(apiOrders);
	}, [apiOrders]);

	const openModal = (orderId) => {
		setShowModal(orderId);
	};

	const openCashRegister = () => {
		setShowCashModal(true);
	};

	const closeModal = () => {
		setShowCashModal(false);
		setShowModal('');
		fetchOrders();
	};

	useEffect(() => {
		filteredData();
	}, [boxOneText, boxTwoText]);

	const filteredData = () => {
		const filterUnfulfilledOrders = orders
			.filter((order) => order.status.some((status) => status.type === 'paid'))
			.filter(
				(order) => !order.status.some((status) => status.type === 'shipped')
			)
			.filter((order) => {
				return !boxOneText || order.orderId.toString().includes(boxOneText);
			})
			.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

		const filterPaidOrders = orders
			.filter((order) => order.status.some((status) => status.type === 'paid'))
			.filter(
				(order) => !order.status.some((status) => status.type === 'crafting')
			)
			.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

		const filterRecentOrders = orders
			.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
			.filter((order) => {
				return !boxTwoText || order.orderId.toString().includes(boxTwoText);
			})
			.slice(0, 50); //add 30 day limit

		const filterShippedOrders = orders
			.filter((order) => order.status.some((status) => status.type === 'paid'))
			.filter((order) =>
				order.status.some((status) => status.type === 'shipped')
			)
			.filter(
				(order) => !order.status.some((status) => status.type === 'delivered')
			)
			.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

		const filterPastOrders = orders
			.filter((order) =>
				order.status.some((status) => status.type === 'delivered')
			)
			.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

		const filterProgressOrders = orders
			.filter((order) =>
				order.status.some((status) => status.type === 'crafting')
			)
			.filter(
				(order) => !order.status.some((status) => status.type === 'shipped')
			)
			.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

		setUnfulfilledOrders(filterUnfulfilledOrders);
		setPaidOrders(filterPaidOrders);
		setRecentOrders(filterRecentOrders);
		setShippedOrders(filterShippedOrders);
		setPastOrders(filterPastOrders);
		setProgressOrders(filterProgressOrders);

		if (orders.length > 1) {
			setBoxTwoOrdersMap(filterShippedOrders);
			setBoxOneOrdersMap(filterUnfulfilledOrders);
		}

		if (boxTwoText !== '') {
			setBoxTwoOrders('all');
			setBoxTwoOrdersMap(filterRecentOrders);
		} else {
			setBoxTwoOrders('shipped');
		}
	};

	useEffect(() => {
		if (boxTwoOrders === 'all') {
			setBoxTwoOrdersMap(recentOrders);
		} else if (boxTwoOrders === 'shipped') {
			setBoxTwoOrdersMap(shippedOrders);
		} else {
			setBoxTwoOrdersMap(pastOrders);
		}
	}, [boxTwoOrders]);

	useEffect(() => {
		if (boxOneOrders === 'unfulfilled') {
			setBoxOneOrdersMap(unfulfilledOrders);
		} else if (boxOneOrders === 'crafting') {
			setBoxOneOrdersMap(progressOrders);
		} else {
			setBoxOneOrdersMap(paidOrders);
		}
	}, [boxOneOrders]);

	return (
		<div className='relative'>
			<LoadingModal loading={loading} />

			<div
				className='hidden absolute -left-1 top-16 lg:flex gap-4 w-fit py-2 px-3 -ml-[6.7rem] text-white bg-secondary hover:left-[4.5rem] z-20 transform duration-500 rounded-r-md cursor-pointer'
				onClick={fetchOrders}
			>
				Refresh <MdRefresh className='text-[1.75rem]' />
			</div>
			<div
				className='hidden absolute -left-8 top-28 lg:flex gap-5 w-fit py-2 px-3 -ml-[6.7rem] text-white bg-green-600 hover:left-[4.5rem] z-20 transform duration-500 rounded-r-md cursor-pointer'
				onClick={openCashRegister}
			>
				Cash Order
				<BsCashCoin className='text-2xl' />
			</div>

			{/* PAID / CRAFTING / BOTH */}
			<div className='mt-4 grid grid-cols-1 gap-4'>
				<div className='border-4 w-full border-primary p-4 rounded-md'>
					<div className='flex w-full justify-between items-center border-b-4 pb-3 mb-2'>
						<div className='w-1/4'>
							<h5 className='text-lg'>
								{boxOneOrders === 'unfulfilled'
									? 'Unfulfilled'
									: boxOneOrders === 'paid'
									? 'Paid'
									: 'Crafting'}{' '}
								- {boxOneOrdersMap.length}
							</h5>
							<p className='text-xs'>
								{boxOneOrdersMap.length}{' '}
								{boxOneOrders === 'unfulfilled'
									? ' orders need to be shipped'
									: boxOneOrders === 'paid'
									? ' are paid'
									: ' are being crafted'}
							</p>
						</div>
						<div className='w-2/4 flex justify-center'>
							<button
								className={`${
									boxOneOrders === 'unfulfilled' ? 'btn' : 'btn-outline'
								} rounded-none rounded-l-md border-r-transparent hover:ring-0 hover:ring-offset-0`}
								onClick={() => setBoxOneOrders('unfulfilled')}
							>
								Unfulfilled
							</button>
							<button
								className={`${
									boxOneOrders === 'paid' ? 'btn' : 'btn-outline'
								} rounded-none hover:ring-0 hover:ring-offset-0`}
								onClick={() => setBoxOneOrders('paid')}
							>
								Paid
							</button>
							<button
								className={`${
									boxOneOrders === 'crafting' ? 'btn' : 'btn-outline'
								} rounded-none rounded-r-md border-l-transparent hover:ring-0 hover:ring-offset-0`}
								onClick={() => setBoxOneOrders('crafting')}
							>
								Crafting
							</button>
						</div>

						<div className='w-1/4 flex justify-end'>
							{/* <button className='btn-outline p-2'>View All</button> */}
							<input
								type='text'
								name='boxOneText'
								className='input py-2 lg:w-[50%] lg:focus:w-full transform duration-500'
								placeholder='Search...'
								onChange={(e) => setBoxOneText(e.target.value)}
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
								{boxOneOrdersMap.length > 0 ? (
									boxOneOrdersMap.map((order, i) => (
										<tr
											onClick={() => openModal(order)}
											key={i}
											className={`border-b-2 border-primary cursor-pointer hover:bg-primary hover:bg-opacity-50 ${
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
																	hour: 'numeric',
																	minute: 'numeric',
																	hour12: true,
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
														].type.toUpperCase() || 'Something went wrong'}
													</div>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td>
											<h2 className='mt-4 text-2xl'>No Results</h2>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
				{/* SHIPPED / DELIVERED / ALL */}
				<div className='border-4 w-full border-primary p-4 rounded-md'>
					<div className='flex w-full justify-between items-center border-b-4 pb-3 mb-2'>
						<div className='w-1/4'>
							<h5 className='text-lg'>
								{boxTwoOrders === 'all'
									? 'All Orders'
									: boxTwoOrders === 'shipped'
									? 'Shipped'
									: 'Delivered'}
							</h5>
							<p className='text-xs'>
								{boxTwoOrdersMap.length}
								{boxTwoOrders === 'all'
									? ' this month'
									: boxTwoOrders === 'shipped'
									? ' shipped'
									: ' delivered this month'}
							</p>
						</div>
						<div className='w-2/4 flex justify-center'>
							<button
								className={`${
									boxTwoOrders === 'shipped' ? 'btn' : 'btn-outline'
								} rounded-none rounded-l-md border-r-transparent hover:ring-0 hover:ring-offset-0`}
								onClick={() => setBoxTwoOrders('shipped')}
							>
								Shipped
							</button>
							<button
								className={`${
									boxTwoOrders === 'delivered' ? 'btn' : 'btn-outline'
								} rounded-none hover:ring-0 hover:ring-offset-0`}
								onClick={() => setBoxTwoOrders('delivered')}
							>
								Delivered
							</button>
							<button
								className={`${
									boxTwoOrders === 'all' ? 'btn' : 'btn-outline'
								} rounded-none rounded-r-md border-l-transparent hover:ring-0 hover:ring-offset-0`}
								onClick={() => setBoxTwoOrders('all')}
							>
								All
							</button>
						</div>
						<div className='w-1/4 flex justify-end'>
							{/* <button className='btn-outline p-2'>View All</button> */}
							<input
								type='text'
								name='unfulText'
								className='input py-2 lg:w-[50%] lg:focus:w-full transform duration-500'
								placeholder='Search...'
								onChange={(e) => setBoxTwoText(e.target.value)}
							/>
						</div>
					</div>
					<div className='overflow-y-auto h-auto max-h-[75vh]'>
						<table className='w-full h-full'>
							<thead className='sticky top-0 bg-gray-100 z-10'>
								<tr className='font-bold border-b-4 border-primary'>
									<th className='py-2 text-left'>Order # / Email</th>
									<th className='text-center'>Date / # Items</th>
									<th className='text-center'>Tracking #</th>
									<th className='py-2 text-right'>Price / Status</th>
								</tr>
							</thead>
							<tbody>
								{boxTwoOrdersMap.length > 0 ? (
									boxTwoOrdersMap.map((order, i) => (
										<tr
											onClick={() => openModal(order)}
											key={i}
											className={`border-b-2 border-primary cursor-pointer hover:bg-primary hover:bg-opacity-50 ${
												order.status[order.status.length - 1].type ===
												'crafting'
													? 'bg-orange-300'
													: order.status[order.status.length - 1].type ===
													  'paid'
													? 'bg-green-300'
													: order.status[order.status.length - 1].type ===
													  'shipped'
													? 'bg-blue-200'
													: order.status[order.status.length - 1].type ===
													  'delivered'
													? 'bg-gray-200'
													: 'bg-gray-200'
											}`}
										>
											<td className='py-2 pl-1'>
												<div className='flex flex-col'>
													<div>{order.orderId}</div>
													<div>{order.email || 'N/A'}</div>
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
																	hour: 'numeric',
																	minute: 'numeric',
																	hour12: true,
																}
															)}
														</div>
														<div>{order.items.length} item(s)</div>
													</div>
												</div>
											</td>
											<td className='text-center'>
												<div className='py-2'>
													{order.shipping &&
													order.shipping.tracking !== undefined
														? order.shipping.tracking
														: 'N/A'}
												</div>
											</td>
											<td className='py-2 pr-1'>
												<div className='flex flex-col items-end'>
													<div>${(order.prices.total / 100).toFixed(2)}</div>
													<div>
														{order.status[
															order.status.length - 1
														].type.toUpperCase() || 'Something went wrong'}
													</div>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td>
											<h2 className='mt-4 text-2xl'>No Results</h2>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			{showModal && <OrderModal order={showModal} onClose={closeModal} />}
			{showCashModal && <CashOrderModal onClose={closeModal} />}
		</div>
	);
};

export default Orders;
