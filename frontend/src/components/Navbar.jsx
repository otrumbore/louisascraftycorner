import React, { useState, useEffect } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoIosSearch } from 'react-icons/io';
import { FaRegUser } from 'react-icons/fa6';
import Banner from './Banner';
import { MdOutlineShoppingCart } from 'react-icons/md';

const Navbar = () => {
	const [scrolled, setScrolled] = useState(false);
	const [navStyle, setNavStyle] = useState('bg-opacity-0 glass top-12');

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
		{ linkName: 'Home' },
		{ linkName: 'Shop' },
		{ linkName: 'Events' },
		{ linkName: 'About' },
		{ linkName: 'Contact' },
	];
	return (
		<div>
			<Banner style={scrolled ? 'hidden' : 'fixed'} />
			<div
				className={`fixed flex ${navStyle} left-0 p-2 px-4 w-full h-[6vh] bg-gray-200 justify-center items-center`}
			>
				<div className='flex w-full max-w-[1200px] h-fit items-center justify-between'>
					<div className='flex text-gray-600'>
						<RxHamburgerMenu className='lg:hidden mr-4 ' size={30} />
						<div className='border-2 rounded-md border-gray-600 px-2'>Logo</div>
					</div>
					<div className='hidden lg:flex w-[50%] ml-16'>
						<ul className='flex text-gray-800 w-full items-center justify-evenly'>
							{navData.map((item, index) => (
								<li key={index}>{item.linkName}</li>
							))}
						</ul>
					</div>
					<div className='flex items-center gap-x-4 text-gray-600'>
						<IoIosSearch size={31} />
						<FaRegUser size={25} />
						<MdOutlineShoppingCart size={29} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
