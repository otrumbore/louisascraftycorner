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
import { getUserTotalSpent } from '../api/orders.api';

const Dashboard = () => {
	const { userDetails, userRole } = useUser();
	const navigate = useNavigate();
	const [dashView, setDashView] = useState('');
	const [userRewards, setUserRewards] = useState(5);
	const [animation, setAnimation] = useState(true);
	const [rewards, setRewards] = useState({});

	const location = useLocation();

	// Function to extract the hash fragment from the location pathname
	const getPageFromHash = () => {
		const hash = location.hash.substring(1); // Remove the '#' from the hash
		return hash || 'settings'; // Return 'default' if hash is empty
	};

	// Determine the "page" based on the hash fragment
	const currentPage = getPageFromHash();

	useEffect(() => {
		try {
			const token = Cookies.get('token');
			if (!token) {
				navigate('/login');
			}
		} catch (error) {
			console.error(error);
		}
		window.scrollTo(0, 0);

		// Invoke calcUserRewards only if userDetails._id is set
		if (userDetails._id) {
			setRewards(userDetails.rewards);
		}
	}, [userDetails._id]);

	useEffect(() => {
		currentPage && setDashView(currentPage);
	}, [currentPage]);

	useEffect(() => {
		try {
			if (!userDetails._id) {
				return;
			}

			// const getTotalSpent = await getUserTotalSpent(
			// 	userDetails._id,
			// 	userDetails.email
			// );
			const getRewardsSpent = rewards.spent || 0;
			const getExtraDiscount = rewards.extra_discount || '';

			console.log(getRewardsSpent);
			const totalSpent = parseInt(getRewardsSpent / 100) || 3;
			//console.log(totalSpent);
			setAnimation(false);
			if (totalSpent >= 50) {
				setUserRewards(50 * 2);
			} else {
				setUserRewards(totalSpent * 2); // times 2 to give it to 100% but is for $50 at 100%
			}
		} catch (error) {
			console.log(error);
		}
	}, [rewards]);

	const calcUserRewards = async () => {
		try {
			if (!userDetails._id) {
				return;
			}

			// const getTotalSpent = await getUserTotalSpent(
			// 	userDetails._id,
			// 	userDetails.email
			// );
			const getRewardsSpent = rewards.spent || 0;
			const getExtraDiscount = rewards.extra_discount || '';

			console.log(getRewardsSpent);
			const totalSpent = parseInt(getRewardsSpent / 100) || 3;
			//console.log(totalSpent);
			setAnimation(false);
			if (totalSpent >= 50) {
				setUserRewards(50 * 2);
			} else {
				setUserRewards(totalSpent * 2); // times 2 to give it to 100% but is for $50 at 100%
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='p-4 mt-[8rem] min-h-[65vh] w-full flex justify-center'>
			<div className='px-1 w-full max-w-[1400px] items-center justify-between text-gray-600'>
				<div className='flex w-full flex-col lg:flex-row items-center justify-between gap-y-6'>
					<h2 className='text-2xl flex flex-wrap'>
						Welcome,
						{userDetails.name
							? ' ' + userDetails.name.split(' ')[0] || userDetails.name
							: ''}
						{userRole() > 1 && (
							<FaStar size={30} className='text-yellow-400 ml-2' />
						)}
					</h2>
					<p className='hidden lg:block'></p>
					<div className='lg:mt-4 w-full lg:w-auto'>
						<ul
							className={`px-6 flex flex-wrap w-full gap-x-8 items-center justify-between md:px-0 md:justify-center`}
						>
							<li
								onClick={() => {
									navigate('#orders');
								}}
								className={`cursor-pointer ${
									dashView === 'orders'
										? 'border-b-4 border-primary border-dashed pb-2'
										: 'border-b-4 border-opacity-0 border-dashed border-primary hover:border-opacity-100 pb-2'
								}`}
							>
								<BiPurchaseTagAlt size={29} />
							</li>
							<li
								onClick={() => {
									navigate('#favorites');
								}}
								className={`cursor-pointer ${
									dashView === 'favorites'
										? 'border-b-4 border-primary border-dashed pb-2'
										: 'border-b-4 border-opacity-0 border-dashed border-primary hover:border-opacity-100 pb-2'
								}`}
							>
								<FaRegHeart size={27} />
							</li>
							<li
								onClick={() => {
									navigate('#profile');
								}}
								className={`hidden cursor-pointer ${
									dashView === 'profile'
										? 'border-b-4 border-primary border-dashed pb-2'
										: 'border-b-4 border-opacity-0 border-dashed border-primary hover:border-opacity-100 pb-2'
								}`}
							>
								<FaRegUser size={27} />
							</li>
							<li
								onClick={() => {
									navigate('#settings');
								}}
								className={`cursor-pointer ${
									dashView === 'settings'
										? 'border-b-4 border-primary border-dashed pb-2'
										: 'border-b-4 border-opacity-0 border-dashed border-primary hover:border-opacity-100 pb-2'
								}`}
							>
								<MdOutlineSettings size={30} />
							</li>
							<li className='border-b-4 border-opacity-0 border-primary border-dashed hover:border-opacity-100 pb-2 cursor-pointer'>
								<Link to='/user/logout'>
									<MdLogout className='' size={27} />
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className='flex w-full items-center justify-center'>
					<div className='mt-8 w-full md:w-[50vw] lg:w-[30vw] flex flex-col justify-center items-center gap-y-2'>
						<p className='hidden'>Loyalty Rewards:</p>
						<div className='w-full bg-gray-200 h-8 rounded-full relative'>
							<div className='flex text-yellow-400 justify-center items-center absolute left-0 right-0 z-10'>
								{(userRewards >= 50 && userRewards <= 55) || animation ? (
									<FaStar
										size={30}
										className={`${
											animation ? 'animate-spin' : 'animate-bounce'
										} `}
									/>
								) : (
									userRewards <= 51 && <FaStar size={30} />
								)}
							</div>
							<div className='flex text-yellow-400 justify-end items-center absolute right-0 px-1 z-10'>
								{userRewards === 100 || animation ? (
									<FaStar
										size={30}
										className={`${
											animation ? 'animate-spin' : 'animate-bounce'
										} `}
									/>
								) : (
									<FaStar size={30} />
								)}
							</div>
							<div
								className={`flex bg-primary text-lg h-8 font-medium text-blue-100 items-center justify-center p-0.5 leading-none rounded-full relative transition-all duration-700`}
								style={{ width: `${userRewards}%` }}
							>
								{/* {userRewards !== 50 && userRewards + 50 + '%'} */}
								{userRewards >= 40 && userRewards <= 49
									? 'So close...'
									: userRewards >= 50 && userRewards < 55
									? 'Got it!'
									: userRewards >= 55 && userRewards < 100
									? 'Keep it up'
									: userRewards === 100
									? 'Complete!'
									: ''}
							</div>
						</div>
						<div className='flex w-full justify-between items-center text-gray-600'>
							<p className='w-1/3'></p>
							<p className='w-1/3'>{userRewards <= 55 && '5% off'}</p>

							<p className='flex justify-end'>
								{userRewards > 50
									? 'Free Gift'
									: userRewards < 50
									? 'Suprise'
									: null}
							</p>
						</div>
						{userRewards >= 50 && userRewards < 100 && !rewards.reward1Used && (
							<div>5% off will be applied at checkout</div>
						)}
						{userRewards >= 100 && !rewards.reward2Used && (
							<div>Free gift will be sent with your next order!</div>
						)}
					</div>
				</div>

				<div className='mt-8 w-full'>
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
