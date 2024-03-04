import React from 'react';
import HeroPic from '../../assets/hero.jpg';
import DefaultImage from '../../assets/product-img/default.png';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
	const navigate = useNavigate();

	const goShopping = () => {
		navigate('/shop');
	};

	return (
		<div className='w-full flex justify-center'>
			<div className='w-full max-w-[2400px] lg:h-[40%] flex flex-col gap-8 items-center justify-center'>
				<div className='w-[90vw] bg-green-200 rounded-xl p-4 flex flex-col lg:flex-row items-center justify-between lg:justify-evenly'>
					<img
						src={HeroPic || DefaultImage}
						className='border-2 border-primary rounded-tr-3xl rounded-bl-3xl object-fill max-w-80 lg:max-w-96'
					/>
					<div className='w-full mt-8 lg:mt-0 lg:w-[50%]'>
						<div className='flex w-full justify-center'>
							<h3 className='text-3xl flex-wrap'>🌷Spring Has Sprung!🌻</h3>
						</div>

						<p className='mt-4 text-lg text-center'>
							Dive into a world of creativity with our exclusive hand-crafted
							creations. From stunning floral-themed artworks to intricately
							designed home decor, our collection embodies the beauty of spring!
						</p>
						<div className='mt-4 flex w-full justify-center'>
							<button
								onClick={() => goShopping()}
								className='mt-4 px-8 py-3 btn'
							>
								Shop Now
							</button>
						</div>
					</div>
				</div>
				<div className='hidden w-[90vw] flex flex-col lg:flex-row gap-8'>
					<div className='w-full lg:w-1/2 bg-yellow-100 rounded-xl p-4 flex flex-col lg:flex-row items-center justify-between lg:justify-evenly'>
						<img
							src={'' || DefaultImage}
							className='border-2 border-primary rounded-tr-3xl rounded-bl-3xl object-fill max-w-80 lg:max-w-64'
						/>
						<div className='w-full mt-8 lg:mt-0 lg:w-[50%]'>
							<div className='flex w-full justify-center'>
								<h3 className='text-3xl flex-wrap'>Title</h3>
							</div>

							<p className='mt-4 text-lg text-center'>
								Dive into a world of creativity with our exclusive hand-crafted
								creations. From stunning floral-themed artworks to intricately
								designed home decor, our collection embodies the beauty of
								spring!
							</p>
							<div className='mt-4 flex w-full justify-center'>
								<button
									onClick={() => goShopping()}
									className='mt-4 px-8 py-3 btn-outline'
								>
									Shop Now
								</button>
							</div>
						</div>
					</div>
					<div className='w-full lg:w-1/2  bg-blue-200 rounded-xl p-4 flex flex-col lg:flex-row items-center justify-between lg:justify-evenly'>
						<img
							src={'' || DefaultImage}
							className='border-2 border-primary rounded-tr-3xl rounded-bl-3xl object-fill max-w-80 lg:max-w-64'
						/>
						<div className='w-full mt-8 lg:mt-0 lg:w-[50%]'>
							<div className='flex w-full justify-center'>
								<h3 className='text-3xl flex-wrap'>Title</h3>
							</div>

							<p className='mt-4 text-lg text-center'>
								Dive into a world of creativity with our exclusive hand-crafted
								creations. From stunning floral-themed artworks to intricately
								designed home decor, our collection embodies the beauty of
								spring!
							</p>
							<div className='mt-4 flex w-full justify-center'>
								<button
									onClick={() => goShopping()}
									className='mt-4 px-8 py-3 btn-outline'
								>
									Shop Now
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* <img
					src={HeroPic}
					className='object-cover w-full h-full glass opacity-80'
				/>
				{/* promo text over the image hero
				<div className='absolute flex w-full lg:w-[35%] left-0 lg:left-[33%] top-[30%] lg:top-[30%]'>
					<div className='absolute p-6 flex flex-col items-center gap-y-4 lg:items-start w-full bg-slate-300 bg-opacity-50 text-gray-900 border-4 border-primary rounded-xl'>
						<div className='flex w-full justify-center'>
							<h3 className='text-3xl flex-wrap'>🌷Spring Has Sprung!🌻</h3>
						</div>

						<p className='text-lg'>
							Dive into a world of creativity with our exclusive hand-crafted
							creations. From stunning floral-themed artworks to intricately
							designed home decor, our collection embodies the beauty of spring!
						</p>
						<div className='flex w-full justify-end'>
							<button
								onClick={() => goShopping()}
								className='mt-4 px-8 py-3 btn'
							>
								Shop Now
							</button>
						</div>
					</div>
				</div> */}
			</div>
		</div>
	);
};

export default Hero;
