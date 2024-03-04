import React, { useState, useEffect, useRef } from 'react';
import Hero from '../components/home/Hero';
import LoadingModal from '../components/LoadingModal';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { useLocation } from 'react-router-dom';
import getProducts from '../api/products.api';
import { useUser } from '../context/UserContext';

const Home = () => {
	const API_URL = import.meta.env.VITE_SERVER_API_URL;

	const [newArrivals, setNewArrivals] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showLeftArrow, setShowLeftArrow] = useState(false);
	const [showRightArrow, setShowRightArrow] = useState(true);
	const [showScrollTip, setShowScrollTip] = useState(true);

	const { userRole } = useUser();

	const location = useLocation();

	const getNewArrivals = async () => {
		try {
			const products = await getProducts();
			// Filter products where active is true and archived is false
			const filteredProducts = products.filter(
				(product) =>
					product.active === true &&
					product.archived === false &&
					product.type.toLowerCase() !== 'test'
			);

			// Sort filtered products based on the create date in descending order
			const sortedProducts = filteredProducts.sort((a, b) => {
				const dateA = new Date(a.createdAt);
				const dateB = new Date(b.createdAt);
				return dateB.getTime() - dateA.getTime();
			});

			const limitedProducts = sortedProducts.slice(0, 9);

			setNewArrivals(limitedProducts);
		} catch (error) {
			console.error(error);
		}
	};

	// Create a ref for the scrollable container
	const scrollRef = useRef(null);

	// Scroll left function
	const scrollLeft = () => {
		if (scrollRef.current) {
			scrollRef.current.scrollBy({
				left: -scrollRef.current.offsetWidth,
				behavior: 'smooth',
			});
		}
	};

	// Scroll right function
	const scrollRight = () => {
		if (scrollRef.current) {
			scrollRef.current.scrollBy({
				left: scrollRef.current.offsetWidth,
				behavior: 'smooth',
			});
		}
	};

	useEffect(() => {
		setLoading(true);
		getNewArrivals();
		window.scrollTo(0, 0); // Ensure the window scrolls to the top on load

		// Function to hide scroll tip on actual scroll
		const onScroll = () => {
			// Hide the scroll tip once there's actual user-initiated scrolling
			setShowScrollTip(false);

			// Then remove the event listener, assuming you only want to show the tip until the first scroll
			if (scrollRef.current) {
				scrollRef.current.removeEventListener('scroll', onScroll);
			}
		};

		const checkScrollPosition = () => {
			if (scrollRef.current) {
				const isAtLeft = scrollRef.current.scrollLeft === 0;
				const isAtRight =
					scrollRef.current.scrollLeft + scrollRef.current.offsetWidth >=
					scrollRef.current.scrollWidth;

				setShowLeftArrow(!isAtLeft);
				setShowRightArrow(!isAtRight);
				if (isAtLeft) {
					setShowRightArrow(true);
				}
			}
		};

		// Initially show the scroll tip
		setShowScrollTip(true);

		// Check initial position and setup event listener for future scrolls
		if (scrollRef.current) {
			scrollRef.current.addEventListener('scroll', onScroll);
			scrollRef.current.addEventListener('scroll', checkScrollPosition);
			checkScrollPosition();
		}

		// Cleanup function to remove the event listener
		return () => {
			if (scrollRef.current) {
				scrollRef.current.removeEventListener('scroll', checkScrollPosition);
			}
		};
	}, []); // Dependencies are omitted for brevity, include them as needed

	useEffect(() => {
		newArrivals && newArrivals.length > 0 ? setLoading(false) : null;
	}, [newArrivals]);

	return (
		<div>
			<LoadingModal loading={loading} />
			<Hero />
			<div className='w-full p-4 flex justify-center'>
				<div className='w-full max-w-[1400px] flex flex-col'>
					{/* Links to new products */}
					<div className='relative w-full py-4 flex flex-col items-center justify-center'>
						<h3 className='text-3xl lg:text-4xl'>
							<span className='text-primary'>New Arrivals</span>
						</h3>
						<button
							className={`hidden lg:block absolute top-[50%] -left-6 bg-primary bg-opacity-75 px-4 py-4 text-white text-3xl rounded-full ${
								showLeftArrow ? 'lg:opacity-75 z-20' : 'lg:opacity-0 -z-10'
							} transition-opacity duration-500`}
							onClick={scrollLeft}
						>
							<FaArrowLeft />
						</button>
						<div
							ref={scrollRef}
							className='mt-8 overflow-x-auto snap-mandatory snap-x flex gap-8 w-full h-[500px] rounded-md'
						>
							<div className='pt-4 flex gap-8 z-10'>
								{newArrivals.map((product, idx) => (
									<div
										className='snap-center'
										key={product.name + ' count ' + idx}
									>
										<ProductCard product={product} />
									</div>
								))}
							</div>
						</div>
						<div
							className={`${
								showScrollTip ? 'flex' : 'hidden'
							} space-x-8 items-center lg:hidden absolute top-[15%] px-8 py-4 bg-primary text-white bg-opacity-50 z-20 text-2xl rounded-xl`}
						>
							<p>Swipe</p>
							<FaArrowRight />
						</div>
						<button
							className={`hidden lg:block absolute top-[50%] -right-6 bg-primary bg-opacity-75 px-4 py-4 text-white text-3xl rounded-full ${
								showRightArrow ? 'lg:opacity-75 z-20' : 'lg:opacity-0 -z-10'
							} transition-opacity duration-500`}
							onClick={scrollRight}
						>
							<FaArrowRight />
						</button>
					</div>
					{/* <div>Testing</div> */}
				</div>
			</div>
		</div>
	);
};

export default Home;
