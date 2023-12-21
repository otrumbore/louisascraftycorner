import React from 'react';
import {
	FaRegHeart,
	FaHeart,
	FaStar,
	FaStarHalfAlt,
	FaRegStar,
} from 'react-icons/fa';

const ProductCard = ({ numProducts, products }) => {
	numProducts === undefined || numProducts === null ? (numProducts = 0) : '';
	return (
		<div className='mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 w-[90%]'>
			{products.slice(0, numProducts).map((item) => (
				<div
					key={item._id}
					className='flex flex-col items-center pb-4 border-4 border-gray-300 space-y-2 rounded-xl justify-between'
				>
					<div className='flex flex-col gap-y-4'>
						{item.sale > 0 && (
							<span className='absolute ml-4 mt-4 inline-flex items-center rounded-md bg-red-500 px-4 py-2 text-xs font-medium text-white ring-1 ring-inset ring-red-600/10'>
								SALE
							</span>
						)}
						<img
							alt={item.name + ' image'}
							src='https://c.pxhere.com/images/6f/bb/bb0b8bd8365deffc9cdcda034a02-1634123.jpg!d'
							className='object-cover h-[300px] w-full rounded-t-lg'
						/>
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
					</div>
					<p className='px-4 text-lg'>
						{item.description.slice(0, 100) + '...'}
					</p>
					<div className='flex pt-4 px-4 w-full justify-between items-center'>
						<div className='flex w-[40%] justify-start gap-x-4 text-xl'>
							<p className={`${item.sale > 0 && 'line-through'}`}>
								{'$' + item.price}
							</p>
							{item.sale > 0 && (
								<p className={`text-red-600`}>{'$' + item.sale}</p>
							)}
						</div>
						<div className='flex w-[55%] items-center gap-x-2 justify-end'>
							{/* Will add a hover to change to filled star once card is in own component */}
							<FaRegHeart size={25} />

							<button className='border-2 px-4 py-2 border-gray-300 bg-gray-300 hover:bg-gray-400 hover:shadow-lg rounded-full'>
								Add to Cart
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default ProductCard;
