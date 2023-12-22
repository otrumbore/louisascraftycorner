import React, { useState, useEffect } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoIosSearch } from 'react-icons/io';
import { FaRegUser } from 'react-icons/fa6';
import Banner from './Banner';
import {
	MdOutlineFormatIndentIncrease,
	MdOutlineShoppingCart,
} from 'react-icons/md';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import Logo500 from '../assets/Logo500.png';

const Navbar = () => {
	const [scrolled, setScrolled] = useState(false);
	const [navStyle, setNavStyle] = useState('bg-opacity-0 glass top-10');
	const navigate = useNavigate();
	const location = useLocation();
	const pathName = location.pathname;

	const isAdmin = false;

	const defaulNavtStyle = 'bg-opacity-90 top-10 shadow shadow-gray-600';

	useEffect(() => {
		pathName !== '/' && setNavStyle(defaulNavtStyle);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollPos = window.scrollY;
			const isScrolled = currentScrollPos > 0;
			setScrolled(isScrolled);

			if (isScrolled && pathName === '/') {
				setNavStyle(defaulNavtStyle);
			} else if (isScrolled && pathName !== '/') {
				setNavStyle('bg-opacity-90 top-0 shadow shadow-gray-600');
			} else if (!isScrolled && pathName !== '/') {
				setNavStyle(defaulNavtStyle);
			} else {
				setNavStyle('bg-opacity-0 glass top-12');
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [pathName]);

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
			<Banner
				style={
					scrolled ? 'hidden' : pathName !== '/' ? 'bg-gray-400 fixed' : 'fixed'
				}
			/>
			<nav
				className={`fixed flex ${navStyle} left-0 p-2 px-4 w-full h-[4rem] bg-gray-200 justify-center items-center z-50 transition-all duration-200`}
			>
				<div className='flex w-full max-w-[1400px] h-fit items-center justify-between'>
					<div className='flex text-gray-600 items-center'>
						<RxHamburgerMenu className='lg:hidden' size={30} />
						<div className='rounded-md w-[150px] h-[150px] -mt-4'>
							<Link to='/'>
								<img
									src={Logo500}
									alt="Louisa's Crafty Corner Logo"
									className='w-auto h-full'
								/>
							</Link>
						</div>
					</div>
					<div className={`hidden lg:flex ${isAdmin ? 'w-[75%]' : 'w-[40%]'}`}>
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
