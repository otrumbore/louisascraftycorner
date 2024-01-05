import React from 'react';
import { MdAttachMoney } from 'react-icons/md';

const AdminDashboard = () => {
	return (
		<div className='p-8 mt-[8rem] w-full'>
			<div className='flex flex-col lg:flex-row w-full items-center justify-between'>
				<h2 className='text-2xl font-bold'>Admin Home</h2>
				<div className='flex mt-4 lg:mt-0'>
					Home | Orders | Products | Site Settings
				</div>
				<div className='hidden lg:block'>Logged in as Odnel</div>
			</div>
			<div className='mt-4 flex flex-col'>
				{/* <h3 className='text-xl w-full text-center'>Quick View</h3> */}
				<div className='mt-4 grid grid-cols-1 md:grid-cols-4 gap-4'>
					<div className='flex flex-col border-4 border-slate-400 p-4 rounded-md'>
						<div className='flex items-center justify-between'>
							<h5 className='text-lg'>Total Revenue</h5>
							<MdAttachMoney size={20} />
						</div>

						<p className='text-2xl'>$1000</p>
						<p className='text-sm'>+20% from last month</p>
					</div>
					<div className='flex flex-col border-4 border-slate-400 p-4 rounded-md'>
						<div className='flex items-center justify-between'>
							<h5 className='text-lg'>Sales</h5>
							<MdAttachMoney size={20} />
						</div>

						<p className='text-2xl'>132</p>
						<p className='text-sm'>+10% from last month</p>
					</div>
					<div className='flex flex-col border-4 border-slate-400 p-4 rounded-md'>
						<div className='flex items-center justify-between'>
							<h5 className='text-lg'>Unfufilled Orders</h5>
							<MdAttachMoney size={20} />
						</div>

						<p className='text-2xl'>3</p>
						<p className='text-sm'></p>
					</div>
					<div className='flex flex-col border-4 border-slate-400 p-4 rounded-md'>
						<div className='flex items-center justify-between'>
							<h5 className='text-lg'>Active Users</h5>
							<MdAttachMoney size={20} />
						</div>

						<p className='text-2xl'>36</p>
						<p className='text-sm'>+5% from yesterday</p>
					</div>
				</div>
			</div>
			<div className='mt-4 flex flex-col-reverse lg:flex-row justify-between items-start gap-4'>
				<div className='border-4 w-full border-slate-400 p-4 rounded-md lg:w-[50%]'>
					<h5 className='text-lg'>Overview</h5>
					<div className='border-2 my-2'></div>
					<div>No Dats</div>
				</div>
				<div className='border-4 w-full border-slate-400 p-4 rounded-md lg:w-[50%]'>
					<h6 className='text-lg'>Recent Sales</h6>
					<p className='text-xs'>you made 126 sales this month</p>
					<div className='border-2 my-2'></div>
					<div className='flex justify-between font-bold mb-2'>
						<p>Order # / Email</p>
						<p>Price / Status</p>
					</div>
					<div className='grid grid-cols-2 gap-4'>
						<div className='flex flex-col'>
							<p>123456</p>
							<p>otrumbore@gmail.com</p>
						</div>
						<div className='flex flex-col items-end'>
							<p>$28.67</p>
							<div className='flex space-x-1'>
								<p className='hidden lg:block'>999 9999 9999 9999 9999 -</p>
								<p className='text-green-400'>Shipped</p>
							</div>
						</div>
						<div className='flex flex-col'>
							<p>123456</p>
							<p>otrumbore@gmail.com</p>
						</div>
						<div className='flex flex-col items-end'>
							<p>$28.67</p>
							<p className='text-red-400'>Placed</p>
						</div>

						<div className='flex flex-col'>
							<p>123456</p>
							<p>otrumbore@gmail.com</p>
						</div>
						<div className='flex flex-col items-end'>
							<p>$28.67</p>
							<p className='text-yellow-400'>Crafting</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
