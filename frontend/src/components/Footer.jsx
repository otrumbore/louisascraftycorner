import React from 'react';
import Logo500 from '../assets/logo500.png';
import { Link } from 'react-router-dom';

const Footer = () => {
	return (
		<div className='py-8 mt-8 flex w-full h-3xl border-t-4 border-t-slate-300 bg-slate-200 justify-center'>
			<div className='flex flex-col gap-y-4 lg:gap-y-0 lg:flex-row w-full justify-evenly max-w-[1400px]'>
				<div className=''>
					<div className='flex justify-center text-lg font-bold text-gray-600'>
						<p>Navigation:</p>
					</div>

					<ul className='mt-4 flex flex-col items-center space-y-2'>
						<li>Home</li>
						<li>Shop</li>
						<li>Events</li>
						<li>About Us</li>
						<li>Contact Us</li>
					</ul>
				</div>
				<div className=''>
					<div className='flex justify-center text-lg font-bold text-gray-600'>
						<p>Customer:</p>
					</div>

					<ul className='mt-4 flex flex-col items-center space-y-2'>
						<li>Track a Package</li>
						<li>
							<Link to='/info/help'>Help</Link>
						</li>
						<li>
							<Link to='/info/terms'>Terms of Use</Link>
						</li>
						<li>
							<Link to='/info/privacy'>Privacy Policy</Link>
						</li>
					</ul>
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
						<li className='flex space-x-2'>
							<p className='font-bold text-gray-600'>Email:</p>
							<p>sales@louisascrafts.com</p>
						</li>
					</ul>
					<img
						src={Logo500}
						alt='louisas crafty corner logo'
						className='flex -mt-20 w-[250px] lg:w-auto h-[250px]'
					/>
				</div>
			</div>
		</div>
	);
};

export default Footer;
