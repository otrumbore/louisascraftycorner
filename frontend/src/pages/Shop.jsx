import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import getProducts from '../api/products.api.js';
import { MdCheckBox } from 'react-icons/md';
import getSettings from '../api/siteSettings.api.js';
import LoadingModal from '../components/LoadingModal.jsx';

const Shop = () => {
	const [products, setProducts] = useState([]);
	const [collections, setCollections] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [selectedCollection, setSelectedCollection] = useState('');
	const [onSaleOnly, setOnSaleOnly] = useState(false);

	const fetchData = async () => {
		setLoading(true);
		try {
			const fetchedProducts = await getProducts();

			// Filter products based on search criteria
			const filteredProducts = fetchedProducts.filter((product) => {
				// Additional filters to exclude archived and inactive products
				const excludeArchived = product.archived !== true;
				const excludeInactive = product.active !== false;

				const isNumericSearch = !isNaN(searchText);

				const matchesSearch =
					searchText === '' ||
					(isNumericSearch
						? product.storeId === parseInt(searchText)
						: product.name.toLowerCase().includes(searchText.toLowerCase()) ||
						  product.description
								.toLowerCase()
								.includes(searchText.toLowerCase()) ||
						  product.tags.toLowerCase().includes(searchText.toLowerCase()) ||
						  product.category
								.toLowerCase()
								.includes(searchText.toLowerCase()) ||
						  product.type.toLowerCase().includes(searchText.toLowerCase()));

				const matchesCollection =
					!selectedCollection || product.collection === selectedCollection;

				const matchesOnSale = onSaleOnly ? product.sale > 0 : true;

				// Apply all filters
				return (
					excludeArchived &&
					excludeInactive &&
					matchesSearch &&
					matchesCollection &&
					matchesOnSale
				);
			});

			setProducts(filteredProducts);
		} catch (error) {
			console.error('Error fetching products:', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchSettings = async () => {
		try {
			const fetchedSettings = await getSettings();
			setCollections(fetchedSettings.collections);
		} catch (error) {
			console.error('Error fetching products:', error);
		}
	};

	const handleSearchChange = (event) => {
		setSearchText(event.target.value);
	};

	const handleCollectionChange = (event) => {
		setSelectedCollection(event.target.value);
	};

	const handleOnSaleChange = (event) => {
		setOnSaleOnly(event.target.checked);
	};

	const clearFilters = () => {
		setSearchText('');
		setSelectedCollection('');
		setOnSaleOnly(false);
	};

	useEffect(() => {
		const fetchFilteredData = async () => {
			await fetchData();
		};

		if (searchText === '' && selectedCollection === '' && !onSaleOnly) {
			// If all filters are cleared, fetch all products immediately
			fetchFilteredData();
		}
	}, [searchText, selectedCollection, onSaleOnly]);

	// useEffect(() => {
	// 	fetchData();
	// }, [searchText, selectedCollection, onSaleOnly]);

	useEffect(() => {
		fetchData();
		fetchSettings();
		window.scroll(0, 0);
	}, []);

	return (
		<div className='p-4 mt-[8rem] w-full flex justify-center'>
			<LoadingModal loading={loading} />
			<div className='w-full max-w-[1800px]'>
				<div className='flex flex-col justify-center items-center'>
					<h3 className='text-3xl lg:text-4xl'>Our Products</h3>
					<div className='mt-8 gap-4 w-[90%] flex flex-col lg:flex-row items-center justify-between bg-slate-300 p-4 rounded-md'>
						<div className='flex w-full flex-col lg:flex-row items-center justify-between gap-4'>
							<input
								type='text'
								className='p-2.5 input-ghost'
								placeholder='Search...'
								value={searchText}
								onChange={handleSearchChange}
							/>
							<select
								className='p-[.80rem] w-full lg:max-w-fit input-ghost'
								value={selectedCollection}
								onChange={handleCollectionChange}
							>
								<option value=''>All Collections</option>
								{collections.map((item, i) => (
									<option key={i} value={item.name}>
										{item.name}
									</option>
								))}
							</select>
							<select
								className='p-[.80rem] w-full lg:max-w-fit input-ghost'
								//value={}
								//onChange={/* your corresponding handler */}
							>
								<option>All Types</option>
								<option>Testing</option>
								<option>Testing</option>
							</select>
							<label className='flex lg:w-1/3 gap-2 text-lg items-center'>
								<input
									className='w-6 h-6 lg:w-5 lg:h-5 text-secondary'
									type='checkbox'
									checked={onSaleOnly}
									onChange={handleOnSaleChange}
								/>
								Sales
							</label>
						</div>
						<div className='flex w-full lg:w-[35%] justify-between lg:justify-end gap-2 items-center'>
							<button
								onClick={() => {
									clearFilters();
									//fetchFilteredData();
								}}
								className='btn-outline px-2 py-1.5'
							>
								Clear Filters
							</button>
							<button
								onClick={() => {
									//clearFilters();
									fetchData();
								}}
								className='btn'
							>
								Search
							</button>
						</div>
					</div>
					<div
						className={`mt-12 ${
							products.length > 0 &&
							'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
						} w-[90%]`}
					>
						{products.length > 0 ? (
							<ProductCard products={products} numProducts={20} />
						) : (
							loading && (
								<div className='flex w-full justify-center'>
									<h3 className='text-2xl'>No products found...😔</h3>
								</div>
							)
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Shop;
