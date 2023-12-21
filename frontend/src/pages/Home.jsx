import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import LoadingModal from '../admin/components/LoadingModal';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
	const [newArrivals, setNewArrivals] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		axios
			.get('http://10.0.0.85:5555/products')
			.then((response) => {
				setNewArrivals(response.data.data);
				setLoading(false);
			})
			.catch((error) => {
				console.log(error);
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		console.log(newArrivals);
		newArrivals.length > 0 && setLoading(false);
	}, [newArrivals]);

	return (
		<div>
			{loading && <LoadingModal loading={loading} />}
			<Hero />
			<div className='w-full p-4 flex justify-center'>
				<div className='w-full max-w-[1400px] flex'>
					{/* Links to new products */}
					<div className='w-full py-4 flex flex-col items-center justify-center'>
						<h3 className='text-3xl lg:text-4xl'>
							<span className='text-red-600'>New </span>
							<span className='text-green-600'>Christmas </span>
							<span className='text-red-600'>Arrivals</span>
						</h3>
						{/* <p>Newest Christmas Products:</p> */}
						<ProductCard numProducts={6} products={newArrivals} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
