import React, { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useUser } from '../../../context/UserContext';
import { updateOrder } from '../../../api/orders.api';

const OrderModal = ({ order, onClose }) => {
	const { userRole } = useUser();
	const [loading, setLoading] = useState(false);
	const [orderDetails, setOrderDetails] = useState(order);
	const { enqueueSnackbar } = useSnackbar();

	const showShippingTrackingInput = () => {
		// Use window.prompt to display a dialog box with an input field
		const userInput = window.prompt(
			'Enter a tracking number for shipping:',
			''
		);
		// Check if the user clicked "OK" and entered some text
		if (userInput !== null) {
			sendStatusUpdate('shipped', userInput.trim());
		} else {
			enqueueSnackbar(`Cancelled, not marked shipped.`, {
				variant: 'info',
			});
		}
	};

	const sendStatusUpdate = async (status, tracking) => {
		setLoading(true);
		try {
			const data = order;
			data.status.push({ type: status, timestamp: new Date() });
			if (tracking !== '') {
				data.shipping.tracking = tracking;
			}
			console.log(data);
			const update = await updateOrder(orderDetails.orderId, data);
			setOrderDetails(data);
			enqueueSnackbar(
				`Updated order number ${order.orderId} with status ${status}`,
				{
					variant: 'success',
				}
			);
		} catch (error) {
			console.log(error);
			enqueueSnackbar(`Could not update order. Try again!`, {
				variant: 'error',
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		//console.log(order);
	}, []);

	return (
		<div
			className='fixed inset-0 overflow-y-auto bg-primary bg-opacity-20 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center cursor-auto'
			onClick={onClose}
		>
			<div
				onClick={(event) => event.stopPropagation()}
				className='w-[600px] max-w-full max-h-[80vh] bg-gray-100 rounded-xl p-4 flex flex-col relative'
			>
				<MdClose
					className='absolute right-4 top-4 text-3xl text-red-600 cursor-pointer'
					onClick={onClose}
				/>
				<div className='mt-4 w-full p-4 rounded-md space-y-2'>
					<h4 className='flex justify-center text-xl'>
						Order #{orderDetails.orderId} -{' '}
						{orderDetails.status[order.status.length - 1].type.toUpperCase()}
					</h4>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-y-4'>
						<div className='flex flex-col gap-2'>
							<div>
								<strong>Ship to Name:</strong>
								<p>{order.shipName}</p>
							</div>
							<div>
								<strong>Shipping Address:</strong>
								<p>{order.shipAdd.line1}</p>
								<p>{order.shipAdd.line2}</p>
								<p>
									{order.shipAdd.city}, {order.shipAdd.state}{' '}
									{order.shipAdd.postal_code}
								</p>
							</div>
						</div>
						<div className='flex justify-center'>
							<div>
								<strong>Prices:</strong>
								<p>
									Subtotal:{' '}
									{(order.prices.subtotal / 100).toLocaleString('en-US', {
										style: 'currency',
										currency: 'USD',
									})}
								</p>
								<p>
									Discounts:{' '}
									{(order.prices.discounts / 100).toLocaleString('en-US', {
										style: 'currency',
										currency: 'USD',
									})}
								</p>
								<p>
									Shipping:{' '}
									{(order.prices.shipping / 100).toLocaleString('en-US', {
										style: 'currency',
										currency: 'USD',
									})}
								</p>
								<p>
									Tax:{' '}
									{(order.prices.tax / 100).toLocaleString('en-US', {
										style: 'currency',
										currency: 'USD',
									})}
								</p>
								<p>
									<strong>Total: </strong>
									{(order.prices.total / 100).toLocaleString('en-US', {
										style: 'currency',
										currency: 'USD',
									})}
								</p>
							</div>
						</div>
						<div className='flex flex-col'>
							<strong>Items Purchased:</strong>
							{order.items.map((item, i) => (
								<p key={i}>
									{i + 1 + ': '}
									{(item.productName || 'N/A') + ' - ' + item.storeId} - QTY:{' '}
									{item.quantity}
								</p>
							))}
						</div>
					</div>
					<div>
						<p>
							<strong>Shipping Carrier:</strong> {order.shipping.carrier}
						</p>
						<p>
							<strong>Tracking # </strong>
							{order.shipping.tracking ? (
								<a
									className='underline text-primary'
									target={'_blank'}
									href={`https://tools.usps.com/go/TrackConfirmAction?tRef=fullpage&tLc=2&text28777=&tLabels=${order.shipping.tracking}`}
								>
									{order.shipping.tracking}
								</a>
							) : (
								'N/A'
							)}
						</p>
					</div>
					<div>
						<strong>Customer Notes:</strong>
						<p>{order.customerNotes || 'None'}</p>
					</div>
					<div className='flex gap-2 justify-end'>
						{!orderDetails.status.some(
							(status) => status.type === 'crafting'
						) ? (
							<button
								className='btn'
								onClick={() => sendStatusUpdate('crafting')}
							>
								Crafting?
							</button>
						) : !orderDetails.status.some(
								(status) => status.type === 'shipped'
						  ) ? (
							<button
								className='btn'
								onClick={() => showShippingTrackingInput()}
							>
								Shipped?
							</button>
						) : !orderDetails.status.some(
								(status) => status.type === 'delivered'
						  ) ? (
							<button
								className='btn'
								onClick={() => sendStatusUpdate('delivered')}
							>
								Delivered?
							</button>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderModal;
