import React, { useEffect, useState } from 'react';
import LoadingModal from '../components/LoadingModal';
import { useCart } from '../context/CartContext';
import DefaultProductImg from '../assets/product-img/default.png';
import SantaHat from '../assets/product-img/santa-hat-ordiment.png';
import { MdOutlineDeleteForever, MdEdit } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const Cart = () => {
	const [loading, setLoading] = useState(false);
	const { enqueueSnackbar } = useSnackbar();
	//cart stuff
	const {
		cartItems,
		addToCart,
		removeFromCart,
		clearCart,
		cartTotal,
		cartSalesTotal,
		cartSubTotal,
	} = useCart();

	const cartItemsCount = cartItems.length;

	useEffect(() => {
		console.log(cartItems);
		window.scrollTo(0, 0);
	}, [cartItems]);

	const checkout = async () => {
		await fetch('http://10.0.0.85:5555/checkout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ items: cartItems }),
		})
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				if (response.url) {
					window.location.assign(response.url);
				}
			});
	};

	return (
		<>
			<div className='p-4 mt-[8rem] h-full lg:mt-[10rem]'>
				<LoadingModal loading={loading} />
				<div className='flex justify-center'>
					<h1 className='text-2xl'>Shopping Cart</h1>
				</div>
				<div className='flex mt-8 w-full items-center justify-center'>
					<div className='flex flex-col w-full max-w-[1000px]'>
						{cartItemsCount <= 0 ? (
							<div className='text-center'>Cart is empty</div>
						) : (
							cartItems.map((item, i) => (
								<div
									className='border-2 border-slate-400 p-4 rounded-lg mb-4'
									key={i}
								>
									<div className='flex items-center'>
										<div className='flex h-[100px] w-[100px] items-center justify-center'>
											<img
												src={
													item.img === '' || item.img === undefined
														? DefaultProductImg
														: item.img === 'santaHat' && SantaHat
												}
												alt={item.name + ' image'}
												className='object-cover border-2 border-slate-300 h-full w-full rounded-md'
											/>
										</div>
										<div className='flex flex-col w-full items-center justify-between lg:gap-y-4'>
											<div className='pl-4 flex flex-col gap-y-2 lg:flex-row w-full justify-between'>
												<div className='font-bold text-lg'>
													{item.name} -{' '}
													{item.type &&
														item.type.charAt(0).toUpperCase() +
															item.type.slice(1)}
												</div>
												<div className='flex lg:text-xl'>
													$
													{item.sale > 0 ? (
														<>
															<p className='line-through mr-2'>
																{item.price * item.qty}
															</p>
															<p className='text-red-600'>
																${item.sale * item.qty}
															</p>
														</>
													) : (
														item.price * item.qty
													)}
												</div>
											</div>
											<div className='pl-4 mt-2 flex flex-row w-full items-center justify-between'>
												<div className='flex gap-x-2 items-center'>
													<p className='lg:text-lg'>QTY: {item.qty}</p>
													<Link to={`/product/${item._id}`}>
														<MdEdit className='text-blue-400 text-2xl' />
													</Link>
												</div>

												<div className='flex gap-x-6 lg:gap-x-4 items-center justify-center'>
													<button
														onClick={() => {
															removeFromCart(item._id);
															enqueueSnackbar(
																'Deleted ' + item.name + ' from cart',
																{
																	variant: 'success',
																	anchorOrigin: {
																		horizontal: 'center',
																		vertical: 'top',
																	},
																	autoHideDuration: 2000,
																}
															);
														}}
													>
														<MdOutlineDeleteForever className='text-red-600 text-2xl lg:text-3xl' />
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>
				{cartItemsCount > 0 && (
					<div className='flex flex-col w-full items-center justify-center pr-2'>
						<div className='flex w-full max-w-[1000px] items-center justify-end text-right'>
							<div className='flex flex-col'>
								<p>Subtotal: ${cartSubTotal().toFixed(2)}</p>
								{cartSalesTotal() > 0 && (
									<div className='flex w-full text-lg items-center justify-end gap-x-1'>
										<p>Total Savings:</p>
										<p className='text-red-600'>
											-${cartSalesTotal().toFixed(2)}
										</p>
									</div>
								)}

								<div className='flex w-full items-start justify-end'>
									<em className='text-md'>*</em>
									<p className='font-bold text-xl'>
										Total: ${cartTotal().toFixed(2)}
									</p>
								</div>
								<div className='mt-4'>
									<button
										className='flex items-center justify-center border-4 py-2 text-xl border-slate-400 bg-slate-300 hover:bg-slate-400 hover:border-slate-500 hover:text-white hover:shadow-lg hover:shadow-slate-400 transition-all duration-100 rounded-md w-full'
										onClick={checkout}
									>
										Checkout
									</button>
								</div>
							</div>
						</div>
						<div className='flex w-full max-w-[1000px]'>
							<p className='mt-4 w-full text-xs text-left'>
								*Sales tax calculated at checkout
							</p>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Cart;
