import React from 'react';
import SantaHat from '../../assets/product-img/santa-hat-ordiment.png';

const Hero = () => {
	return (
		<div className='w-full h-screen flex items-center justify-center'>
			<div className='w-full max-w-[2400px] h-screen lg:h-full flex justify-center'>
				<img
					//src='https://c.pxhere.com/images/6f/bb/bb0b8bd8365deffc9cdcda034a02-1634123.jpg!d'
					src={SantaHat}
					className='object-cover w-full h-full glass opacity-80'
				/>
				{/* promo text over the image hero */}
				<div className='absolute flex w-full lg:w-[35%] left-0 lg:left-[33%] top-[30%] lg:top-[30%]'>
					<div className='absolute p-6 flex flex-col items-center gap-y-4 lg:items-start w-full bg-slate-100 bg-opacity-40 text-gray-800 border-4 border-[#0066b2] rounded-xl'>
						<div className='flex w-full justify-center'>
							<h3 className='text-3xl'>Promo Here</h3>
						</div>

						<p className='text-lg'>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil
							ipsa unde hic quaerat, ab consequuntur dicta voluptas fuga, totam
							minus blanditiis error consequatur laborum ut veritatis. Eligendi
							rem aspernatur quo.
						</p>
						<div className='flex w-full justify-end'>
							<button className='mt-4 px-8 py-3 bg-[#0066b2] text-white rounded-md hover:bg-[#002D62] transition duration-300'>
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
