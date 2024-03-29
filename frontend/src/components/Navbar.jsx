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
	const { userDetails, userRole, userFavorites } = useUser();
	const [searchOpen, setSearchOpen] = useState(false);

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

	const defaultNavStyle = 'bg-opacity-90 bg-blue-200 glass top-0';
	const homePagePath = '/';

	useEffect(() => {
		window.screen.width <= 768 ? setisMobile(true) : setisMobile(false);

		const handleScroll = () => {
			const currentScrollPos = window.scrollY;
			const isScrolled = currentScrollPos > 0;
			setScrolled(isScrolled);

			if (!isScrolled && pathName === homePagePath) {
				setNavStyle('bg-opacity-90 bg-blue-200 glass top-10');
				setLogoImg(LogoWhite);
			} else {
				setNavStyle(
					isScrolled
						? defaultNavStyle
						: 'bg-opacity-90 bg-blue-200 glass top-10'
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
		{ linkName: 'Shop', linkTo: '/shop' },
		{ linkName: 'Events', linkTo: '/events' },
		{ linkName: 'About', linkTo: '/about' },
		{ linkName: 'Contact', linkTo: '/contact' },
	];
	const navAdminData = [
		{ linkName: 'Admin Home', linkTo: '/admin' },
		{ linkName: 'Orders', linkTo: '/admin#orders' },
		//{ linkName: 'Site Settings', linkTo: '/admin/site_settings' },
	];

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const toggleSearch = () => {
		setSearchOpen(!searchOpen);
	};

	return (
		<div>
			<Banner style={scrolled ? 'hidden' : 'fixed'} />
			<nav
				className={`fixed flex ${navStyle} left-0 p-2 px-4 w-full h-[4rem] justify-center items-center z-50 transition-all duration-200`}
			>
				<div className='flex w-full max-w-[1400px] h-fit items-center justify-between'>
					<div className='flex items-center'>
						<RxHamburgerMenu
							className={`lg:hidden mr-4 ${
								'text-gray-600'
								//scrolled || pathName !== '/' ? 'text-gray-600' : 'text-white'
							}`}
							size={30}
							onClick={toggleMobileMenu}
						/>

						<div className='rounded-md w-auto h-[50px]'>
							<Link to='/'>
								<img
									src={LogoBlack} //scrolled || pathName !== '/' ? LogoBlack : LogoWhite}
									alt="Louisa's Crafty Corner Logo"
									className='w-auto h-full'
								/>
							</Link>
						</div>
					</div>
					<div
						className={`hidden lg:flex ${userRole() ? 'w-[60%]' : 'w-[40%]'}`}
					>
						<div
							className={`flex w-full items-center justify-evenly ${
								'text-gray-600'
								//scrolled || pathName !== '/' ? 'text-gray-600' : 'text-white'
							}`}
						>
							{navData.map((item, index) => (
								<Link
									to={item.linkTo}
									className={`px-3 py-1 btn-ghost hover:bg-opacity-90 cursor-pointer`}
									key={index}
								>
									{item.linkName}
								</Link>
							))}
							{userRole() > 1 && <span className='text-2xl'>|</span>}
							{userRole() > 1 &&
								navAdminData.map((item, index) => (
									<Link
										to={item.linkTo}
										className={`px-3 py-1 btn-ghost hover:bg-opacity-90 cursor-pointer`}
										key={index}
									>
										{item.linkName}
									</Link>
								))}
						</div>
					</div>
					<div
						className={`flex items-center gap-x-2  ${
							'text-gray-600'
							//scrolled || pathName !== '/' ? 'text-gray-600' : 'text-white'
						}`}
					>
						{/* <div
							className={`relative ${
								searchOpen ? 'w-56' : 'w-0'
							} overflow-hidden transition-all duration-300 `}
						>
							<p>Search</p>
							<input
								type='text'
								placeholder='Search...'
								className='absolute top-0 right-0 w-full h-full p-2 bg-gray-100 border-4 border-primary rounded-md'
							/>
						</div>
						<IoIosSearch
							size={28}
							onClick={toggleSearch}
							className='cursor-pointer'
						/> */}

						<Link
							to='/user/dashboard'
							className='p-2 btn-ghost font-medium hover:bg-opacity-90 cursor-pointer'
						>
							<FaRegUser className='' size={23} />
						</Link>
						<Link
							to='/user/dashboard#favorites'
							className={`relative group font-medium hover:bg-opacity-90 p-2 btn-ghost cursor-pointer`}
						>
							<FaRegHeart className='' size={25} />
							<p
								className={`${
									userFavorites.length === 0 && 'hidden'
								} absolute top-[.05rem] right-[.1rem] group-hover:bg-secondary bg-primary bg bg-opacity-75 rounded-md px-[.35rem] py-0 text-white text-sm z-10 transition-colors duration-300`}
							>
								{userFavorites.length}
							</p>
						</Link>
						<Link
							className={`font-medium relative group hover:bg-opacity-90 p-2 btn-ghost cursor-pointer`}
							to={'/cart'}
						>
							<MdOutlineShoppingCart className='' size={26} />
							<p
								className={`${
									totalItemsCount === 0 && 'hidden'
								} absolute top-[.05rem] right-[.1rem] group-hover:bg-dark_primary bg-secondary bg-opacity-75 rounded-md px-[.35rem] py-0 text-white text-sm z-10 transition-colors duration-300`}
							>
								{totalItemsCount}
							</p>
						</Link>
					</div>
				</div>
			</nav>
			{/* Mobile Menu */}
			{/* {isMobileMenuOpen && ( */}
			<div
				className={`fixed inset-0 z-50 bg-gray-800 bg-opacity-40 ${
					!isMobileMenuOpen ? 'w-0' : 'w-full'
				} transition-all duration-700 ease-in-out`}
				onClick={toggleMobileMenu}
			>
				<div
					className={`absolute inset-y-0 left-0 top-0 w-64 bg-blue-300 bg-opacity-90 rounded-r-md ${
						!isMobileMenuOpen && ' -mx-72'
					} transform duration-500 ease-in-out`}
				>
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
						<Link
							to='/user/dashboard'
							className={`font-medium p-2 btn-ghost cursor-pointer`}
						>
							<FaRegUser className='' size={25} />
						</Link>
						<Link
							to='/user/dashboard#favorites'
							className={`relative group font-medium p-2 btn-ghost`}
						>
							<FaRegHeart className='' size={27} />
							<p
								className={`${
									userFavorites.length === 0 && 'hidden'
								} absolute top-[.05rem] right-[.1rem] group-hover:bg-secondary bg-primary bg bg-opacity-75 rounded-md px-[.35rem] py-0 text-white text-sm z-10 transition-colors duration-300`}
							>
								{userFavorites.length}
							</p>
						</Link>

						<Link
							to={'/cart'}
							className={`relative group font-medium p-2 btn-ghost`}
						>
							<MdOutlineShoppingCart className='' size={28} />
							<p
								className={`${
									totalItemsCount === 0 && 'hidden'
								} absolute top-[.05rem] right-[.1rem] group-hover:bg-secondary bg-primary bg bg-opacity-75 rounded-md px-[.35rem] py-0 text-white text-sm z-10 transition-colors duration-300`}
							>
								{totalItemsCount}
							</p>
						</Link>
					</div>
					<div className='flex flex-col items-center text-xl'>
						{/* Render your mobile menu links here */}
						{navData.map((item, index) => (
							<Link to={item.linkTo} className='text-gray-600 py-4' key={index}>
								{item.linkName}
							</Link>
						))}
						{userRole() > 1 && <div>------</div>}
						{userRole() > 1 &&
							navAdminData.map((item, index) => (
								<Link
									to={item.linkTo}
									className='text-gray-600 py-2'
									key={index}
								>
									{item.linkName}
								</Link>
							))}
					</div>
					<div className='absolute w-full bottom-4 px-4'>
						<ul className='flex w-full items-center justify-between'>
							<li>
								<Link className='btn-ghost px-2' to='/info/help'>
									Help
								</Link>
							</li>
							<li>
								<Link className='btn-ghost px-2' to='/info/terms'>
									Terms
								</Link>
							</li>
							<li>
								<Link className='btn-ghost px-2' to='/info/privacy'>
									Privacy
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
			{/* )} */}
		</div>
	);
};

export default Navbar;
