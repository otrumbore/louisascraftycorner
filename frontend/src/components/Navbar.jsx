import React, { useState, useEffect } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoIosSearch } from 'react-icons/io';
import { FaRegUser } from 'react-icons/fa6';
import Banner from './Banner';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
	const [scrolled, setScrolled] = useState(false);
	const [navStyle, setNavStyle] = useState('bg-opacity-0 glass top-12');
	const navigate = useNavigate();

	const isAdmin = true;

	useEffect(() => {
		const handleScroll = () => {
			const isScrolled = window.scrollY > 0;
			setScrolled(isScrolled);
			isScrolled
				? setNavStyle('bg-opacity-90 top-0 shadow shadow-gray-600')
				: setNavStyle('bg-opacity-0 glass top-12');
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const navData = [
		{ linkName: 'Home', linkTo: '/' },
		{ linkName: 'Shop', linkTo: '/' },
		{ linkName: 'Events', linkTo: '/' },
		{ linkName: 'About', linkTo: '/' },
		{ linkName: 'Contact', linkTo: '/' },
	];
	const navAdminData = [
		{ linkName: 'Admin Home', linkTo: '/admin' },
		{ linkName: 'Orders', linkTo: '/admin' },
		{ linkName: 'Products', linkTo: '/admin' },
		{ linkName: 'Users', linkTo: '/admin' },
		{ linkName: 'Site Settings', linkTo: '/admin' },
	];
	return (
		<div>
			<Banner style={scrolled ? 'hidden' : 'fixed'} />
			<nav
				className={`fixed flex ${navStyle} left-0 p-2 px-4 w-full h-[4rem] bg-gray-200 justify-center items-center z-50`}
			>
				<div className='flex w-full max-w-[1400px] h-fit items-center justify-between'>
					<div className='flex text-gray-600 items-center'>
						<RxHamburgerMenu className='lg:hidden mr-4 ' size={30} />
						<div className='border-2 rounded-md border-gray-600 px-4 py-2'>
							Logo
						</div>
					</div>
					<div
						className={`hidden lg:flex ${
							isAdmin ? 'w-[75%]' : 'w-[30%] ml-16'
						}`}
					>
						<ul className='flex text-gray-800 w-full items-center justify-evenly list-none'>
							{navData.map((item, index) => (
								<li
									className={`px-3 py-1 rounded-3xl hover:border-2 hover:bg-gray-300 hover:border-gray-400 hover:scale-105 transition-all duration-100 `}
									key={index}
								>
									<Link to={item.linkTo}>{item.linkName}</Link>
								</li>
							))}
							{isAdmin && <span className='text-2xl'>|</span>}
							{isAdmin &&
								navAdminData.map((item, index) => (
									<li
										className={`px-3 py-1 rounded-3xl hover:border-2 hover:bg-gray-300 hover:border-gray-400 hover:scale-105 transition-all duration-100 `}
										key={index}
									>
										<Link to={item.linkTo}>{item.linkName}</Link>
									</li>
								))}
						</ul>
					</div>
					<div className='flex items-center gap-x-4 text-gray-600'>
						<IoIosSearch
							className='hover:border-2 hover:bg-gray-300 p-1 hover:border-gray-400 rounded-3xl hover:scale-125 transition-all duration-100'
							size={33}
						/>
						<FaRegUser
							className='hover:border-2 hover:bg-gray-300 p-1 hover:border-gray-400 hover:rounded-3xl hover:scale-125 transition-all duration-100'
							size={30}
						/>
						<MdOutlineShoppingCart
							className='hover:border-2 hover:bg-gray-300 p-1 hover:border-gray-400 rounded-3xl hover:scale-125 transition-all duration-100'
							size={34}
						/>
					</div>
				</div>
			</nav>
		</div>
	);
};

export default Navbar;
