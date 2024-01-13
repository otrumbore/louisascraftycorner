import React, { useState, useEffect } from 'react';
import Hero from '../components/home/Hero';
import LoadingModal from '../components/LoadingModal';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useLocation } from 'react-router-dom';

const Home = () => {
	const API_URL = import.meta.env.VITE_SERVER_API_URL;
	//const API_URL = process.env.VITE_SERVER_API_URL;

	const [newArrivals, setNewArrivals] = useState([]);
	const [loading, setLoading] = useState(false);

	const location = useLocation();

	useEffect(() => {
		setLoading(true);
		axios
			.get(`${API_URL}/api/products`)
			.then((response) => {
				setNewArrivals(response.data.data);
				//setLoading(false);
				//console.log(response.data.data);
			})
			.catch((error) => {
				console.log(error);
				setLoading(false);
			});

		window.scroll(0, 0);
	}, []);

	useEffect(() => {
		console.log(newArrivals);
		newArrivals.length > 0 && setLoading(false);
	}, [newArrivals]);

	return (
		<div>
			<LoadingModal loading={loading} />
			<Hero />
			<div className='w-full p-4 flex justify-center'>
				<div className='w-full max-w-[1400px] flex'>
					{/* Links to new products */}
					<div className='w-full py-4 flex flex-col items-center justify-center'>
						<h3 className='text-3xl lg:text-4xl'>
							<span className='text-[#b8860b]'>New Christmas Arrivals</span>
						</h3>
						{/* <p>Newest Christmas Products:</p> */}
						<div className='mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 w-[90%]'>
							<ProductCard numProducts={3} products={newArrivals} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
