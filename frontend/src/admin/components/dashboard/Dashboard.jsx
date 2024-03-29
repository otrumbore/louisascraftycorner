import React from 'react';

const Dashboard = () => {
	return (
		<>
			<div className='mt-4 flex flex-col-reverse lg:flex-row justify-between items-start gap-4'>
				<div className='border-4 w-full border-primary p-4 rounded-md lg:w-[50%]'>
					<h5 className='text-lg'>Overview</h5>
					<div className='border-2 my-2'></div>
					<div>No Data</div>
				</div>
				<div className='border-4 w-full border-primary p-4 rounded-md lg:w-[50%]'>
					<div className='flex w-full justify-between items-center'>
						<div>
							<h5 className='text-lg'>Recent Sales</h5>
							<p className='text-xs'>you made 126 sales this month</p>
						</div>
						<div>
							<button className='btn-outline p-2'>View All</button>
						</div>
					</div>
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
		</>
	);
};

export default Dashboard;
