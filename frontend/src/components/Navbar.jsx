import React, { useState, useEffect } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoIosSearch } from 'react-icons/io';
import { FaRegUser, FaRegHeart } from 'react-icons/fa6';
import Banner from './Banner';
import { MdOutlineShoppingCart, MdClose } from 'react-icons/md';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import LogoBlack from '../assets/logo-cropped-black.png';
import LogoWhite from '../assets/logo-cropped-white.png';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

const Navbar = () => {
	const [scrolled, setScrolled] = useState(false);
	const [navStyle, setNavStyle] = useState('bg-opacity-0 glass top-10');
	const [logoImg, setLogoImg] = useState(LogoBlack);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMobile, setisMobile] = useState(true);
	const navigate = useNavigate();
	const location = useLocation();
	const pathName = location.pathname;
	const { userDetails, isAdmin } = useUser();

	//cart stuff
	const {
		cartItems,
		addToCart,
		removeFromCart,
		clearCart,
		cartTotal,
		cartItemsCount,
	} = useCart();

	const totalItemsCount = cartItemsCount();
	//end cart stuff

	const defaultNavStyle = 'bg-opacity-90 top-0 shadow shadow-gray-600';
	const homePagePath = '/';

	useEffect(() => {
		window.screen.width <= 768 ? setisMobile(true) : setisMobile(false);
		//console.log(cartItemsCount);
		const handleScroll = () => {
			const currentScrollPos = window.scrollY;
			const isScrolled = currentScrollPos > 0;
			setScrolled(isScrolled);

			if (!isScrolled && pathName === homePagePath) {
				setNavStyle('bg-opacity-0 glass top-10');
				setLogoImg(LogoWhite);
			} else {
				setNavStyle(
					isScrolled
						? defaultNavStyle
						: 'bg-opacity-90 top-10 shadow shadow-gray-600'
				);
				setLogoImg(LogoBlack);
			}
		};

		handleScroll(); // Initial call to set navbar style based on scroll position
		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [pathName, defaultNavStyle, homePagePath]);

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
		{ linkName: 'Site Settings', linkTo: '/admin/site_settings' },
	];

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	return (
		<div>
			<Banner
				style={
					scrolled
						? 'hidden'
						: pathName !== '/'
						? 'bg-slate-400 fixed'
						: 'fixed'
				}
			/>
			<nav
				className={`fixed flex ${navStyle} left-0 p-2 px-4 w-full h-[4rem] bg-slate-200 justify-center items-center z-50 transition-all duration-200`}
			>
				<div className='flex w-full max-w-[1400px] h-fit items-center justify-between'>
					<div className='flex text-gray-600 items-center'>
						<RxHamburgerMenu
							className={`lg:hidden mr-4`}
							size={30}
							onClick={toggleMobileMenu}
						/>

						<div className='rounded-md w-auto h-[50px]'>
							<Link to='/'>
								<img
									src={!isMobile ? logoImg : LogoBlack}
									alt="Louisa's Crafty Corner Logo"
									className='w-auto h-full'
								/>
							</Link>
						</div>
					</div>
					<div
						className={`hidden lg:flex ${isAdmin() ? 'w-[75%]' : 'w-[40%]'}`}
					>
						<ul
							className={`flex w-full items-center justify-evenly list-none ${
								scrolled || pathName !== '/' ? 'text-gray-600' : 'text-white'
							}`}
						>
							{navData.map((item, index) => (
								<li
									className={`px-3 py-1 rounded-md hover:border-2 hover:bg-slate-300 hover:border-slate-400 hover:text-gray-600 hover:bg-opacity-90 hover:scale-105 transition-all duration-100 cursor-pointer`}
									key={index}
								>
									<Link to={item.linkTo}>{item.linkName}</Link>
								</li>
							))}
							{isAdmin() && <span className='text-2xl'>|</span>}
							{isAdmin() &&
								navAdminData.map((item, index) => (
									<li
										className={`px-3 py-1 rounded-md hover:border-2 hover:bg-slate-300 hover:border-slate-400 hover:text-gray-600 hover:bg-opacity-90 hover:scale-105 transition-all duration-100 cursor-pointer`}
										key={index}
									>
										<Link to={item.linkTo}>{item.linkName}</Link>
									</li>
								))}
						</ul>
					</div>
					<div
						className={`flex items-center gap-x-4  ${
							scrolled || pathName !== '/' ? 'text-gray-600' : 'text-white'
						}`}
					>
						<Link to='/user/dashboard#favorites'>
							<FaRegHeart
								className='hover:border-2 hover:bg-slate-300 p-1 hover:border-slate-400 hover:text-gray-600 rounded-md hover:bg-opacity-90 hover:scale-125 transition-all duration-100 cursor-pointer'
								size={30}
							/>
						</Link>
						<Link to='/user/dashboard'>
							<FaRegUser
								className='hover:border-2 hover:bg-slate-300 p-1 hover:border-slate-400 hover:text-gray-600 rounded-md hover:bg-opacity-90 hover:scale-125 transition-all duration-100 cursor-pointer'
								size={30}
							/>
						</Link>
						<Link to={'/cart'}>
							<span className='inline-flex items-center font-medium hover:border-2 hover:bg-slate-300 p-1 hover:border-slate-400 hover:text-gray-600 rounded-md hover:bg-opacity-90 transition-all duration-100 cursor-pointer'>
								<MdOutlineShoppingCart className='' size={25} />
								<p
									className={` ${
										totalItemsCount > 0 ? 'block' : 'hidden'
									} ml-2 text-lg`}
								>
									{totalItemsCount}
								</p>
							</span>
						</Link>
					</div>
				</div>
			</nav>
			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div
					className='fixed inset-0 z-50 bg-slate-800 bg-opacity-75 transition-all duration-300 ease-in-out'
					onClick={toggleMobileMenu}
				>
					<div className='absolute inset-y-0 left-0 top-0 w-64 bg-slate-200 rounded-r-md shadow-lg transition-transform duration-300 ease-in-out'>
						<div className='flex justify-between items-center p-4'>
							<img
								src={!isMobile ? logoImg : LogoBlack}
								alt="Louisa's Crafty Corner Logo"
								className='w-auto h-[50px]'
							/>
							<MdClose
								className='text-gray-800'
								size={30}
								onClick={toggleMobileMenu}
							/>
						</div>
						<div
							className={`flex w-full items-center px-4 mb-4 mt-4 justify-evenly text-gray-800`}
						>
							<IoIosSearch
								className='hover:border-2 hover:bg-gray-300 p-1 hover:border-gray-400 rounded-md hover:scale-125 transition-all duration-100 cursor-pointer'
								size={33}
							/>
							<FaRegUser
								className='hover:border-2 hover:bg-gray-300 p-1 hover:border-gray-400 rounded-md hover:scale-125 transition-all duration-100 cursor-pointer'
								size={30}
							/>
							<span className='inline-flex items-center font-medium hover:border-2 hover:bg-slate-300 p-1 hover:border-slate-400 hover:text-gray-600 rounded-md hover:bg-opacity-90 transition-all duration-100 cursor-pointer'>
								<MdOutlineShoppingCart className='' size={25} />
								<p
									className={` ${
										totalItemsCount > 0 ? 'block' : 'hidden'
									} ml-2 text-lg`}
								>
									{totalItemsCount}
								</p>
							</span>
						</div>
						<ul className='flex flex-col items-center text-xl'>
							{/* Render your mobile menu links here */}
							{navData.map((item, index) => (
								<li className='py-4' key={index}>
									<Link to={item.linkTo} className='text-black'>
										{/* Update text color */}
										{item.linkName}
									</Link>
								</li>
							))}
							{isAdmin() && <div>------</div>}
							{isAdmin() &&
								navAdminData.map((item, index) => (
									<li className='py-2' key={index}>
										<Link to={item.linkTo} className='text-black'>
											{/* Update text color */}
											{item.linkName}
										</Link>
									</li>
								))}
						</ul>
						<div className='absolute w-full bottom-4 px-4'>
							<ul className='flex w-full items-center justify-between'>
								<li>Help</li>
								<li>Terms</li>
								<li>Privacy</li>
							</ul>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Navbar;
