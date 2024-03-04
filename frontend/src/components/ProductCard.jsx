import React, { useState, useEffect } from 'react';
import {
	FaRegHeart,
	FaHeart,
	FaStar,
	FaStarHalfAlt,
	FaRegStar,
} from 'react-icons/fa';
import { MdAddShoppingCart } from 'react-icons/md';
import DefaultProductImg from '../assets/product-img/default.png';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

const ProductCard = ({ product }) => {
	const { enqueueSnackbar } = useSnackbar();
	const { cartItems, addToCart } = useCart();
	const { userDetails, addToFavorites, userFavorites, userRole } = useUser();

	const item = product;

	return (
		<>
			<div className='flex w-[93vw] md:max-w-[350px] h-[450px] flex-col items-center pb-4 border-4 border-primary space-y-2 rounded-xl justify-between bg-gray-100 lg:hover:scale-105'>
				<Link
					to={`/product/${item._id}`}
					className='relative flex flex-col gap-y-4 w-full rounded-md'
				>
					{item.sale > 0 && (
						<span className='absolute ml-4 mt-4 inline-flex items-center rounded-md bg-red-500 px-4 py-2 text-xs font-medium text-white ring-1 ring-inset ring-red-600/10'>
							SALE
						</span>
					)}
					<div className='w-full h-[250px] max-h-[300px] flex justify-center items-center overflow-hidden rounded-t-lg bg-gray-900'>
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
							className='aspect-square object-contain object-center h-auto overflow-hidden w-auto'
						/>
					</div>
					<div className='absolute bottom-3 right-3 text-amber-300'>
						{item.rating > 0 ? (
							<div className='flex mt-2'>
								{[...Array(Math.floor(item.rating))].map((_, index) => (
									<FaStar key={index} />
								))}
								{item.rating % 1 !== 0 && <FaStarHalfAlt />}
								{[...Array(5 - Math.ceil(item.rating))].map((_, index) => (
									<FaRegStar key={index} />
								))}
							</div>
						) : null}
					</div>
				</Link>
				<Link
					className='flex px-4 w-full items-start justify-between'
					to={`/product/${item._id}`}
				>
					<div className='flex flex-col w-[80%] gap-2'>
						<h4 className='text-3xl flex flex-wrap'>{item.name}</h4>
						<p className='block flex-wrap'>{item.type}</p>
					</div>
				</Link>
				{/* <Link to={`/product/${item._id}`} className='px-4 text-lg'>
						{item.description.slice(0, 75) + '...'}
					</Link> */}

				<div className='flex px-4 w-full justify-between items-center'>
					<Link to={`/product/${item._id}`}>
						<div className='flex w-1/4 justify-start gap-x-2 text-xl'>
							<p className={`${item.sale > 0 ? 'line-through' : null}`}>
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
									userDetails._id &&
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
							disabled={
								!userDetails._id ||
								userFavorites.some(
									(faveItem) => faveItem.itemId === item.storeId
								)
							}
							className={`p-2 btn-ghost text-primary disabled:opacity-50 disabled:cursor-not-allowed`}
						>
							<FaRegHeart className='' size={25} />
						</button>

						<button
							className={`px-4 py-2 btn disabled:opacity-50 disabled:cursor-not-allowed`}
							onClick={() => {
								if (!cartItems.some((cartItem) => cartItem._id === item._id)) {
									addToCart(item, 1);
									enqueueSnackbar(
										'Added ' + item.name + ' to cart with quantity 1',
										{
											variant: 'success',
										}
									);
								}
							}}
							disabled={cartItems.some((cartItem) => cartItem._id === item._id)}
						>
							<MdAddShoppingCart size={27} />
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProductCard;
