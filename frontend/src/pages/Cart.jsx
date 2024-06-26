import React, { useEffect, useState } from 'react';
import LoadingModal from '../components/LoadingModal';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import DefaultProductImg from '../assets/product-img/default.png';
import { MdOutlineDeleteForever, MdEdit } from 'react-icons/md';
import { FaRegHeart } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Link, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import createOrder from '../api/orders.api';
import { getProduct } from '../api/products.api';

const Cart = () => {
	const [loading, setLoading] = useState(false);
	const [stripeLoading, setStripeLoading] = useState(false);
	const [cxNotes, setCXNotes] = useState('');
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
	const location = useLocation();

	const { addToFavorites, userFavorites, userDetails, userRole } = useUser();

	const [loggedIn, setLoggedIn] = useState(false);

	const cartItemsCount = cartItems.length;

	let newCart = [];

	const updateCartPrices = async () => {
		setLoading(true);
		try {
			let removedAnItem = false;
			const newCart = await Promise.all(
				cartItems.map(async (item) => {
					const product = await getProduct(item._id);

					if (!product.active || product.archived) {
						removedAnItem = true;
						return null;
					}

					return {
						...item,
						price: product.price,
						sale: product.sale,
					};
				})
			);

			if (removedAnItem) {
				enqueueSnackbar(
					'Some items were removed since they are no longer available',
					{
						variant: 'info',
					}
				);
				removedAnItem = false;
			}
			const filteredCart = newCart.filter((item) => item !== null);
			//newCart = filteredCart;
			updateAllCartItems(filteredCart);
			return filteredCart;
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		//console.log(cartItems);
		document.title = "Cart | Louisa's Custom Crafts";
		if (cartItems.length > 0) {
			updateCartPrices();
		}
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		userDetails._id ? setLoggedIn(true) : setLoggedIn(false);
	}, [userDetails, loggedIn]);

	const preCheckout = async () => {
		setStripeLoading(true);
		try {
			const updatedCart = await updateCartPrices();
			checkout(updatedCart);
		} catch (error) {
			console.log(error);
			enqueueSnackbar(
				'Refresh and try checking out again...Needed to update some prices.',
				{
					variant: 'info',
				}
			);
			setStripeLoading(false);
		}
	};

	const checkout = async (updatedCart) => {
		//setStripeLoading(true);
		try {
			await fetch(`${API_URL}/api/checkout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					items: updatedCart,
					userData: userDetails,
					customer_notes: cxNotes.trim(),
				}),
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
		<div className='p-4 min-h-[65vh] w-full flex flex-col justify-evenly items-center'>
			<div className='flex flex-col w-full justify-center items-center max-w-[1400px]'>
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
									className='border-4 border-primary p-4 rounded-lg mb-4'
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
																{parseFloat(item.price * item.qty).toFixed(2)}
															</p>
															<p className='text-red-600'>
																${parseFloat(item.sale * item.qty).toFixed(2)}
															</p>
														</>
													) : (
														parseFloat(item.price * item.qty).toFixed(2)
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
					<div className='flex flex-col lg:flex-row w-full max-w-[1000px] justify-between'>
						<div className='w-full'>
							<p className='pl-1 font-semibold text-lg'>Notes:</p>
							<textarea
								className='input'
								name='cxNotes'
								value={cxNotes}
								onChange={(e) => setCXNotes(e.target.value)}
								rows={3}
							></textarea>
						</div>
						<div className='flex flex-col w-full justify-center items-end pr-2'>
							<div className='flex w-full items-center justify-end text-right'>
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
								</div>
							</div>

							<div className='mt-4 w-full flex flex-col items-end'>
								<button
									className={`btn py-3 w-full lg:w-[50%] ${
										stripeLoading && 'cursor-not-allowed'
									} disabled:opacity-25`}
									onClick={preCheckout}
									//disabled={userRole() < 2 || stripeLoading}
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
								{/* {userRole() < 2 && (
									<h2 className='mt-8 lg: lg:mt-2 text-xl w-full text-center lg:text-end'>
										Checkout is currently disabled.
									</h2>
								)} */}
							</div>
							<div className='flex lg:justify-end w-full'>
								<p className='mt-4 w-full text-xs text-center lg:text-right'>
									*Sales tax and shipping cost calculated at checkout
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Cart;
