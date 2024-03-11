import React, { useState, useEffect, useRef } from 'react';
import Hero from '../components/home/Hero';
import LoadingModal from '../components/LoadingModal';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { useLocation } from 'react-router-dom';
import getProducts from '../api/products.api';
import { useUser } from '../context/UserContext';
import { getPageData } from '../api/pages.api';

const Home = () => {
	const API_URL = import.meta.env.VITE_SERVER_API_URL;

	const [newArrivals, setNewArrivals] = useState([]);
	const [saleProducts, setSaleProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [arrivalsShowLeftArrow, setArrivalsShowLeftArrow] = useState(false);
	const [arrivalsShowRightArrow, setArrivalsShowRightArrow] = useState(true);
	const [salesShowLeftArrow, setSalesShowLeftArrow] = useState(false);
	const [salesShowRightArrow, setSalesShowRightArrow] = useState(true);
	const [showScrollTip, setShowScrollTip] = useState(true);
	const [heroData, setHeroData] = useState([]);

	const { userRole } = useUser();

	const location = useLocation();

	const getHomePageData = async () => {
		try {
			const homeData = await getPageData('home');
			setHeroData(homeData.content);
		} catch (error) {}
	};

	const fetchProducts = async () => {
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
			const sortedNewProducts = filteredProducts.sort((a, b) => {
				const dateA = new Date(a.createdAt);
				const dateB = new Date(b.createdAt);
				return dateB.getTime() - dateA.getTime();
			});

			const limitedNewProducts = sortedNewProducts.slice(0, 9);

			setNewArrivals(limitedNewProducts);

			const saleOnlyProducts = sortedNewProducts.filter(
				(product) => product.sale > 0
			);

			const limitedSaleProducts = saleOnlyProducts.slice(0, 9);

			setSaleProducts(limitedSaleProducts);
		} catch (error) {
			console.error(error);
		}
	};

	// Create a ref for the scrollable container
	const newArrivalsRef = useRef(null);
	const salesRef = useRef(null);

	const scrollDirection = (ref, direction) => {
		if (ref === 'newArrivals') {
			if (direction === 'left') {
				if (newArrivalsRef.current) {
					newArrivalsRef.current.scrollBy({
						left: -newArrivalsRef.current.offsetWidth,
						behavior: 'smooth',
					});
				}
			} else {
				if (newArrivalsRef.current) {
					newArrivalsRef.current.scrollBy({
						left: newArrivalsRef.current.offsetWidth,
						behavior: 'smooth',
					});
				}
			}
		} else {
			if (direction === 'left') {
				if (salesRef.current) {
					salesRef.current.scrollBy({
						left: -salesRef.current.offsetWidth,
						behavior: 'smooth',
					});
				}
			} else {
				if (salesRef.current) {
					salesRef.current.scrollBy({
						left: salesRef.current.offsetWidth,
						behavior: 'smooth',
					});
				}
			}
		}
	};

	useEffect(() => {
		setLoading(true);
		fetchProducts();
		getHomePageData();
		window.scrollTo(0, 0);

		const onScroll = () => {
			setShowScrollTip(false);

			if (newArrivalsRef.current && salesRef.current) {
				newArrivalsRef.current.removeEventListener('scroll', onScroll);
				salesRef.current.removeEventListener('scroll', onScroll);
			}
		};

		const checkScrollPosition = () => {
			if (newArrivalsRef.current && salesRef.current) {
				const arrivalsIsAtLeft = newArrivalsRef.current.scrollLeft === 0;
				const arrivalsIsAtRight =
					newArrivalsRef.current.scrollLeft +
						newArrivalsRef.current.offsetWidth >=
					newArrivalsRef.current.scrollWidth;

				const salesIsAtLeft = salesRef.current.scrollLeft === 0;
				const salesIsAtRight =
					salesRef.current.scrollLeft + salesRef.current.offsetWidth >=
					salesRef.current.scrollWidth;

				setSalesShowLeftArrow(!salesIsAtLeft);
				setSalesShowRightArrow(!salesIsAtRight);
				setArrivalsShowLeftArrow(!arrivalsIsAtLeft);
				setArrivalsShowRightArrow(!arrivalsIsAtRight);

				if (arrivalsIsAtLeft) {
					setArrivalsShowRightArrow(true);
				}
				if (salesIsAtLeft) {
					setSalesShowRightArrow(true);
				}
			}
		};

		setShowScrollTip(true);

		if (newArrivalsRef.current && salesRef.current) {
			newArrivalsRef.current.addEventListener('scroll', onScroll);
			newArrivalsRef.current.addEventListener('scroll', checkScrollPosition);
			salesRef.current.addEventListener('scroll', onScroll);
			salesRef.current.addEventListener('scroll', checkScrollPosition);
			checkScrollPosition();
		}

		return () => {
			if (newArrivalsRef.current && salesRef.current) {
				newArrivalsRef.current.removeEventListener(
					'scroll',
					checkScrollPosition
				);
				salesRef.current.removeEventListener('scroll', checkScrollPosition);
			}
		};
	}, []);

	useEffect(() => {
		newArrivals && newArrivals.length > 0 ? setLoading(false) : null;
	}, [newArrivals]);

	return (
		<div>
			<LoadingModal loading={loading} />
			{heroData.length > 0 ? <Hero data={heroData} /> : null}
			<div className='w-full p-4 flex justify-center'>
				<div className='w-full max-w-[1500px] flex flex-col'>
					{/* Links to new products */}
					<div className='relative w-full py-4 flex flex-col items-center justify-center'>
						<h3 className='text-3xl lg:text-4xl'>
							<span className='text-dark_secondary'>New Arrivals</span>
						</h3>
						<button
							className={`hidden lg:block absolute top-[50%] -left-6 bg-dark_secondary bg-opacity-75 px-4 py-4 text-white text-3xl rounded-full ${
								arrivalsShowLeftArrow
									? 'lg:bg-opacity-50 lg:hover:bg-opacity-90 z-20'
									: 'lg:opacity-0 -z-10'
							} transition-bg-opacity duration-500`}
							onClick={() => scrollDirection('newArrivals', 'left')}
						>
							<FaArrowLeft />
						</button>
						<div
							ref={newArrivalsRef}
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
							} space-x-8 items-center lg:hidden absolute top-[15%] px-8 py-4 bg-dark_secondary text-white bg-opacity-50 z-20 text-2xl rounded-xl`}
						>
							<p>Swipe</p>
							<FaArrowRight />
						</div>
						<button
							className={`hidden lg:block absolute top-[50%] -right-6 bg-dark_secondary bg-opacity-75 px-4 py-4 text-white text-3xl rounded-full ${
								arrivalsShowRightArrow
									? 'lg:bg-opacity-50 lg:hover:bg-opacity-90 z-20'
									: 'lg:opacity-0 -z-10'
							} transition-bg-opacity duration-300`}
							onClick={() => scrollDirection('newArrivals', 'right')}
						>
							<FaArrowRight />
						</button>
					</div>
					<div className='relative w-full py-4 flex flex-col items-center justify-center'>
						<h3 className='text-3xl lg:text-4xl'>
							<span className='text-dark_secondary'>Sale Items</span>
						</h3>
						<button
							className={`hidden lg:block absolute top-[50%] -left-6 bg-dark_secondary bg-opacity-75 px-4 py-4 text-white text-3xl rounded-full ${
								salesShowLeftArrow
									? 'lg:bg-opacity-50 lg:hover:bg-opacity-90 z-20'
									: 'lg:opacity-0 -z-10'
							} transition-bg-opacity duration-500`}
							onClick={() => scrollDirection('sales', 'left')}
						>
							<FaArrowLeft />
						</button>
						<div
							ref={salesRef}
							className='mt-8 overflow-x-auto snap-mandatory snap-x flex gap-8 w-full h-[500px] rounded-md'
						>
							<div className='pt-4 flex gap-8 z-10'>
								{saleProducts.map((product, idx) => (
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
							} space-x-8 items-center lg:hidden absolute top-[15%] px-8 py-4 bg-dark_secondary text-white bg-opacity-50 z-20 text-2xl rounded-xl`}
						>
							<p>Swipe</p>
							<FaArrowRight />
						</div>
						<button
							className={`hidden lg:block absolute top-[50%] -right-6 bg-dark_secondary bg-opacity-75 px-4 py-4 text-white text-3xl rounded-full ${
								salesShowRightArrow
									? 'lg:bg-opacity-50 lg:hover:bg-opacity-90 z-20'
									: 'lg:opacity-0 -z-10'
							} transition-bg-opacity duration-300`}
							onClick={() => scrollDirection('sales', 'right')}
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
