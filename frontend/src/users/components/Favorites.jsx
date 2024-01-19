import React, { useEffect, useState } from 'react';
import DefaultProductImg from '../../assets/product-img/default.png';
import { Link, useNavigate } from 'react-router-dom';
import {
	MdOutlineDeleteForever,
	MdOutlineUpdateDisabled,
	MdAddShoppingCart,
} from 'react-icons/md';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import LoadingModal from '../../components/LoadingModal';

import SantaHat from '../../assets/product-img/santa-hat-ordiment.png';
import { useSnackbar } from 'notistack';
import { useCart } from '../../context/CartContext';

const Favorites = () => {
	const API_URL = import.meta.env.VITE_SERVER_API_URL;
	const navigate = useNavigate();
	const { userFavorites, userDetails, removeFromFavorites } = useUser();
	const [favorites, setFavorites] = useState([]);
	const [loading, setLoading] = useState(true);
	const { enqueueSnackbar } = useSnackbar();
	const { cartItems, addToCart } = useCart();

	const getProducts = async () => {
		setLoading(true);
		try {
			if (userDetails) {
				console.log(userFavorites);
				const favoriteProductsPromises = userFavorites.map(async (item) => {
					try {
						const favoriteProducts = await axios.get(
							`${API_URL}/api/user/favorites/product/${item.itemId}`
						);
						return favoriteProducts.data;
					} catch (error) {
						console.error('Error fetching favorite product:', error);
						return { data: { name: 'deleted', storeId: item.itemId } };
					}
				});

				const favoriteProductsData = await Promise.all(
					favoriteProductsPromises
				);
				setFavorites(favoriteProductsData);
			} else {
				navigate('/user/dashboard#orders');
			}
		} catch (error) {
			console.error('Error fetching user details or favorites:', error);
			enqueueSnackbar('Could not load favorites...Try again later!', {
				variant: 'error',
			});
			navigate('/user/dashboard#orders');
		}
	};

	useEffect(() => {
		favorites.length <= 0 && getProducts();
	}, []);

	useEffect(() => {
		if (userFavorites.length !== favorites.length) {
			getProducts();
			console.log(favorites);
			//console.log(userFavorites);
		} else {
			setLoading(false);
		}
	}, [favorites, userFavorites]);
	return (
		<>
			<LoadingModal loading={loading} />
			<div className='w-full'>
				<div className='flex w-full justify-center items-center'>
					<h3 className='text-2xl lg:text-3xl'>Your Favorites</h3>
				</div>
				{userFavorites.length <= 0 ? (
					<div className='mt-8 text-center'>No favorites added yet. </div>
				) : (
					<div className='mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4'>
						{favorites.length > 0 &&
							favorites.map((item, i) => (
								<div
									className='border-2 border-primary p-4 rounded-lg mb-4'
									key={i}
								>
									{item.data.name === 'deleted' ? (
										<div className='flex h-full items-center p-4'>
											<h4 className='text-2xl'>Item no longer for sale</h4>
											<button
												onClick={() => {
													removeFromFavorites(item.data.storeId);
													//getProducts();
													enqueueSnackbar(
														'Deleted ' + item.data.storeId + ' from favorites',
														{
															variant: 'success',
														}
													);
												}}
												className='btn-ghost text-red-600 hover:text-white p-2'
											>
												<MdOutlineDeleteForever className='text-3xl lg:text-4xl' />
											</button>
										</div>
									) : (
										<div className='flex items-center'>
											<Link to={`/product/${item.data._id}`}>
												<div className='flex h-[100px] w-[100px] items-center justify-center'>
													<img
														src={
															item.data.image
																? item.data.image
																: DefaultProductImg
														}
														alt={
															item.data.image
																? item.data.name + 'Product Image'
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
											<div className='flex flex-col w-full items-center'>
												<div className='pl-4 flex flex-col gap-y-1 w-full'>
													<Link to={`/product/${item.data._id}`}>
														<div className='flex flex-wrap font-bold text-lg'>
															{item.data.name ? `${item.data.name} - ` : ''}
															{item.data.type
																? item.data.type.charAt(0).toUpperCase() +
																  item.data.type.slice(1)
																: ''}
														</div>
													</Link>
													<div className='flex lg:text-lg'>
														{item.data.archived ? (
															<p>Out of stock!</p>
														) : item.data.sale > 0 ? (
															<>
																<p className='line-through mr-2'>
																	${item.data.price}
																</p>
																<p className='text-red-600'>
																	${item.data.sale}
																</p>
															</>
														) : (
															<p>${item.data.price}</p>
														)}
													</div>
												</div>

												<div className='mt-2 flex flex-row w-full items-center justify-end gap-2'>
													{!item.data.active && <p>No longer available</p>}

													<div className='flex gap-x-2 items-center'>
														{/*<p className='lg:text-lg'>QTY: {item.qty}</p>
												 <Link to={`/product/${item._id}`}>
													<MdEdit className='text-blue-400 text-2xl' />
												</Link> */}
														<button
															onClick={() => {
																removeFromFavorites(item.data.storeId);
																//getProducts();
																enqueueSnackbar(
																	'Deleted ' +
																		item.data.name +
																		' from favorites',
																	{
																		variant: 'success',
																	}
																);
															}}
															className='btn-ghost text-red-600 hover:text-white p-2'
														>
															<MdOutlineDeleteForever className='text-2xl lg:text-3xl' />
														</button>
													</div>

													<div className='flex gap-x-6 lg:gap-x-4 items-center justify-center'>
														<button
															className={`has-tooltip px-4 py-2 btn ${
																cartItems.some(
																	(cartItem) => cartItem._id === item.data._id
																) ||
																item.data.archived ||
																!item.data.active
																	? 'opacity-80 cursor-not-allowed'
																	: ''
															}`}
															onClick={() => {
																if (
																	!cartItems.some(
																		(cartItem) => cartItem._id === item.data._id
																	)
																) {
																	addToCart(item.data, 1);
																	enqueueSnackbar(
																		'Added ' +
																			item.data.name +
																			' to cart with quantity 1',
																		{
																			variant: 'success',
																		}
																	);
																}
															}}
															disabled={
																cartItems.some(
																	(cartItem) => cartItem._id === item.data._id
																) ||
																item.data.archived ||
																!item.data.active
															}
														>
															<span className='hidden tooltip lg:flex w-fit rounded shadow-lg p-2 bg-slate-200 text-gray-600 -mt-14 -mr-16'>
																{!cartItems.some(
																	(cartItem) => cartItem._id === item.data._id
																) ? (
																	<p>Add to Cart</p>
																) : (
																	<p>Already in cart</p>
																)}
															</span>
															<MdAddShoppingCart size={27} />
														</button>
													</div>
												</div>
											</div>
										</div>
									)}
								</div>
							))}
					</div>
				)}
			</div>
		</>
	);
};

export default Favorites;
