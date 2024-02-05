import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineDeleteForever, MdAddShoppingCart } from 'react-icons/md';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import LoadingModal from '../../components/LoadingModal';
import DefaultProductImg from '../../assets/product-img/default.png';
import { useSnackbar } from 'notistack';
import { useCart } from '../../context/CartContext';

const Favorites = () => {
	const API_URL = import.meta.env.VITE_SERVER_API_URL;
	const apiKey = import.meta.env.VITE_APP_APIKEY;
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
				const favoriteProductsPromises = userFavorites.map(async (item) => {
					try {
						const favoriteProducts = await axios.get(
							`${API_URL}/api/user/favorites/product/${item.itemId}`,
							{ headers: { 'api-key': apiKey } }
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
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		// Load favorites on component mount
		if (favorites.length === 0) {
			getProducts();
		}
	}, [favorites]);

	useEffect(() => {
		// Update favorites when userFavorites change
		if (userFavorites.length !== favorites.length) {
			getProducts();
		}
	}, [favorites, userFavorites]);

	return (
		<>
			<LoadingModal loading={loading} />
			<div className='w-full flex flex-col items-center'>
				<div className='flex w-full justify-center items-center'>
					<h3 className='text-2xl lg:text-3xl'>Your Favorites</h3>
				</div>
				{userFavorites.length <= 0 ? (
					<div className='mt-8 text-center'>No favorites added yet. </div>
				) : (
					<div className='mt-8 w-full overflow-x-auto '>
						<div className='min-w-full bg-slate-100'>
							<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
								{favorites.length > 0 &&
									favorites.map((item, i) => (
										<div
											key={i}
											className='p-4 flex flex-col gap-y-4 lg:gap-0 lg:flex-row lg:justify-between items-center border-4 border-primary rounded-md'
										>
											<div className='flex items-center w-full justify-between'>
												<Link to={`/product/${item.data._id}`}>
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
															e.target.src = DefaultProductImg;
															e.target.alt = 'Default Product Image';
														}}
														className='object-cover h-16 w-16 rounded-md'
													/>
												</Link>
												<div className=''>{item.data.name}</div>
												<div>
													{item.data.archived ? (
														<p>Out of stock!</p>
													) : item.data.sale > 0 ? (
														<div className='flex gap-x-2'>
															<p className='line-through mr-2'>
																${item.data.price}
															</p>
															<p className='text-red-600'>${item.data.sale}</p>
														</div>
													) : (
														<p>${item.data.price}</p>
													)}
												</div>
											</div>

											<div className='flex w-full items-center justify-between lg:justify-end'>
												{item.data.name === 'deleted' ? (
													<p className='text-2xl'>Item no longer for sale</p>
												) : (
													<>
														{!item.data.active && <p>No longer available</p>}
														<button
															onClick={() => {
																removeFromFavorites(item.data.storeId);
																enqueueSnackbar(
																	'Deleted ' +
																		item.data.storeId +
																		' from favorites',
																	{ variant: 'success' }
																);
															}}
															className='btn-ghost px-2 text-red-600 hover:text-white ml-4'
														>
															<MdOutlineDeleteForever className='text-2xl lg:text-3xl' />
														</button>
														<button
															className={`btn px-4 py-2 ml-4 ${
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
																		{ variant: 'success' }
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
															<MdAddShoppingCart size={27} />
														</button>
													</>
												)}
											</div>
										</div>
									))}
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Favorites;
