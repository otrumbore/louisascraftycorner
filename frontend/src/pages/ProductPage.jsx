import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingModal from '../components/LoadingModal';
import SantaHat from '../assets/product-img/santa-hat-ordiment.png';
import DefaultProductImg from '../assets/product-img/default.png';
import {
	FaRegHeart,
	FaHeart,
	FaStar,
	FaStarHalfAlt,
	FaRegStar,
	FaRegPlusSquare,
	FaRegMinusSquare,
	FaPlus,
	FaMinus,
} from 'react-icons/fa';
import { MdAddShoppingCart } from 'react-icons/md';
import { useSnackbar } from 'notistack';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { getProduct, getProducts } from '../api/products.api';

const ProductPage = () => {
	const [product, setProduct] = useState([]);
	const [relatedProducts, setRelatedProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [qty, setQty] = useState(1);
	const [productInCart, setProductInCart] = useState(false);
	const [productInFavorites, setProductInFavorites] = useState(false);
	const { id } = useParams();
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const API_URL = import.meta.env.VITE_SERVER_API_URL;

	const [base64ImageData, setBase64ImageData] = useState('');

	const [selectedProduct, setSelectedProduct] = useState({});

	const [loggedIn, setLoggedIn] = useState(false);

	//cart stuff
	const {
		cartItems,
		addToCart,
		removeFromCart,
		clearCart,
		cartTotal,
		updateCartItem,
	} = useCart();

	//user Stuff
	const { userDetails, addToFavorites, userFavorites, removeFromFavorites } =
		useUser();

	const [showFullDescription, setShowFullDescription] = useState(false);

	const toggleDescription = () => {
		setShowFullDescription(!showFullDescription);
	};

	const fetchProduct = async () => {
		try {
			const response = await getProduct(id);
			if (response.image !== undefined) {
				setBase64ImageData(response.image);
				//console.log(response.data.data.image);
			}
			console.log(response);
			setProduct(response);
		} catch (error) {
			console.error(error);
			enqueueSnackbar('Product does not exist!', {
				variant: 'error',
			});
			navigate('/');
		}
	};

	const fetchRelatedProducts = async () => {
		try {
			const response = await getProducts();
			setRelatedProducts(response);
		} catch (error) {
			console.error(error);
			enqueueSnackbar('Could not fetch related products', {
				variant: 'error',
			});
		}
	};

	useEffect(() => {
		setLoading(true);
		fetchProduct();
		fetchRelatedProducts();
		userDetails._id ? setLoggedIn(true) : setLoggedIn(false);
		window.scrollTo(0, 0);
	}, [id]);

	useEffect(() => {
		if (
			product &&
			Array.isArray(product) &&
			product.length === 0 &&
			relatedProducts &&
			Array.isArray(relatedProducts) &&
			relatedProducts.length === 0
		) {
			setLoading(false);
		}
	}, [product, relatedProducts]);

	useEffect(() => {
		setLoading(true);
		setProductInCart(
			cartItems.some((cartItem) => cartItem._id === product._id)
		);

		//console.log(userFavorites);

		if (userFavorites) {
			setProductInFavorites(
				userFavorites.some((favoriteItem) => favoriteItem._id === product._id)
			);
		}

		// Check if the product is in the cart and set the quantity accordingly
		const cartItem = cartItems.find((cartItem) => cartItem._id === product._id);

		if (productInCart) {
			if (cartItem) {
				setQty(cartItem.qty); // Set quantity to cart item's quantity
			} else {
				setQty(1);
			}
		}

		if (qty > 0) {
			setSelectedProduct({ ...product, qty: qty });
		}
		setLoading(false);
	}, [cartItems, product, productInCart, userFavorites]);

	const updateCartQty = () => {
		if (productInCart) {
			//let newQty = 0;
			const cartItem = cartItems.find(
				(cartItem) => cartItem._id === product._id
			);
			if (cartItem.qty === qty) {
				enqueueSnackbar(
					product.name + ' is already quantity ' + qty + '. Nothing updated!',
					{
						variant: 'info',
					}
				);
				return;
			}
			updateCartItem(product._id, qty);
			enqueueSnackbar('Updated ' + product.name + ' to quantity ' + qty, {
				variant: 'success',
			});
			return;
		}

		// If the product is not in the cart or the item is removed, add the product to the cart
		addToCart(selectedProduct, qty);
		enqueueSnackbar('Added ' + product.name + ' to cart with quantity ' + qty, {
			variant: 'success',
		});
	};

	return (
		<>
			<div className='p-4 mt-[8rem] h-full lg:mt-[10rem]'>
				<LoadingModal loading={loading} />
				<div className='flex justify-center'>
					<div className='w-full grid grid-cols-1 lg:grid-cols-2 max-w-[1400px] items-start justify-start'>
						<div className='h-[500px] flex justify-center'>
							<img
								src={
									base64ImageData
										? 'data:image/jpeg;base64,' + base64ImageData
										: DefaultProductImg
								}
								alt={product.name + ' image'}
								className='h-full w-fit object-cover rounded-2xl shadow-2xl shadow-gray-400 lg:hover:scale-110'
							/>
						</div>
						<div className='p-4 h-full items-center'>
							<div className='w-full mb-10 flex items-center justify-between'>
								<div className='text-sm'>Store ID: {product.storeId}</div>

								<div className='hidden lg:flex text-sm space-x-1'>
									<p>Collection:</p>
									<p>
										{
											product.category
												? product.category.charAt(0).toUpperCase() +
												  product.category.slice(1)
												: 'No category available' // Or any default text/message you want to display
										}
									</p>
								</div>
								<div className=''>
									{product.rating > 0 ? (
										<div className='flex'>
											{[...Array(Math.floor(product.rating))].map(
												(_, index) => (
													<FaStar key={index} size={22} />
												)
											)}
											{product.rating % 1 !== 0 && <FaStarHalfAlt size={22} />}
											{[...Array(5 - Math.ceil(product.rating))].map(
												(_, index) => (
													<FaRegStar key={index} size={22} />
												)
											)}
										</div>
									) : (
										<div>No Rating</div>
									)}
								</div>
							</div>
							<div className='mt-6 lg:mb-10 flex items-center justify-center'>
								<h3 className='text-3xl lg:text-4xl'>
									{product.name + ' - '}
									{
										product.type
											? product.type.charAt(0).toUpperCase() +
											  product.type.slice(1)
											: '' // Or any default text/message you want to display
									}
								</h3>
							</div>
							<div className='mt-4 mb-10 w-full grid grid-cols-1 items-center'>
								<div className='flex justify-evenly text-2xl'>
									<p className={`${product.sale > 0 && 'line-through'}`}>
										{'$' + product.price}
									</p>
									{product.sale > 0 && (
										<p className={`text-red-600`}>{'SALE: $' + product.sale}</p>
									)}
								</div>
							</div>
							<div className='mt-4 w-full flex flex-col justify-center items-center'>
								<p
									className={`flex w-full lg:text-center whitespace-pre-line text-lg ${
										product.description && showFullDescription
											? ''
											: 'rounded-b-lg shadow-[inset_0_-20px_6px_-6px_rgba(0,102,178,0.7)]'
									}`}
								>
									{product.description && showFullDescription
										? product.description
										: product.description &&
										  `${product.description.slice(0, 295)}...`}
								</p>
								{product.description && product.description.length > 200 && (
									<button
										className='mt-1 btn-ghost text-primary'
										onClick={toggleDescription}
									>
										{showFullDescription ? 'View Less' : 'View More'}
									</button>
								)}
							</div>
							<div className='mt-10 grid grid-cols-2 w-full items-center'>
								<div className='mlg:mt-0 flex items-center justify-start'>
									<button
										onClick={() => {
											if (!loggedIn) {
												enqueueSnackbar('Login first to add to favorites', {
													variant: 'warning',
												});
												return;
											}
											if (
												!userFavorites.some(
													(faveItem) => faveItem.itemId === product.storeId
												)
											) {
												addToFavorites(product.storeId);
												enqueueSnackbar(
													'Added ' + product.name + ' to favorites',
													{
														variant: 'success',
													}
												);
											} else {
												removeFromFavorites(product.storeId);
												enqueueSnackbar(
													'Removed ' + product.name + ' frome favorites',
													{
														variant: 'warning',
													}
												);
											}
										}}
										className='flex items-center px-4 py-2 btn-outline'
									>
										<FaRegHeart size={25} />
										<span className='hidden lg:block'>
											{!userFavorites.some(
												(faveItem) => faveItem.itemId === product.storeId
											) ? (
												<p>Add to Favorites</p>
											) : (
												<p>Remove from Favorites</p>
											)}
										</span>
									</button>
								</div>
								<div className='flex'>
									<div className='flex w-full items-center justify-end'>
										<div className='flex justify-between items-center gap-x-6 px-4 py-2 lg:h-12 btn-outline'>
											<FaMinus
												className='hover:cursor-pointer'
												size={20}
												onClick={() => qty > 1 && setQty(qty - 1)}
											/>
											<p className='text-xl lg:text-2xl'>{qty}</p>
											<FaPlus
												className='hover:cursor-pointer'
												size={20}
												onClick={() =>
													qty !== product.inventory
														? setQty(qty + 1)
														: enqueueSnackbar(
																'Max quantity reached. Please contact us for custom order if more needed!',
																{
																	variant: 'info',
																}
														  )
												}
											/>
										</div>
									</div>
								</div>
							</div>
							<div className='w-full mt-4 flex justify-center'>
								<button
									className='flex items-center justify-center py-4 lg:py-3 text-xl btn w-full'
									onClick={updateCartQty}
								>
									<MdAddShoppingCart size={27} />
									{productInCart ? (
										<p className='ml-4 text-2xl'>Update QTY?</p>
									) : (
										<p className='ml-4 text-2xl'>Add to Cart</p>
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='mt-10 w-full p-4 flex justify-center'>
				<div className='w-full max-w-[1400px] flex'>
					{/* Links to new products */}
					<div className='w-full py-4 flex flex-col items-center justify-center'>
						<h3 className='text-3xl lg:text-4xl'>
							<span className=''>Related Products</span>
						</h3>
						{/* <p>Newest Christmas Products:</p> */}
						<div className='mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 w-[100%]'>
							<ProductCard
								numProducts={3}
								products={relatedProducts}
								filterCategory={product.category}
								filterType={product.type}
								currProduct={product._id}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProductPage;
