import React, { useEffect } from 'react';
import { useUser } from '../context/UserContext';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { MdLogout } from 'react-icons/md';

const Dashboard = () => {
	const { userDetails, isAdmin } = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		try {
			const token = Cookies.get('token');
			if (!token) {
				navigate('/login');
			}
		} catch (error) {}
		window.scrollTo(0, 0);
	}, []);

	//console.log(userDetails);

	return (
		<div className='p-4 mt-[8rem] w-full flex items-center justify-center'>
			<div className='flex w-full max-w-[1400px] items-center justify-between'>
				<h2 className='text-2xl'>
					Hello,{' '}
					{userDetails.name
						? userDetails.name.split(' ')[0] || userDetails.name
						: ''}
					{isAdmin() && ' (Admin)'}
				</h2>
				<Link to='/user/logout'>
					<button className='flex items-center text-lg border-2 px-4 py-2 border-slate-400 bg-slate-300 hover:bg-slate-400 hover:border-slate-500 hover:text-white hover:shadow-slate-400 hover:shadow-lg rounded-md transition-all duration-300'>
						<p className='hidden lg:block'>Logout</p>
						<MdLogout className='ml-2' size={25} />
					</button>
				</Link>
			</div>
		</div>
	);
};

export default Dashboard;
