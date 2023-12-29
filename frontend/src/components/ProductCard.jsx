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

const ProductCard = ({
	numProducts,
	products,
	filterCategory,
	filterType,
	currProduct,
}) => {
	const [showProducts, setShowProducts] = useState([]);
	const { enqueueSnackbar } = useSnackbar();

	const {
		cartItems,
		addToCart,
		removeFromCart,
		clearCart,
		cartTotal,
		cartItemsCount,
	} = useCart();

	useEffect(() => {
		let filteredProducts = products;

		if (filterCategory && filterType) {
			filteredProducts = products
				.filter(
					(item) =>
						(filterCategory && item.category === filterCategory) ||
						(filterType && item.type === filterType)
				)
				.filter((item) => item._id !== currProduct);
		} else {
			if (filterCategory) {
				filteredProducts = filteredProducts.filter(
					(item) => item.category === filterCategory && item._id !== currProduct
				);
			}

			if (filterType) {
				filteredProducts = filteredProducts.filter(
					(item) => item.type === filterType && item._id !== currProduct
				);
			}
		}

		setShowProducts(filteredProducts);
	}, [products, filterCategory, filterType, currProduct]);

	numProducts === undefined || numProducts === null ? (numProducts = 0) : '';
	//const navigate = useNavigate();
	return (
		<>
			{showProducts.slice(0, numProducts).map((item) => (
				<div
					key={item._id}
					className='flex flex-col items-center pb-4 border-4 border-gray-300 space-y-2 rounded-xl justify-between bg-gray-100 shadow-lg shadow-gray-600 lg:hover:scale-110'
				>
					<div className='flex flex-col gap-y-4'>
						{item.sale > 0 && (
							<span className='absolute ml-4 mt-4 inline-flex items-center rounded-md bg-red-500 px-4 py-2 text-xs font-medium text-white ring-1 ring-inset ring-red-600/10'>
								SALE
							</span>
						)}
						<Link
							to={`/product/${item._id}`}
							className='w-full h-[250px] flex items-center justify-center overflow-hidden rounded-t-lg'
						>
							<img
								alt={item.name + ' image'}
								//src='https://c.pxhere.com/images/6f/bb/bb0b8bd8365deffc9cdcda034a02-1634123.jpg!d'
								src={
									item.img === '' || item.img === undefined
										? DefaultProductImg
										: item.img === 'santaHat'
										? SantaHat
										: item.img
								}
								className='object-cover min-h-full min-w-full'
							/>
						</Link>
						<Link to={`/product/${item._id}`}>
							<div className='flex w-full px-4 items-center justify-between'>
								<h4 className='text-3xl w-[50%]'>{item.name}</h4>

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
									<div>No Rating</div>
								)}
							</div>
						</Link>
					</div>

					<Link to={`/product/${item._id}`}>
						<p className='px-4 text-lg'>
							{item.description.slice(0, 100) + '...'}
						</p>
					</Link>
					<div className='flex pt-4 px-4 w-full justify-between items-center'>
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
							<div className='has-tooltip p-2 hover:border-2 hover:bg-slate-400 hover:border-slate-500 hover:text-white hover:shadow-lg hover:shadow-slate-400 rounded-md transition-all duration-100'>
								<span className='hidden tooltip lg:flex w-fit rounded shadow-lg p-2 bg-slate-200 text-gray-600 -mt-14 -mr-24'>
									Add to Favorites
								</span>
								<FaRegHeart size={25} />
							</div>

							<button
								className={`has-tooltip border-2 px-4 py-2 border-slate-400 bg-slate-300 hover:bg-slate-400 hover:border-slate-500 hover:text-white hover:shadow-slate-400 hover:shadow-lg rounded-md transition-all duration-300 ${
									cartItems.some((cartItem) => cartItem._id === item._id)
										? 'opacity-50 cursor-not-allowed'
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
									(cartItem) => cartItem._id === item._id
								)}
							>
								<span className='hidden tooltip lg:flex w-fit rounded shadow-lg p-2 bg-slate-200 text-gray-600 -mt-14 -mr-16'>
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
