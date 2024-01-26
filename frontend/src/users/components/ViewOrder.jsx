import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const ViewOrder = ({ order, setViewOrder }) => {
	useEffect(() => {
		if (order.length === 0) {
			setViewOrder([]);
		}
		window.scroll(0, 0);
	}, [order]);
	return (
		<div className='w-full'>
			<div
				onClick={() => {
					setViewOrder([]);
				}}
				className='btn-outline w-fit px-3 py-1 flex items-center space-x-2 cursor-pointer'
			>
				<FaArrowLeft size={30} />
				<span className='hidden lg:block'>Back</span>
			</div>
			<div className='w-full flex justify-center'>
				<h3 className='text-2xl'>
					Order #{order.orderId} -{' '}
					{order.status.length > 0
						? order.status[order.status.length - 1].type.toUpperCase()
						: 'No Status'}
				</h3>
			</div>
			<div className='bg-white p-4 lg:p-8 rounded-lg shadow-md max-w-xl mx-auto mt-10 border-4 border-primary border-dashed'>
				<div className='grid grid-cols-1 lg:grid-cols-2 mb-4'>
					<div>
						<h1 className='text-2xl font-semibold mb-4'>Order Invoice</h1>

						<div className='mb-4'>
							<span className='text-gray-600'>Order Number:</span>{' '}
							{order.orderId}
						</div>

						<div className='mb-4'>
							<span className='text-gray-600'>Date: </span>
							{new Date(order.createdAt).toLocaleString('en-US', {
								year: 'numeric',
								month: 'numeric',
								day: 'numeric',
								hour: 'numeric',
								minute: 'numeric',
								hour12: true,
							})}
						</div>
					</div>
					<div className='lg:text-right'>
						<strong>Ship To: </strong>
						<p>{order.shipName}</p>
						<p>{order.shipAdd.line1}</p>
						<p>{order.shipAdd.line2 || ''}</p>
						<p className='flex lg:justify-end'>
							{order.shipAdd.city +
								', ' +
								order.shipAdd.state +
								' ' +
								order.shipAdd.postal_code}
						</p>
					</div>
				</div>

				<table className='w-full mb-8 overflow-x-auto'>
					<thead>
						<tr>
							<th className='text-left'>Product</th>
							<th className='text-left'>Quantity</th>
							<th className='text-left'>Price</th>
							<th className='text-left'>Sale</th>
							<th className='text-left'>Total</th>
						</tr>
					</thead>
					<tbody>
						{order.items.map((item, i) => (
							<tr key={order.storeId}>
								<td>{item.productName || 'N/A'}</td>
								<td>{item.quantity}</td>
								<td>${item.price.toFixed(2)}</td>
								<td>${item.sale.toFixed(2) || 'No Sale'}</td>
								<td>
									$
									{(
										item.quantity * (item.sale ? item.sale : item.price)
									).toFixed(2)}
								</td>
							</tr>
						))}
					</tbody>
				</table>

				<div className='flex flex-col'>
					<div className='flex justify-between'>
						<span className='font-semibold'>Discounts:</span>
						<span className='text-xl'>
							${(order.prices.discounts / 100).toFixed(2)}
						</span>
					</div>
					<div className='flex justify-between'>
						<span className='font-semibold'>Subtotal:</span>
						<span className='text-xl'>
							${(order.prices.subtotal / 100).toFixed(2)}
						</span>
					</div>
					<div className='flex justify-between'>
						<span className='font-semibold'>Shipping:</span>
						<span className='text-xl'>
							${(order.prices.shipping / 100).toFixed(2)}
						</span>
					</div>
					<div className='flex justify-between'>
						<span className='font-semibold'>Tax:</span>
						<span className='text-xl'>
							${(order.prices.tax / 100).toFixed(2)}
						</span>
					</div>

					<div className='flex justify-between'>
						<span className='font-bold'>Total:</span>
						<span className='text-xl'>
							${(order.prices.total / 100).toFixed(2)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewOrder;
