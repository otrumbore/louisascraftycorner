import React from 'react';
import SantaHat from '../assets/product-img/santa-hat-ordiment.png';

const Hero = () => {
	return (
		<div className='w-full h-screen flex items-center justify-center'>
			<div className='w-full max-w-[2400px] h-screen lg:h-full flex justify-center'>
				<img
					//src='https://c.pxhere.com/images/6f/bb/bb0b8bd8365deffc9cdcda034a02-1634123.jpg!d'
					src={SantaHat}
					className='object-cover w-full h-full glass opacity-80'
				/>
			</div>
		</div>
	);
};

export default Hero;
