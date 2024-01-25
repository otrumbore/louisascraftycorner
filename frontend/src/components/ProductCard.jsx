import React, { useState, useEffect } from 'react';
import {
	FaRegHeart,
	FaHeart,
	FaStar,
	FaStarHalfAlt,
	FaRegStar,
} from 'react-icons/fa';
import { MdAddShoppingCart } from 'react-icons/md';
import SantaHat from '../assets/product-img/santa-hat-ordiment.png';
import DefaultProductImg from '../assets/product-img/default.png';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

const ProductCard = ({
	numProducts,
	products,
	filterCategory,
	filterType,
	currProduct,
}) => {
	const [showProducts, setShowProducts] = useState([]);
	const { enqueueSnackbar } = useSnackbar();
	const [loggedIn, setLoggedIn] = useState(false);

	const {
		cartItems,
		addToCart,
		removeFromCart,
		clearCart,
		cartTotal,
		cartItemsCount,
	} = useCart();

	const { userDetails, addToFavorites, userFavorites, userRole } = useUser();

	useEffect(() => {
		let filteredProducts = products;

		if (products && products.length > 0) {
			if (filteredProducts && userRole() < 3) {
				filteredProducts = filteredProducts.filter(
					(item) => item.type !== 'test' && item.type !== 'Test'
				);
			}

			filteredProducts = filteredProducts.filter(
				(product) => product.archived === false && product.active === true
			);

			if (filterCategory && filterType) {
				filteredProducts = products
					.filter(
						(item) =>
							(filterCategory && item.category === filterCategory) ||
							(filterType && item.type === filterType)
					)
					.filter(
						(item) =>
							item._id !== currProduct &&
							item.archived === false &&
							item.active === true
					);
			} else {
				if (filterCategory) {
					filteredProducts = filteredProducts.filter(
						(item) =>
							item.category === filterCategory &&
							item._id !== currProduct &&
							item.archived === false &&
							item.active === true
					);
				}

				if (filterType) {
					filteredProducts = filteredProducts.filter(
						(item) =>
							item.type === filterType &&
							item._id !== currProduct &&
							item.archived === false &&
							item.active === true
					);
				}
			}

			userDetails._id !== undefined ? setLoggedIn(true) : setLoggedIn(false);

			setShowProducts(filteredProducts);
		}
	}, [products, filterCategory, filterType, currProduct]);

	numProducts === undefined || numProducts === null ? (numProducts = 0) : '';
	//const navigate = useNavigate();
	return (
		<>
			{showProducts.slice(0, numProducts).map((item) => (
				<div
					key={item._id}
					className='flex flex-col items-center pb-4 border-4 border-primary space-y-2 rounded-xl justify-between bg-gray-100 shadow-lg shadow-gray-600 lg:hover:scale-105'
				>
					<Link to={`/product/${item._id}`} className='flex flex-col gap-y-4'>
						{item.sale > 0 && (
							<span className='absolute ml-4 mt-4 inline-flex items-center rounded-md bg-red-500 px-4 py-2 text-xs font-medium text-white ring-1 ring-inset ring-red-600/10'>
								SALE
							</span>
						)}
						<div className='w-full h-[250px] flex justify-center items-center overflow-hidden rounded-t-lg'>
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
								className='aspect-auto min-h-full min-w-full'
							/>
						</div>
						<div
							className='flex px-4 w-full items-center justify-between'
							//to={`/product/${item._id}`}
						>
							<div className='flex w-[80%] flex-wrap items-center gap-2'>
								<h4 className='text-3xl flex flex-wrap'>{item.name}</h4>
								<p className='hidden lg:block text-sm flex-wrap'>
									{' '}
									- {item.type}
								</p>
							</div>

							{item.rating > 0 ? (
								<div className='flex'>
									{[...Array(Math.floor(item.rating))].map((_, index) => (
										<FaStar key={index} />
									))}
									{item.rating % 1 !== 0 && <FaStarHalfAlt />}
									{[...Array(5 - Math.ceil(item.rating))].map((_, index) => (
										<FaRegStar key={index} />
									))}
								</div>
							) : (
								''
							)}
						</div>
					</Link>

					<Link to={`/product/${item._id}`} className='px-4 text-lg'>
						{item.description.slice(0, 75) + '...'}
					</Link>

					<div className='flex px-4 w-full justify-between items-center'>
						<Link to={`/product/${item._id}`}>
							<div className='flex w-1/4 justify-start gap-x-2 text-xl'>
								<p className={`${item.sale > 0 && 'line-through'}`}>
									{'$' + item.price}
								</p>
								{item.sale > 0 && (
									<p className={`text-red-600`}>{'$' + item.sale}</p>
								)}
							</div>
						</Link>
						<div className='flex w-3/4 items-center justify-end gap-x-1'>
							{/* Will add a hover to change to filled star once card is in own component */}
							<button
								onClick={() => {
									if (
										loggedIn &&
										!userFavorites.some((item) => item.itemId === item.storeId)
									) {
										addToFavorites(item.storeId);
										enqueueSnackbar('Added ' + item.name + ' to favorites', {
											variant: 'success',
										});
									} else {
										enqueueSnackbar('Login first to add to favorites!', {
											variant: 'warning',
										});
									}
								}}
								disabled={userFavorites.some(
									(faveItem) => faveItem.itemId === item.storeId
								)}
								className={`has-tooltip p-2 btn-ghost text-primary hover:text-secondary ${
									userFavorites.some(
										(faveItem) => faveItem.itemId === item.storeId
									) && 'opacity-75 cursor-not-allowed'
								}`}
							>
								<span className='hidden tooltip lg:flex w-fit rounded shadow-lg p-2 text-secondary bg-primary opacity-90 -mt-24 -mr-24'>
									{!userFavorites.some(
										(faveItem) => faveItem.itemId === item.storeId
									) ? (
										<p>Add to Favorites</p>
									) : (
										<p>Already in Favorites</p>
									)}
								</span>

								<FaRegHeart className='' size={25} />
							</button>

							<button
								className={`has-tooltip px-4 py-2 btn ${
									cartItems.some((cartItem) => cartItem._id === item._id)
										? 'opacity-75 cursor-not-allowed'
										: ''
								}`}
								onClick={() => {
									if (
										!cartItems.some((cartItem) => cartItem._id === item._id)
									) {
										addToCart(item, 1);
										enqueueSnackbar(
											'Added ' + item.name + ' to cart with quantity 1',
											{
												variant: 'success',
											}
										);
									}
								}}
								disabled={cartItems.some(
									(cartItem) => cartItem._id === item._id
								)}
							>
								<span className='hidden tooltip lg:flex w-fit rounded shadow-lg p-2 text-secondary bg-primary opacity-90 -mt-24 -mr-12'>
									{!cartItems.some((cartItem) => cartItem._id === item._id) ? (
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
			))}
		</>
	);
};

export default ProductCard;
