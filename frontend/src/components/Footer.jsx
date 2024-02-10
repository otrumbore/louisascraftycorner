import React from 'react';
import Logo500 from '../assets/logo-cropped-black.png';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookSquare } from 'react-icons/fa';

const Footer = () => {
	return (
		<div className='py-8 mt-8 flex w-full h-3xl border-t-4 border-t-slate-300 bg-slate-200 justify-center'>
			<div className='flex flex-col gap-y-4 lg:gap-y-0 lg:flex-row w-full justify-evenly max-w-[1400px]'>
				<div className=''>
					<div className='flex justify-center text-lg font-bold text-gray-600'>
						<p>Navigation:</p>
					</div>

					<div className='mt-4 flex flex-col items-center space-y-2'>
						<Link
							className='hover:underline hover:underline-offset-4 hover:text-primary'
							to={'/'}
						>
							Home
						</Link>
						<Link
							className='hover:underline hover:underline-offset-4 hover:text-primary'
							to={'/shop'}
						>
							Shop
						</Link>
						<Link
							className='hover:underline hover:underline-offset-4 hover:text-primary'
							to={'/events'}
						>
							Events
						</Link>
						<Link
							className='hover:underline hover:underline-offset-4 hover:text-primary'
							to={'/about'}
						>
							About Us
						</Link>
						<Link
							className='hover:underline hover:underline-offset-4 hover:text-primary'
							to={'/contact'}
						>
							Contact Us
						</Link>
					</div>
				</div>
				<div className=''>
					<div className='flex justify-center text-lg font-bold text-gray-600'>
						<p>Customer:</p>
					</div>

					<div className='mt-4 flex flex-col items-center space-y-2'>
						<Link
							className='hover:underline hover:underline-offset-4 hover:text-primary'
							to={'/'}
						>
							Track a Package
						</Link>

						<Link
							className='hover:underline hover:underline-offset-4 hover:text-primary'
							to='/info/help'
						>
							Help
						</Link>

						<Link
							className='hover:underline hover:underline-offset-4 hover:text-primary'
							to='/info/terms'
						>
							Terms of Use
						</Link>

						<Link
							className='hover:underline hover:underline-offset-4 hover:text-primary'
							to='/info/privacy'
						>
							Privacy Policy
						</Link>
					</div>
				</div>
				<div className='flex flex-col items-center'>
					<div className='flex justify-center text-lg font-bold text-gray-600 '>
						<p>Contact:</p>
					</div>

					<ul className='mt-4 flex flex-col items-center space-y-3'>
						<li className='flex space-x-2'>
							<p className='font-bold text-gray-600'>Location:</p>
							<p>Temple, Pa</p>
						</li>
						<li className='flex space-x-2 items-center'>
							<p className='font-bold text-gray-600'>Email:</p>
							<p>
								<a
									href='mailto:louisascraftycorner@gmail.com'
									className='cursor-pointer text-primary hover:underline hover:underline-offset-4'
								>
									louisascraftycorner@gmail.com
								</a>
							</p>
						</li>
						<li className='flex items-center'>
							<p className='flex gap-2 font-semibold text-gray-600 text-4xl'>
								<a
									target='_blank'
									href='http://www.facebook.com/LouisasCraftyCorner'
									className='hover:text-primary'
								>
									<FaFacebookSquare />
								</a>
								<a
									target='_blank'
									href='http://instagram.com/LouisasCraftyCorner'
									className='hover:text-primary'
								>
									<FaInstagram />
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
