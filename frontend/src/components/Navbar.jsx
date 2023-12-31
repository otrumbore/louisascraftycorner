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
	const { userDetails, isAdmin, userFavorites } = useUser();

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

	const defaultNavStyle = 'bg-opacity-90 top-0 shadow shadow-primary';
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
						: 'bg-opacity-90 top-10 shadow shadow-primary'
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
		{ linkName: 'Events', linkTo: '/' },
		{ linkName: 'About', linkTo: '/' },
		{ linkName: 'Contact', linkTo: '/contact' },
	];
	const navAdminData = [
		{ linkName: 'Admin Home', linkTo: '/admin' },
		{ linkName: 'Orders', linkTo: '/admin' },
		//{ linkName: 'Site Settings', linkTo: '/admin/site_settings' },
	];

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	return (
		<div>
			<Banner
				style={
					scrolled ? 'hidden' : pathName !== '/' ? 'bg-gray-300 fixed' : 'fixed'
				}
			/>
			<nav
				className={`fixed flex ${navStyle} left-0 p-2 px-4 w-full h-[4rem] bg-slate-200 justify-center items-center z-50 transition-all duration-200`}
			>
				<div className='flex w-full max-w-[1400px] h-fit items-center justify-between'>
					<div className='flex text-gray-900 items-center'>
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
						className={`hidden lg:flex ${isAdmin() ? 'w-[60%]' : 'w-[40%]'}`}
					>
						<ul
							className={`flex w-full items-center justify-evenly list-none ${
								scrolled || pathName !== '/' ? 'text-gray-600' : 'text-white'
							}`}
						>
							{navData.map((item, index) => (
								<li
									className={`px-3 py-1 btn-ghost hover:bg-opacity-90 cursor-pointer`}
									key={index}
								>
									<Link to={item.linkTo}>{item.linkName}</Link>
								</li>
							))}
							{isAdmin() && <span className='text-2xl'>|</span>}
							{isAdmin() &&
								navAdminData.map((item, index) => (
									<li
										className={`px-3 py-1 btn-ghost hover:bg-opacity-90 cursor-pointer`}
										key={index}
									>
										<Link to={item.linkTo}>{item.linkName}</Link>
									</li>
								))}
						</ul>
					</div>
					<div
						className={`flex items-center gap-x-2  ${
							scrolled || pathName !== '/' ? 'text-gray-600' : 'text-white'
						}`}
					>
						<Link
							to='/user/dashboard'
							className='p-2 btn-ghost font-medium hover:bg-opacity-90 cursor-pointer'
						>
							<FaRegUser className='' size={23} />
						</Link>
						<Link
							to='/user/dashboard#favorites'
							className={`font-medium hover:bg-opacity-90 p-2 ${
								userFavorites.length > 0 ? 'btn-outline py-1' : 'btn-ghost'
							} cursor-pointer`}
						>
							<FaRegHeart className='' size={25} />
							<p
								className={` ${
									userFavorites.length > 0 ? 'block' : 'hidden'
								} text-lg`}
							>
								{userFavorites.length}
							</p>
						</Link>
						<Link
							className={`font-medium hover:bg-opacity-90 p-2 ${
								cartItemsCount() > 0 ? 'btn-outline py-1' : 'btn-ghost'
							} cursor-pointer`}
							to={'/cart'}
						>
							<MdOutlineShoppingCart className='' size={26} />
							<p
								className={` ${
									totalItemsCount > 0 ? 'block' : 'hidden'
								} text-lg`}
							>
								{totalItemsCount}
							</p>
						</Link>
					</div>
				</div>
			</nav>
			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div
					className='fixed inset-0 z-50 bg-primary bg-opacity-75 transition-all duration-300 ease-in-out'
					onClick={toggleMobileMenu}
				>
					<div className='absolute inset-y-0 left-0 top-0 w-64 bg-slate-50 bg-opacity-80 rounded-r-md shadow-lg transition-transform duration-300 ease-in-out'>
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
								className={`font-medium p-2 ${
									userFavorites.length > 0 ? 'btn-outline py-1' : 'btn-ghost'
								} cursor-pointer`}
							>
								<FaRegHeart className='' size={27} />
								<p
									className={`${
										userFavorites.length > 0 ? 'block text-xl' : 'hidden'
									}`}
								>
									{userFavorites.length}
								</p>
							</Link>

							<Link
								to={'/cart'}
								className={`font-medium p-2 ${
									userFavorites.length > 0 ? 'btn-outline py-1' : 'btn-ghost'
								} cursor-pointer`}
							>
								<MdOutlineShoppingCart className='' size={28} />
								<p
									className={` ${
										totalItemsCount > 0 ? 'block' : 'hidden'
									} text-xl`}
								>
									{totalItemsCount}
								</p>
							</Link>
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
