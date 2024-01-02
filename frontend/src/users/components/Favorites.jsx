import React, { useEffect, useState } from 'react';
import DefaultProductImg from '../../assets/product-img/default.png';
import { Link } from 'react-router-dom';
import { MdOutlineDeleteForever } from 'react-icons/md';

const Favorites = () => {
	const [favorites, setFavorites] = useState([
		{
			storeId: 11111,
		},
		{
			storeId: 11112,
		},
		{
			storeId: 11113,
		},
		{
			storeId: 11114,
		},
	]);

	useEffect(() => {}, []);
	return (
		<>
			<div className='w-full'>
				<div className='flex w-full'>
					<h3 className='text-xl'>Your Favorites</h3>
				</div>
				<div className='mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4'>
					{favorites.length <= 0 ? (
						<div className='text-center'>No favorites</div>
					) : (
						favorites.map((item, i) => (
							<div
								className='border-2 border-slate-400 p-4 rounded-lg mb-4'
								key={i}
							>
								<div className='flex items-center'>
									<div className='flex h-[100px] w-[100px] items-center justify-center'>
										<img
											src={
												item.img === '' || item.img === undefined
													? DefaultProductImg
													: item.img === 'santaHat' && SantaHat
											}
											alt={item.name + ' image'}
											className='object-cover border-2 border-slate-300 h-full w-full rounded-md'
										/>
									</div>
									<div className='flex flex-col w-full items-center justify-between lg:gap-y-4'>
										<div className='pl-4 flex flex-col gap-y-2 lg:flex-row w-full justify-between'>
											<div className='font-bold text-lg'>
												{item.name} -{' '}
												{item.type &&
													item.type.charAt(0).toUpperCase() +
														item.type.slice(1)}
											</div>
											<div className='flex lg:text-xl'>
												$
												{item.sale > 0 ? (
													<>
														<p className='line-through mr-2'>
															{item.price * item.qty}
														</p>
														<p className='text-red-600'>
															${item.sale * item.qty}
														</p>
													</>
												) : (
													item.price * item.qty
												)}
											</div>
										</div>
										<div className='pl-4 mt-2 flex flex-row w-full items-center justify-between'>
											<div className='flex gap-x-2 items-center'>
												{/*<p className='lg:text-lg'>QTY: {item.qty}</p>
												 <Link to={`/product/${item._id}`}>
													<MdEdit className='text-blue-400 text-2xl' />
												</Link> */}
											</div>

											<div className='flex gap-x-6 lg:gap-x-4 items-center justify-center'>
												<button
													onClick={() => {
														removeFromCart(item._id);
														enqueueSnackbar(
															'Deleted ' + item.name + ' from favorites',
															{
																variant: 'success',
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
