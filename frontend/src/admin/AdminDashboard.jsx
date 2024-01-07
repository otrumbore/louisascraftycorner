import React, { useState } from 'react';
import { MdAttachMoney } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';

const AdminDashboard = () => {
	const [dashView, setDashView] = useState('home');
	return (
		<div className='p-8 mt-[8rem] w-full'>
			<div className='flex flex-col lg:flex-row w-full items-center justify-between'>
				<h2 className='text-2xl font-bold'>Admin Home</h2>
				<div className='flex mt-4 lg:mt-0 gap-4'>
					<button
						onClick={() => {
							setDashView('home');
						}}
						className='btn-outline px-2'
					>
						Home
					</button>
					<button
						onClick={() => {
							setDashView('orders');
						}}
						className='btn-outline px-2'
					>
						Orders
					</button>
					<button
						onClick={() => {
							setDashView('products');
						}}
						className='btn-outline px-2'
					>
						Products
					</button>
					<button
						onClick={() => {
							setDashView('settings');
						}}
						className='btn-outline px-2'
					>
						Site Settings
					</button>
				</div>
				<div className='hidden lg:block'>Logged in as Odnel</div>
			</div>
			<div className='mt-4 flex flex-col'>
				{/* <h3 className='text-xl w-full text-center'>Quick View</h3> */}
				<div className='mt-4 grid grid-cols-1 md:grid-cols-4 gap-4'>
					<div className='flex flex-col border-4 border-primary p-4 rounded-md'>
						<div className='flex items-center justify-between'>
							<h5 className='text-lg'>Total Revenue</h5>
							<MdAttachMoney size={20} />
						</div>

						<p className='text-2xl'>$1000</p>
						<p className='text-sm'>+20% from last month</p>
					</div>
					<div className='flex flex-col border-4 border-primary p-4 rounded-md'>
						<div className='flex items-center justify-between'>
							<h5 className='text-lg'>Sales</h5>
							<MdAttachMoney size={20} />
						</div>

						<p className='text-2xl'>132</p>
						<p className='text-sm'>+10% from last month</p>
					</div>
					<div className='flex flex-col border-4 border-primary p-4 rounded-md'>
						<div className='flex items-center justify-between'>
							<h5 className='text-lg'>Unfufilled Orders</h5>
							<MdAttachMoney size={20} />
						</div>

						<p className='text-2xl'>3</p>
						<p className='text-sm'></p>
					</div>
					<div className='flex flex-col border-4 border-primary p-4 rounded-md'>
						<div className='flex items-center justify-between'>
							<h5 className='text-lg'>Active Users</h5>
							<MdAttachMoney size={20} />
						</div>

						<p className='text-2xl'>36</p>
						<p className='text-sm'>+5% from yesterday</p>
					</div>
				</div>
			</div>
			{dashView === 'home' ? (
				<Dashboard />
			) : dashView === 'orders' ? (
				<Dashboard />
			) : dashView === 'products' ? (
				<Dashboard />
			) : dashView === 'settings' ? (
				<Dashboard />
			) : (
				<Dashboard />
			)}
		</div>
	);
};

export default AdminDashboard;
