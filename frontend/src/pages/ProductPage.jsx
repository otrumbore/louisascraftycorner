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
import { LOCALIP } from '../config';
import { useCart } from '../context/CartContext';

const ProductPage = () => {
	const [product, setProduct] = useState({});
	const [relatedProducts, setRelatedProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [qty, setQty] = useState(1);
	const { id } = useParams();
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const [selectedProduct, setSelectedProduct] = useState({});

	//cart stuff
	const { cartItems, addToCart, removeFromCart, clearCart, cartTotal } =
		useCart();

	useEffect(() => {
		setLoading(true);
		//const allProducts = useContext(ShopContext);
		axios
			.get(`http://${LOCALIP}:5555/products/${id}`)
			.then((response) => {
				setProduct(response.data.data);
			})
			.catch((error) => {
				console.log(error);
				alert('Could not find product');
				setLoading(false);
				navigate('/');
			});
		axios
			.get(`http://${LOCALIP}:5555/products`)
			.then((response) => {
				setRelatedProducts(response.data.data);
			})
			.catch((error) => {
				console.log(error);
				alert('Could not find product');
				setLoading(false);
				navigate('/');
			});
		//setRelatedProducts(allProducts.data.data);
		window.scrollTo(0, 0);
	}, [id]);

	useEffect(() => {
		if (product !== null && relatedProducts !== null) {
			setLoading(false);
		}
		//console.log(product);
	}, [product, relatedProducts]);

	useEffect(() => {
		if (qty > 0) {
			setSelectedProduct({ ...product, qty: qty });
		}
	}, [product, qty]);

	return (
		<>
			<div className='p-4 mt-[8rem] h-full lg:mt-[10rem]'>
				<LoadingModal loading={loading} />
				<div className='flex justify-center'>
					<div className='w-full grid grid-cols-1 lg:grid-cols-2 max-w-[1400px] items-start justify-start'>
						<div className='h-[500px] flex'>
							<img
								src={
									product.img === '' || product.img === undefined
										? DefaultProductImg
										: product.img === 'santaHat'
										? SantaHat
										: product.img
								}
								alt={product.name + ' image'}
								className='h-full w-fit object-cover rounded-2xl shadow-2xl shadow-gray-400 lg:hover:scale-110'
							/>
						</div>
						<div className='p-4 h-full items-center'>
							<div className='w-full mb-10 flex items-center justify-between'>
								<div className='text-sm'>Store ID: {product.storeId}</div>

								<div className='hidden lg:flex text-sm space-x-1'>
									<p>Category:</p>
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
							<div className='mt-4 w-full flex justify-center items-center'>
								<p className='flex w-full lg:text-center whitespace-pre-line text-lg'>
									{product.description}
								</p>
							</div>
							{/* Spacer for LG screens */}
							{/* <div className='hidden lg:block h-24'></div> */}

							<div className='mt-10 grid grid-cols-2 w-full items-center'>
								<div className='mlg:mt-0 flex items-center justify-start'>
									<button className='flex items-center border-4 px-4 py-2 border-slate-400 bg-slate-300 hover:bg-slate-400 hover:border-slate-500 hover:text-white hover:shadow-lg hover:shadow-slate-400 transition-all duration-100 rounded-md gap-x-2'>
										<FaRegHeart size={25} />
										<span className='hidden lg:block'>Add to Favorites</span>
									</button>
								</div>
								<div className='flex'>
									<div className='flex w-full items-center justify-end'>
										<div className='flex justify-between items-center gap-x-6 border-4 px-4 py-2 lg:h-12 rounded-md border-slate-400 bg-slate-300 hover:bg-slate-400 hover:border-slate-500 hover:shadow-lg hover:shadow-slate-400 hover:text-white'>
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
																	anchorOrigin: {
																		horizontal: 'right',
																		vertical: 'top',
																	},
																	autoHideDuration: 2000,
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
									className='flex items-center justify-center border-4 py-4 lg:py-3 text-xl border-slate-400 bg-slate-300 hover:bg-slate-400 hover:border-slate-500 hover:text-white hover:shadow-lg hover:shadow-slate-400 transition-all duration-100 rounded-md w-full'
									onClick={() => addToCart(selectedProduct, qty)}
								>
									<MdAddShoppingCart size={27} />
									<p className='ml-4 text-2xl'>Add to Cart</p>
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
						<div className='mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 w-[90%]'>
							<ProductCard
								numProducts={10}
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
