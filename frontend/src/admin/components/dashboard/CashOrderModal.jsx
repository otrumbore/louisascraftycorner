import React, { useEffect, useState } from 'react';
import { MdClose, MdOutlinePhoneBluetoothSpeaker } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { createOrder } from '../../../api/orders.api';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { getProductStoreIds } from '../../../api/products.api';

const CashOrderModal = ({ onClose }) => {
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState('');
	const [items, setItems] = useState([]);
	const [email, setEmail] = useState('');
	const [price, setPrice] = useState('');
	const [tax, setTax] = useState('');
	const [itemsText, setItemsText] = useState('');
	const [storeIds, setStoreIds] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [suggestions, setSuggestions] = useState([]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		switch (name) {
			case 'name':
				setName(value);
				break;
			case 'email':
				setEmail(value);
				break;
			case 'itemsText':
				setItemsText(value);
				setSuggestions(
					storeIds.filter((item) => item.storeId.toString().includes(value))
				);
				setShowSuggestions(true);
				break;
			case 'price':
				setPrice(value);
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		fetchStoreIds();
	}, []);

	const fetchStoreIds = async () => {
		try {
			const data = await getProductStoreIds();
			setStoreIds(data);
		} catch (error) {
			console.log(error);
		}
	};

	const addItem = () => {
		if (!items.some((item) => item.storeId === itemsText)) {
			if (!storeIds.some((item) => item.storeId === itemsText)) {
				enqueueSnackbar(`Product does not exist in products!`, {
					variant: 'error',
				});
				return;
			}
			let quantity = window.prompt(`Enter quantity for ${itemsText}:`);
			if (
				quantity !== null &&
				!isNaN(quantity) &&
				quantity !== '' &&
				parseInt(quantity) > 0
			) {
				let pricePer = window.prompt(`Enter the price paid per item:`);
				pricePer = pricePer.trim();
				if (
					pricePer !== null &&
					!isNaN(pricePer) &&
					pricePer !== '' &&
					parseInt(pricePer) > 0
				) {
					const productName = storeIds.find(
						(product) => product.storeId === parseInt(itemsText)
					)?.name;

					const totalCalc =
						parseFloat(price || 0) + parseFloat(pricePer) * parseInt(quantity);

					setPrice(totalCalc);

					setItems((prevItems) => [
						...prevItems,
						{
							storeId: itemsText,
							qty: parseInt(quantity),
							price: parseFloat(pricePer),
							name: productName || 'N/A',
						},
					]);
					setItemsText('');
				} else {
					enqueueSnackbar(`Price needs to be a valid number greater than $1.`, {
						variant: 'error',
					});
				}
			} else {
				enqueueSnackbar(`Item needs a quantity greater than 1.`, {
					variant: 'error',
				});
			}
		} else {
			enqueueSnackbar(`Item already added!`, {
				variant: 'error',
			});
		}
	};

	const sendNewOrder = async () => {
		const newTotal = parseFloat(price) * 100;
		setLoading(true);
		try {
			const data = {
				cartItems: items,
				userDetails: { name: name.trim(), email: email.trim() },
				other: { source: 'retail' },
				prices: { total: newTotal },
			};
			const response = createOrder(data);
			enqueueSnackbar(`Cash order has been created!`, {
				variant: 'success',
			});
			console.log(response);
			onClose();
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

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
					<h4 className='flex justify-center text-xl'>Cash Order</h4>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
						<input
							className='input py-2'
							placeholder='Name'
							name='name'
							value={name}
							required
							onChange={handleChange}
						/>
						<input
							className='input py-2'
							placeholder='Email'
							name='email'
							value={email}
							onChange={handleChange}
						/>
						<div className='relative col-span-2'>
							<input
								className='input py-2'
								type='number'
								placeholder='Store ID'
								name='itemsText'
								value={itemsText}
								onChange={handleChange}
								onBlur={() => {
									setTimeout(() => setShowSuggestions(false), 200);
								}}
							/>
							{showSuggestions && itemsText.length > 1 && (
								<div className='absolute w-full border-4 border-t-0 -mt-2 grid grid-cols-1 gap-y-2 p-4 border-primary z-10 bg-gray-100 rounded-md'>
									{suggestions.map((suggestedItem) => (
										<div
											key={suggestedItem.storeId}
											className='text-primary border-b-2 border-primary w-fit cursor-pointer'
											onClick={() => {
												setItemsText(suggestedItem.storeId);
												setShowSuggestions(false);
											}}
										>
											{suggestedItem.storeId + ' - ' + suggestedItem.name}
										</div>
									))}
								</div>
							)}
							{itemsText && (
								<>
									<IoMdCheckmarkCircleOutline
										onClick={addItem}
										className='absolute top-2 right-2 text-4xl text-green-600 z-10 cursor-pointer'
									/>
									<MdClose
										onClick={() => {
											setItemsText('');
										}}
										className='absolute top-2 right-10 text-4xl text-red-600 z-10 cursor-pointer'
									/>
								</>
							)}
						</div>
						{items.length > 0 && (
							<div className='flex col-span-2 justify-between items-start'>
								<div>
									<p>Items Purchased:</p>

									{items.map((item, i) => (
										<p key={item.storeId}>
											{i + 1 + ': ' + item.name} - QTY: {item.quantity} @ {' $'}
											{parseFloat(item.price)} each
										</p>
									))}
								</div>
								<button
									className={`btn-outline disabled:hidden`}
									disabled={items.length < 1}
									onClick={() => {
										setItems([]);
										setPrice('');
									}}
								>
									Clear All
								</button>
							</div>
						)}
						<input
							className='hidden input py-2'
							placeholder='Taxes'
							name='tax'
							value={tax}
							onChange={handleChange}
						/>
						<input
							className='input py-2'
							placeholder='Total Paid'
							name='price'
							value={price}
							onChange={handleChange}
						/>
						<button
							className='btn disabled:opacity-25 col-start-2'
							disabled={items.length < 1 || !name || !price}
							onClick={sendNewOrder}
						>
							Create Order
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CashOrderModal;
