import React, { useEffect, useState } from 'react';
import LoadingModal from '../components/LoadingModal';
import { useCart } from '../context/CartContext';
import DefaultProductImg from '../assets/product-img/default.png';
import SantaHat from '../assets/product-img/santa-hat-ordiment.png';

const Cart = () => {
	const [loading, setLoading] = useState(false);
	//cart stuff
	const { cartItems, addToCart, removeFromCart, clearCart, cartTotal } =
		useCart();

	const cartItemsCount = cartItems.length;

	useEffect(() => {
		console.log(cartItems);
	}, [cartItems]);

	return (
		<>
			<div className='p-4 mt-[8rem] h-full lg:mt-[10rem]'>
				<LoadingModal loading={loading} />
				<div className='flex justify-center'>
					<h1 className='text-2xl'>Shopping Cart</h1>
				</div>
				<div className='flex flex-col mt-12 w-full items-center justify-center'>
					<div className='flex w-full max-w-[1000px] items-center justify-center'>
						{cartItemsCount <= 0 ? (
							<div>Cart is empty</div>
						) : (
							<div className='w-full space-y-4'>
								{cartItems.map((item, i) => (
									<ul
										className='flex w-full justify-between items-center border-2 border-slate-400 p-4 rounded-lg'
										key={i}
									>
										<li>
											<img
												src={
													item.img === '' || item.img === undefined
														? DefaultProductImg
														: item.img === 'santaHat' && SantaHat
												}
												alt={item.name + ' image'}
												className='border-2 border-slate-300 h-[75px] w-[100px] rounded-md'
											/>
											{/* Make sure to use the correct item image URL */}
										</li>
										<li>{item.name}</li>
										<li>QTY: {item.qty}</li>
										{/* Display the item quantity */}
										<li>
											<button onClick={() => removeFromCart(item._id)}>
												Delete
											</button>
											{/* Button to remove item */}
										</li>
									</ul>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Cart;
