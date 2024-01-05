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
import { LOCALIP } from '../../config';
import SantaHat from '../../assets/product-img/santa-hat-ordiment.png';
import { useSnackbar } from 'notistack';
import { useCart } from '../../context/CartContext';

const Favorites = () => {
	const navigate = useNavigate();
	const { userFavorites } = useUser();
	const [favorites, setFavorites] = useState([]);
	const [loading, setLoading] = useState(false);
	const { enqueueSnackbar } = useSnackbar();
	const { cartItems, addToCart } = useCart();

	const getProducts = async () => {
		setLoading(true);
		try {
			const favoriteProductsPromises = userFavorites.map(async (item) => {
				const favoriteProducts = await axios.get(
					`http://${LOCALIP}:5555/api/user/favorites/product/${item.itemId}`
				);
				return favoriteProducts.data;
			});

			const favoriteProductsData = await Promise.all(favoriteProductsPromises);

			setFavorites(favoriteProductsData);
			//setLoading(false);
		} catch (error) {
			console.error('Error fetching user details or favorites:', error);
			enqueueSnackbar('Could not load favorites...Try again later!', {
				variant: 'error',
				anchorOrigin: {
					horizontal: 'center',
					vertical: 'top',
				},
				autoHideDuration: 2000,
			});
			navigate('/user/dashboard#orders');
		}
	};

	useEffect(() => {
		favorites.length <= 0 && getProducts();
	}, []);

	useEffect(() => {
		if (
			userFavorites &&
			userFavorites.length > 0 &&
			favorites &&
			favorites.length > 0
		) {
			setLoading(false);
			console.log(favorites);
			//console.log(userFavorites.length);
		}
	}, [userFavorites, favorites]);
	return (
		<>
			<LoadingModal loading={loading} />
			<div className='w-full'>
				<div className='flex w-full justify-center items-center'>
					<h3 className='text-2xl lg:text-3xl'>Your Favorites</h3>
				</div>
				<div className='mt-8 grid grid-cols-1 md:grid-cols-2 w-full gap-4'>
					{userFavorites.length <= 0 ? (
						<div className='text-center'>No favorites</div>
					) : (
						favorites.length > 0 &&
						favorites.map((item, i) => (
							<div
								className='border-2 border-slate-400 p-4 rounded-lg mb-4'
								key={i}
							>
								<div className='flex items-center'>
									<Link to={`/product/${item.data._id}`}>
										<div className='flex h-[100px] w-[100px] items-center justify-center'>
											<img
												src={
													item.data.img === '' || item.data.img === undefined
														? DefaultProductImg
														: item.data.img === 'santaHat' && SantaHat
												}
												alt={item.data.name + ' image'}
												className='object-cover border-2 border-slate-300 h-full w-full rounded-md'
											/>
										</div>
									</Link>
									<div className='flex flex-col w-full items-center justify-between lg:gap-y-4'>
										<div className='pl-4 flex flex-col gap-y-2 lg:flex-row w-full justify-between'>
											<Link to={`/product/${item.data._id}`}>
												<div className='flex flex-wrap font-bold text-lg'>
													{item.data.name ? `${item.data.name} - ` : ''}
													{item.data.type
														? item.data.type.charAt(0).toUpperCase() +
														  item.data.type.slice(1)
														: ''}
												</div>
											</Link>
											<div className='flex lg:text-xl'>
												$
												{item.data.sale > 0 ? (
													<>
														<p className='line-through mr-2'>
															{item.data.price}
														</p>
														<p className='text-red-600'>${item.data.sale}</p>
													</>
												) : (
													item.data.price
												)}
											</div>
										</div>

										<div className='pl-4 mt-2 flex flex-row w-full items-center justify-between'>
											<div className='flex gap-x-2 items-center'>
												{/*<p className='lg:text-lg'>QTY: {item.qty}</p>
												 <Link to={`/product/${item._id}`}>
													<MdEdit className='text-blue-400 text-2xl' />
												</Link> */}
												<button
													onClick={() => {
														//removeFromCart(item._id);
														enqueueSnackbar(
															'Not Deleted ' +
																item.data.name +
																' from favorites',
															{
																variant: 'info',
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

											<div className='flex gap-x-6 lg:gap-x-4 items-center justify-center'>
												<button
													className={`has-tooltip border-2 px-4 py-2 border-slate-400 bg-slate-300 hover:bg-slate-400 hover:border-slate-500 hover:text-white hover:shadow-slate-400 hover:shadow-lg rounded-md transition-all duration-300 ${
														cartItems.some(
															(cartItem) => cartItem._id === item.data._id
														)
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
																	anchorOrigin: {
																		horizontal: 'center',
																		vertical: 'top',
																	},
																	autoHideDuration: 2000,
																}
															);
														}
													}}
													disabled={cartItems.some(
														(cartItem) => cartItem._id === item.data._id
													)}
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
							</div>
						))
					)}
				</div>
			</div>
		</>
	);
};

export default Favorites;
