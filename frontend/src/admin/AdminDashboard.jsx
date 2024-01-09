import React, { useEffect, useState } from 'react';
import {
	MdAttachMoney,
	MdOutlineHome,
	MdOutlinePriceCheck,
	MdOutlineSettings,
	MdOutlineNotificationsNone,
} from 'react-icons/md';
import { TbBrandMinecraft } from 'react-icons/tb';
import { IoIosPricetag } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import Orders from './components/dashboard/Orders';
import Cookies from 'js-cookie';
import { useUser } from '../context/UserContext';
import Products from './components/dashboard/Products';

const AdminDashboard = () => {
	const { isAdmin } = useUser();
	const navigate = useNavigate();

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
	}, []);

	const [dashView, setDashView] = useState('home');
	return (
		<div className='p-8 mt-[8rem] w-full'>
			<div className='flex flex-col lg:flex-row w-full items-center justify-between'>
				<h2 className='text-2xl font-bold'>Admin Home</h2>
				<div className='flex mt-8 lg:mt-0 gap-4'>
					<button
						onClick={() => {
							setDashView('home');
						}}
						className={`${dashView === 'home' ? 'btn' : 'btn-outline'} px-2`}
					>
						<MdOutlineHome size={30} />
					</button>
					<button
						onClick={() => {
							setDashView('orders');
						}}
						className={`${dashView === 'orders' ? 'btn' : 'btn-outline'} px-2`}
					>
						<MdOutlinePriceCheck size={30} />
					</button>
					<button
						onClick={() => {
							setDashView('products');
						}}
						className={`${
							dashView === 'products' ? 'btn' : 'btn-outline'
						} px-2`}
					>
						<TbBrandMinecraft size={30} />
					</button>
					<button
						onClick={() => {
							setDashView('settings');
						}}
						className={`${
							dashView === 'settings' ? 'btn' : 'btn-outline'
						} px-2`}
					>
						<MdOutlineSettings size={30} />
					</button>
					<button
						onClick={() => {
							setDashView('home');
						}}
						className={`lg:hidden ${
							dashView === 'home' ? 'btn' : 'btn-outline'
						} px-2`}
					>
						<MdOutlineNotificationsNone size={30} />
					</button>
				</div>
				<div className='hidden lg:block'>
					<button
						onClick={() => {
							setDashView('home');
						}}
						className={`${dashView === 'home' ? 'btn' : 'btn-outline'} px-2`}
					>
						<MdOutlineNotificationsNone size={30} />
					</button>
				</div>
			</div>
			<div className='mt-4 flex flex-col'>
				{/* <h3 className='text-xl w-full text-center'>Quick View</h3> */}
				<div className='mt-4 grid grid-cols-1 md:grid-cols-4 gap-4'>
					<div className='flex flex-col border-4 border-primary p-4 rounded-md'>
						<div className='flex items-center justify-between'>
							<h5 className='text-lg'>Total Revenue</h5>
							<MdAttachMoney size={30} />
						</div>

						<p className='text-2xl'>$1000</p>
						<p className='text-sm'>+20% from last month</p>
					</div>
					<div className='flex flex-col border-4 border-primary p-4 rounded-md'>
						<div className='flex items-center justify-between'>
							<h5 className='text-lg'>Sales</h5>
							<IoIosPricetag size={30} />
						</div>

						<p className='text-2xl'>132</p>
						<p className='text-sm'>+10% from last month</p>
					</div>
					<div className='flex flex-col border-4 border-primary p-4 rounded-md'>
						<div className='flex items-center justify-between'>
							<h5 className='text-lg'>Unfufilled Orders</h5>
							<IoIosPricetag size={30} />
						</div>

						<p className='text-2xl'>3</p>
						<p className='text-sm'>Not marked shipped</p>
					</div>
					<div className='flex flex-col border-4 border-primary p-4 rounded-md'>
						<div className='flex items-center justify-between'>
							<h5 className='text-lg'>Active Users</h5>
							<MdAttachMoney size={30} />
						</div>

						<p className='text-2xl'>36</p>
						<p className='text-sm'>+5% from yesterday</p>
					</div>
				</div>
			</div>
			<div className='my-4 w-full border-4'></div>
			{dashView === 'home' ? (
				<Dashboard />
			) : dashView === 'orders' ? (
				<Orders />
			) : dashView === 'products' ? (
				<Products />
			) : dashView === 'settings' ? (
				<Dashboard />
			) : (
				<Dashboard />
			)}
		</div>
	);
};

export default AdminDashboard;
