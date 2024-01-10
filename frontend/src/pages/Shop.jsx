import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import getProducts from '../api/products.api.js';
import { MdCheckBox } from 'react-icons/md';
import getSettings from '../api/siteSettings.api.js';

const Shop = () => {
	const [products, setProducts] = useState([]);
	const [collections, setCollections] = useState([]);

	const fetchData = async () => {
		try {
			const fetchedProducts = await getProducts();
			const filteredProducts = fetchedProducts.filter(
				(product) => product.archived === false && product.active === true
			);
			setProducts(filteredProducts);
		} catch (error) {
			console.error('Error fetching products:', error);
		}
	};
	const fetchSettings = async () => {
		try {
			const fetchedSettings = await getSettings();
			setCollections(fetchedSettings.collections);
			//console.log(fetchedSettings);
		} catch (error) {
			console.error('Error fetching products:', error);
		}
	};

	useEffect(() => {
		fetchData();
		fetchSettings();
	}, []);

	return (
		<div className='p-4 mt-[8rem] w-full flex justify-center'>
			<div className='w-full max-w-[1800px]'>
				<div className='flex flex-col justify-center items-center'>
					<h3 className='text-3xl lg:text-4xl'>Our Products</h3>
					<div className='mt-8 gap-4 w-[90%] flex flex-col lg:flex-row items-center justify-between bg-slate-300 p-4 rounded-md'>
						<div className='flex w-full flex-col lg:flex-row items-center justify-between gap-4'>
							<input
								type='text'
								className='p-2.5 lg:w-2/3 input-ghost'
								placeholder='Search...'
							/>
							<select className='p-[.80rem] lg:w-1/3 input-ghost'>
								{collections.map((item, i) => (
									<option key={i}>{item.name}</option>
								))}
							</select>
							<select className='p-[.80rem] w-full lg:w-1/3 input-ghost'>
								<option>Testing</option>
								<option>Testing</option>
								<option>Testing</option>
							</select>
							<label className='flex lg:w-1/3 gap-2 text-lg items-center'>
								<input
									className='w-6 h-6 lg:w-5 lg:h-5 text-secondary'
									type='checkbox'
									onChange=''
								/>
								On Sale Only
							</label>
						</div>
						<div className='flex w-full lg:w-[35%] justify-between lg:justify-end gap-2 items-center'>
							<button className='btn-outline px-2 py-1.5'>Clear Filters</button>
							<button className='btn'>Search</button>
						</div>
					</div>
					<div className='mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-[90%]'>
						<ProductCard products={products} numProducts={10} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Shop;
