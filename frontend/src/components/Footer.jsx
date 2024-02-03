import React from 'react';
import Logo500 from '../assets/logo-cropped-black.png';
import { Link } from 'react-router-dom';

const Footer = () => {
	return (
		<div className='py-8 mt-8 flex w-full h-3xl border-t-4 border-t-slate-300 bg-slate-200 justify-center'>
			<div className='flex flex-col gap-y-4 lg:gap-y-0 lg:flex-row w-full justify-evenly max-w-[1400px]'>
				<div className=''>
					<div className='flex justify-center text-lg font-bold text-gray-600'>
						<p>Navigation:</p>
					</div>

					<div className='mt-4 flex flex-col items-center space-y-2'>
						<Link to={'/'}>Home</Link>
						<Link to={'/shop'}>Shop</Link>
						<Link to={'/events'}>Events</Link>
						<Link to={'/about'}>About Us</Link>
						<Link to={'/contact'}>Contact Us</Link>
					</div>
				</div>
				<div className=''>
					<div className='flex justify-center text-lg font-bold text-gray-600'>
						<p>Customer:</p>
					</div>

					<div className='mt-4 flex flex-col items-center space-y-2'>
						<Link>Track a Package</Link>

						<Link to='/info/help'>Help</Link>

						<Link to='/info/terms'>Terms of Use</Link>

						<Link to='/info/privacy'>Privacy Policy</Link>
					</div>
				</div>
				<div className='flex flex-col items-center'>
					<div className='flex justify-center text-lg font-bold text-gray-600 '>
						<p>Contact:</p>
					</div>

					<ul className='mt-4 flex flex-col items-center space-y-2'>
						<li className='flex space-x-2'>
							<p className='font-bold text-gray-600'>Location:</p>
							<p>Temple, Pa</p>
						</li>
						<li className='flex space-x-2 items-center'>
							<p className='font-bold text-gray-600'>Email:</p>
							<p>
								<a
									href='mailto:louisascraftycorner@gmail.com'
									className='cursor-pointer text-primary'
								>
									louisascraftycorner@gmail.com
								</a>
							</p>
						</li>
					</ul>
					<img
						src={Logo500}
						alt='louisas crafty corner logo'
						className='flex mt-4 w-auto h-[75px]'
					/>
				</div>
			</div>
		</div>
	);
};

export default Footer;
