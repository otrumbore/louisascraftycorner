import React from 'react';
import {
	FaRegHeart,
	FaHeart,
	FaStar,
	FaStarHalfAlt,
	FaRegStar,
} from 'react-icons/fa';
import SantaHat from '../assets/product-img/santa-hat-ordiment.png';
import { Link } from 'react-router-dom';

const ProductCard = ({ numProducts, products }) => {
	numProducts === undefined || numProducts === null ? (numProducts = 0) : '';
	//const navigate = useNavigate();
	return (
		<>
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
						<Link
							to={`/product/${item._id}`}
							className='w-full h-[250px] flex items-center justify-center overflow-hidden rounded-t-lg'
						>
							<img
								alt={item.name + ' image'}
								//src='https://c.pxhere.com/images/6f/bb/bb0b8bd8365deffc9cdcda034a02-1634123.jpg!d'
								src={SantaHat}
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
							<div className='p-2 hover:border-2 hover:border-gray-400 hover:bg-gray-300 rounded-3xl transition-all duration-100'>
								<FaRegHeart size={25} />
							</div>
							<button className='border-2 px-4 py-2 border-gray-300 bg-gray-300 hover:bg-gray-400 hover:shadow-lg rounded-full'>
								Add to Cart
							</button>
						</div>
					</div>
				</div>
			))}
		</>
	);
};

export default ProductCard;
