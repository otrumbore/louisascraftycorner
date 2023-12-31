import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import Cookies from 'js-cookie';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdLogout, MdOutlineSettings } from 'react-icons/md';
import { BiPurchaseTagAlt } from 'react-icons/bi';
import { FaRegHeart, FaStar } from 'react-icons/fa';
import { FaRegUser } from 'react-icons/fa6';
import Orders from './components/Orders';
import Favorites from './components/Favorites';
import Profile from './components/Profile';
import Settings from './components/Settings';

const Dashboard = () => {
	const { userDetails, isAdmin } = useUser();
	const navigate = useNavigate();
	const [dashView, setDashView] = useState('');

	const location = useLocation();

	// Function to extract the hash fragment from the location pathname
	const getPageFromHash = () => {
		const hash = location.hash.substring(1); // Remove the '#' from the hash
		return hash || 'orders'; // Return 'default' if hash is empty
	};

	// Determine the "page" based on the hash fragment
	const currentPage = getPageFromHash();

	useEffect(() => {
		try {
			const token = Cookies.get('token');
			if (!token) {
				navigate('/login');
			}
		} catch (error) {}
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		currentPage && setDashView(currentPage);
	}, [currentPage]);

	//console.log(userDetails);

	return (
		<div className='p-4 mt-[8rem] w-full flex items-center justify-center'>
			<div className='px-1 w-full max-w-[1400px] items-center justify-between text-gray-600'>
				<div className='flex w-full flex-col lg:flex-row items-center justify-between gap-y-6'>
					<h2 className='text-2xl flex flex-wrap'>
						Welcome,
						{userDetails.name
							? ' ' + userDetails.name.split(' ')[0] || userDetails.name
							: ''}{' '}
						{isAdmin() && <FaStar size={30} className='text-yellow-500 ml-2' />}
					</h2>
					<h2 className='hidden lg:block text-xl font-bold'>Dashboard</h2>
					<div className='mt-4 w-full lg:w-auto'>
						<ul className='px-6 flex flex-wrap w-full gap-x-8 items-center justify-between md:px-0 md:justify-center'>
							<li
								onClick={() => {
									setDashView('orders');
								}}
								className='border-b-4 border-transparent border-dashed hover:border-slate-400 pb-2'
							>
								<BiPurchaseTagAlt size={30} />
							</li>
							<li
								onClick={() => {
									setDashView('favorites');
								}}
								className='border-b-4 border-transparent border-dashed hover:border-slate-400 pb-2'
							>
								<FaRegHeart size={27} />
							</li>
							<li
								onClick={() => {
									setDashView('profile');
								}}
								className='border-b-4 border-transparent border-dashed hover:border-slate-400 pb-2'
							>
								<FaRegUser size={27} />
							</li>
							<li
								onClick={() => {
									setDashView('settings');
								}}
								className='border-b-4 border-transparent border-dashed hover:border-slate-400 pb-2'
							>
								<MdOutlineSettings size={30} />
							</li>
							<li className='border-b-4 border-transparent border-dashed hover:border-slate-400 pb-2'>
								<Link to='/user/logout'>
									<MdLogout className='' size={27} />
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className='mt-8'>
					{dashView === 'orders' ? (
						<Orders />
					) : dashView === 'favorites' ? (
						<Favorites />
					) : dashView === 'profile' ? (
						<Profile />
					) : dashView === 'settings' ? (
						<Settings />
					) : (
						<Orders />
					)}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
