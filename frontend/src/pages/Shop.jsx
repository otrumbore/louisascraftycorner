import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import getProducts from '../api/products.api.js';
import { MdCheckBox, MdClose } from 'react-icons/md';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import getSettings from '../api/siteSettings.api.js';
import LoadingModal from '../components/LoadingModal.jsx';
import { useUser } from '../context/UserContext.jsx';

const Shop = () => {
	const [products, setProducts] = useState([]);
	const [allProducts, setAllProducts] = useState([]);
	const [collections, setCollections] = useState([]);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [productsPerPage] = useState(9);
	const [searchText, setSearchText] = useState('');
	const [selectedCollection, setSelectedCollection] = useState('');
	const [onSaleOnly, setOnSaleOnly] = useState(false);
	const { userRole } = useUser();

	const fetchData = async () => {
		setLoading(true);
		try {
			const fetchedProducts = await getProducts();

			// Filter products based on search criteria
			const filteredProducts = fetchedProducts.filter((product) => {
				// Additional filters to exclude archived and inactive products
				const excludeArchived = product.archived !== true;
				const excludeInactive = product.active !== false;
				const excludeTest = product.type !== 'Test' && product.type !== 'test';

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
					excludeTest &&
					matchesSearch &&
					matchesCollection &&
					matchesOnSale
				);
			});

			const indexOfLastProduct = currentPage * productsPerPage;
			const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
			const currentProducts = filteredProducts.slice(
				indexOfFirstProduct,
				indexOfLastProduct
			);
			setAllProducts(filteredProducts);
			setProducts(currentProducts);
		} catch (error) {
			console.error('Error fetching products:', error);
		} finally {
			setLoading(false);
		}
	};

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	const fetchSettings = async () => {
		try {
			const fetchedSettings = await getSettings();
			setCollections(fetchedSettings.collections);
		} catch (error) {
			console.error('Error fetching products:', error);
		}
	};

	const handleSearchChange = (event) => {
		setCurrentPage(1);
		setSearchText(event.target.value);
	};

	const handleCollectionChange = (event) => {
		setCurrentPage(1);
		setSelectedCollection(event.target.value);
	};

	const handleOnSaleChange = (event) => {
		setCurrentPage(1);
		setOnSaleOnly(event.target.checked);
	};

	const clearFilters = () => {
		setSearchText('');
		setSelectedCollection('');
		setOnSaleOnly(false);
		setCurrentPage(1);
	};

	const handleKeyDown = (event) => {
		//setCurrentPage(1);
		if (event.key === 'Enter') {
			fetchData();
		}
	};

	useEffect(() => {
		const fetchFilteredData = async () => {
			await fetchData();
		};

		if (searchText === '' && selectedCollection === '' && !onSaleOnly) {
			// If all filters are cleared, fetch all products immediately
			fetchFilteredData();
		}
		window.scroll(0, 0);
	}, [
		searchText,
		selectedCollection,
		onSaleOnly,
		currentPage,
		productsPerPage,
	]);

	// useEffect(() => {
	// 	fetchData();
	// }, [searchText, selectedCollection, onSaleOnly]);

	useEffect(() => {
		fetchData();
		fetchSettings();
		window.scroll(0, 0);
	}, []);

	const pageNumbers = [];
	for (let i = 1; i <= Math.ceil(allProducts.length / productsPerPage); i++) {
		pageNumbers.push(i);
	}

	return (
		<div className='p-4 mt-[8rem] w-full flex justify-center'>
			{/* <LoadingModal loading={loading} /> */}
			<div className='w-full max-w-[1800px]'>
				<div className='flex flex-col justify-center items-center'>
					<h3 className='text-3xl lg:text-4xl'>Lets get shopping...</h3>
					<div className='mt-8 gap-4 w-[90%] flex flex-col lg:flex-row items-center justify-between bg-slate-300 p-4 rounded-md'>
						<div className='flex w-full flex-col lg:flex-row items-center justify-between gap-4'>
							<div className='relative w-full lg:w-[30%] focus-within:w-full focus-within:transform ease-in-out duration-700'>
								<input
									type='text'
									className='p-2.5 input-ghost w-full'
									placeholder='Search...'
									value={searchText}
									onChange={handleSearchChange}
									onKeyDown={handleKeyDown}
								/>
								{searchText && (
									<MdClose
										size={30}
										className='absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer'
										onClick={() => setSearchText('')} // Reset the searchText on close icon click
									/>
								)}
							</div>

							<select
								className='p-[.80rem] w-full lg:min-w-fit lg:max-w-[20%] input-ghost'
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
								className='p-[.80rem] w-full lg:min-w-fit lg:max-w-[20%] input-ghost'
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
							<button onClick={() => fetchData()} className='btn'>
								Search
							</button>
						</div>
					</div>
					{/* <div className='mt-4'>Results: {products.length}</div> */}
					<div
						className={`mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-[90%]`}
					>
						{loading &&
							Array.from({ length: 6 }).map((_, index) => (
								<div
									key={index}
									className='border-4 border-primary shadow rounded-lg w-full mx-auto'
								>
									<div className='animate-pulse flex flex-col space-y-4'>
										<div className='rounded-md bg-slate-700 h-64 w-full'></div>
										<div className='p-4 flex-1 space-y-6 py-1'>
											<div className='h-6 bg-slate-700 rounded'></div>
											<div className='space-y-3'>
												<div className='grid grid-cols-3 gap-4'>
													<div className='h-2 bg-slate-700 rounded col-span-2'></div>
													<div className='h-2 bg-slate-700 rounded col-span-1'></div>
												</div>
												<div className='h-2 bg-slate-700 rounded'></div>
											</div>
											<div className='flex justify-between items-center'>
												<div className='h-6 w-20 bg-slate-700 rounded'></div>
												<div className='h-10 w-24 bg-slate-700 rounded'></div>
											</div>
										</div>
									</div>
								</div>
							))}
						{!loading && products.length > 0 ? (
							<ProductCard products={products} numProducts={productsPerPage} />
						) : (
							<div className='flex w-full justify-center'>
								<h3 className='text-2xl'>No products found...😔</h3>
							</div>
						)}
					</div>
					{/* Pagination */}
					<div className='w-full flex justify-center items-center mt-12'>
						<div className='px-4 grid max-w-[1450px] grid-cols-2 lg:grid-cols-3 w-full gap-y-6'>
							<div className='flex items-center mt-4'>
								Page {currentPage} of {pageNumbers.length}
							</div>
							<div className='mt-4 flex items-center justify-end lg:justify-center'>
								Results: {products.length}
							</div>
							<ul className='flex items-center justify-center col-span-2 lg:col-span-1 lg:justify-end gap-2'>
								{currentPage > 1 && (
									<li className=''>
										<button
											onClick={() => paginate(currentPage - 1)}
											className='btn-outline px-2'
										>
											<FaChevronLeft size={25} />
										</button>
									</li>
								)}

								{pageNumbers.map((number) => (
									<li
										key={number}
										//className={}
									>
										<button
											onClick={() => paginate(number)}
											className={` text-lg ${
												number === currentPage
													? 'btn px-4'
													: 'btn-ghost py-2 px-4'
											}`}
										>
											{number}
										</button>
									</li>
								))}

								{currentPage < pageNumbers.length && (
									<li className=''>
										<button
											onClick={() => paginate(currentPage + 1)}
											className='btn-outline px-2'
										>
											<FaChevronRight className='text-2xl' />
										</button>
									</li>
								)}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Shop;
