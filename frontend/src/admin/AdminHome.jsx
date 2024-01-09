import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingModal from '../components/LoadingModal';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import ProductsTable from './components/dashboard/ProductsTable';
import { LOCALIP } from '../config';
import { useUser } from '../context/UserContext';
import Cookies from 'js-cookie';

const AdminHome = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showType, setShowType] = useState('table');
	const navigate = useNavigate();
	const { userDetails, isAdmin } = useUser();

	useEffect(() => {
		const checkUser = async () => {
			try {
				const token = Cookies.get('token');
				if (token) {
					!isAdmin() && navigate('/user/dashboard');
					return;
				}
				navigate('/login');
			} catch (error) {
				console.error('Admin user: ', error.message);
				navigate('/');
			}
		};

		checkUser();

		setLoading(true);
		axios
			.get(`http://${LOCALIP}:5555/products`)
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
		<div className='p-4 mt-[8rem]'>
			<LoadingModal loading={loading} />
			<div className='flex w-full justify-center'>
				<h1 className='text-3xl lg:text-4xl'>Admin Home</h1>
			</div>

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
			<div className='hidden lg:flex justify-end items-center gap-x-4'>
				<span>Hello {userDetails.name}</span>
			</div>
			<div className='flex flex-col lg:flex-row justify-between items-center'>
				<h1 className='text-2xl my-8'>Products List</h1>
				<Link className='btn-outline' to='/beta_admin'>
					Admin Dashboard (Beta)
				</Link>
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
