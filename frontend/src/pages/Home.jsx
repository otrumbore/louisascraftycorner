import React, { useState, useEffect } from 'react';
import Hero from '../components/home/Hero';
import LoadingModal from '../components/LoadingModal';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useLocation } from 'react-router-dom';
import getProducts from '../api/products.api';

const Home = () => {
	const API_URL = import.meta.env.VITE_SERVER_API_URL;
	//const API_URL = process.env.VITE_SERVER_API_URL;

	const [newArrivals, setNewArrivals] = useState([]);
	const [loading, setLoading] = useState(false);

	const location = useLocation();

	const getNewArivals = async () => {
		try {
			const products = await getProducts();
			// Sort products based on the create date in descending order
			const sortedProducts = products.sort((a, b) => {
				const dateA = new Date(a.createdAt);
				const dateB = new Date(b.createdAt);
				return dateB - dateA;
			});

			setNewArrivals(sortedProducts);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		setLoading(true);
		// axios
		// 	.get(`${API_URL}/api/products`)
		// 	.then((response) => {
		// 		setNewArrivals(response.data.data);
		// 		//setLoading(false);
		// 		console.log(response.data.data);
		// 	})
		// 	.catch((error) => {
		// 		console.log(error + ' api failure');
		// 		setLoading(false);
		// 	});
		getNewArivals();
		window.scroll(0, 0);
	}, []);

	useEffect(() => {
		//console.log(newArrivals);
		newArrivals && newArrivals.length > 0 ? setLoading(false) : null;
		//setLoading(false);
	}, [newArrivals]);

	return (
		<div>
			<LoadingModal loading={loading} />
			<Hero />
			<div className='w-full p-4 flex justify-center'>
				<div className='w-full max-w-[1600px] flex'>
					{/* Links to new products */}
					<div className='w-full py-4 flex flex-col items-center justify-center'>
						<h3 className='text-3xl lg:text-4xl'>
							<span className='text-primary'>New Arrivals</span>
						</h3>
						{/* <p>Newest Christmas Products:</p> */}
						<div className='mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 w-[100%]'>
							<ProductCard numProducts={3} products={newArrivals} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
