import React, { useEffect, useState } from 'react';
import LoadingModal from '../components/LoadingModal';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import DefaultProductImg from '../assets/product-img/default.png';
import { MdOutlineDeleteForever, MdEdit } from 'react-icons/md';
import { FaRegHeart } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import createOrder from '../api/orders.api';
import { getProduct } from '../api/products.api';

const Cart = () => {
	const [loading, setLoading] = useState(false);
	const [stripeLoading, setStripeLoading] = useState(false);
	const { enqueueSnackbar } = useSnackbar();
	const API_URL = import.meta.env.VITE_SERVER_API_URL;
	//cart stuff
	const {
		cartItems,
		addToCart,
		removeFromCart,
		clearCart,
		cartTotal,
		cartSalesTotal,
		cartSubTotal,
		updateAllCartItems,
	} = useCart();

	const { addToFavorites, userFavorites, userDetails, userRole } = useUser();

	const [loggedIn, setLoggedIn] = useState(false);

	const cartItemsCount = cartItems.length;

	const updateCartPrices = async () => {
		setLoading(true);
		try {
			const newCart = await Promise.all(
				cartItems.map(async (item) => {
					const product = await getProduct(item._id);
					return {
						...item,
						price: product.price, // Update the price in the cart item
						sale: product.sale,
					};
				})
			);

			// localStorage.setItem('cartItems', JSON.stringify(newCart));
			// localStorage.setItem('lastUpdatedTime', Date.now());

			updateAllCartItems(newCart);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		//console.log(cartItems);
		updateCartPrices();
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		userDetails._id ? setLoggedIn(true) : setLoggedIn(false);
	}, [userDetails, loggedIn]);

	const checkout = async () => {
		setStripeLoading(true);
		try {
			await fetch(`${API_URL}/api/checkout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ items: cartItems, userData: userDetails }),
			})
				.then((response) => {
					return response.json();
				})
				.then((response) => {
					if (response.url) {
						window.location.assign(response.url);
					}
				});
		} catch (error) {
			console.log(error);
		} finally {
			setStripeLoading(false);
		}
	};

	return (
		<>
			<div className='p-4 mt-[8rem] min-h-[60vh] lg:mt-[10rem]'>
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
									className='border-2 border-primary p-4 rounded-lg mb-4'
									key={i}
								>
									<div className='flex items-center'>
										<Link to={`/product/${item._id}`}>
											<div className='flex h-[100px] w-[100px] items-center justify-center'>
												<img
													src={item.image ? item.image : DefaultProductImg}
													alt={
														item.image
															? item.name + 'Product Image'
															: 'Default Product Image'
													}
													onError={(e) => {
														e.target.src = DefaultProductImg; // Fallback to default image on error
														e.target.alt = 'Default Product Image';
													}}
													className='object-cover border-2 border-slate-300 h-full w-full rounded-md'
												/>
											</div>
										</Link>
										<div className='flex flex-col w-full items-center justify-between lg:gap-y-4'>
											<div className='pl-4 flex flex-col gap-y-2 lg:flex-row w-full justify-between'>
												<Link to={`/product/${item._id}`}>
													<div className='font-bold text-lg'>
														{item.name + ' - '}
														{item.type &&
															item.type.charAt(0).toUpperCase() +
																item.type.slice(1)}
													</div>
												</Link>
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

												<div className='flex justify-end gap-2'>
													<button
														onClick={() => {
															removeFromCart(item._id);
															enqueueSnackbar(
																'Deleted ' + item.name + ' from cart',
																{
																	variant: 'success',
																}
															);
														}}
														className='btn-ghost text-red-600 hover:text-white p-2'
													>
														<MdOutlineDeleteForever className=' text-2xl lg:text-3xl' />
													</button>
													<button
														onClick={() => {
															if (!loggedIn) {
																enqueueSnackbar(
																	'Login first to add to favorites',
																	{
																		variant: 'warning',
																	}
																);
																return;
															}
															if (
																!userFavorites.some(
																	(faveItem) => faveItem.itemId === item.storeId
																)
															) {
																addToFavorites(item.storeId);
																removeFromCart(item._id);
																enqueueSnackbar(
																	'Moved ' + item.name + ' to favorites',
																	{
																		variant: 'sucess',
																	}
																);
															} else {
																//removeFromFavorites(product.storeId);

																enqueueSnackbar(
																	'Already have ' + item.name + ' in favorites',
																	{
																		variant: 'info',
																	}
																);
															}
														}}
														className='flex items-center px-2 py-1 btn-outline '
													>
														<FaRegHeart className='text-xl lg:text-2xl' />
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
							<div className='mt-2 flex flex-col'>
								<p>Subtotal: ${cartSubTotal().toFixed(2)}</p>
								{cartSalesTotal() > 0 && (
									<div className='flex w-full text-lg items-center justify-end gap-x-1'>
										<p>Total Savings:</p>
										<p className='text-red-600'>
											-${cartSalesTotal().toFixed(2)}
										</p>
									</div>
								)}

								<div className='mt-2 flex w-full items-start justify-end'>
									<em className='text-md'>*</em>
									<p className='font-bold text-2xl'>
										Total: ${cartTotal().toFixed(2)}
									</p>
								</div>
								<div className='mt-4'>
									<button
										className={`btn py-3 w-full ${
											stripeLoading && 'cursor-not-allowed'
										}`}
										onClick={checkout}
										disabled={userRole() < 2 || stripeLoading}
									>
										{stripeLoading ? (
											<span className='flex gap-2'>
												<AiOutlineLoading3Quarters className='animate-spin h-5 w-5' />
												Processing...
											</span>
										) : (
											'Checkout'
										)}
									</button>
									{userRole() < 2 && (
										<h2 className='text-xl'>Checkout is disabled currently!</h2>
									)}
								</div>
							</div>
						</div>
						<div className='flex w-full max-w-[1000px]'>
							<p className='mt-4 w-full text-xs text-left'>
								*Sales tax and shipping cost calculated at checkout
							</p>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Cart;
