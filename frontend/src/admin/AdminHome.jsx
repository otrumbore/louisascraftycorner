import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingModal from './components/LoadingModal';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import ProductsTable from './components/home/ProductsTable';
import ProductCard from './components/home/ProductCard';

const AdminHome = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showType, setShowType] = useState('table');

	useEffect(() => {
		setLoading(true);
		axios
			.get('http://10.0.0.85:5555/products')
			.then((response) => {
				setProducts(response.data.data);
				setLoading(false);
			})
			.catch((error) => {
				console.log(error);
				setLoading(false);
			});
	}, []);
	return (
		<div className='p-4'>
			{/* <div className='flex justify-center items-center gap-x-4'>
				<button
					className='bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg'
					onClick={() => setShowType('table')}
				>
					Table Layout
				</button>
				<button
					className='bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg'
					onClick={() => setShowType('card')}
				>
					Card Layout
				</button>
			</div> */}
			<div className='flex justify-end items-center gap-x-4'>
				<span>Hello {'Odnel Trumbore'}</span>
				<button className='bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg'>
					Logout
				</button>
			</div>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl my-8'>Products List</h1>
				<Link to='/admin/addproduct'>
					<MdOutlineAddBox className='text-sky-800 text-3xl' />
				</Link>
			</div>
			{loading ? (
				<LoadingModal loading={loading} />
			) : showType === 'table' && products.length > 0 ? (
				<ProductsTable products={products} />
			) : (
				<div className='w-full text-center'>No products in store</div>
			)}
		</div>
	);
};

export default AdminHome;
