import React from 'react';
import HeroPic from '../../assets/hero.jpg';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
	const navigate = useNavigate();

	const goShopping = () => {
		navigate('/shop');
	};

	return (
		<div className='w-full h-screen flex items-center justify-center'>
			<div className='w-full max-w-[2400px] h-screen lg:h-full flex justify-center'>
				<img
					src={HeroPic}
					className='object-cover w-full h-full glass opacity-80'
				/>
				{/* promo text over the image hero */}
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
								className='mt-4 px-8 py-3 bg-[#0066b2] text-white rounded-md hover:bg-[#002D62] transition duration-300'
							>
								Shop Now
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Hero;
