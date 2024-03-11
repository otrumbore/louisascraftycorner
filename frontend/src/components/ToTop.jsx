import React, { useState, useEffect } from 'react';
import { FaArrowTurnUp } from 'react-icons/fa6';

const ToTop = () => {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;
			setIsScrolled(scrollY > 0);
		};
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	return (
		<div
			className={`fixed right-4 bottom-4 rounded-full p-4 bg-dark_secondary text-white ${
				isScrolled ? 'z-10 opacity-50' : '-z-10 opacity-0'
			} cursor-pointer hover:opacity-100 transition-opacity duration-700`}
			onClick={scrollToTop}
		>
			<FaArrowTurnUp size={30} />
		</div>
	);
};

export default ToTop;
