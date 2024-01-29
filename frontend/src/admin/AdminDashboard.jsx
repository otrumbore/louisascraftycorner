import React, { useEffect, useState } from 'react';
import {
	MdAttachMoney,
	MdOutlineHome,
	MdOutlinePriceCheck,
	MdOutlineSettings,
	MdOutlineNotificationsNone,
	MdErrorOutline,
	MdOutlineArchive,
} from 'react-icons/md';
import { BsActivity } from 'react-icons/bs';
import { TbBrandMinecraft, TbShipOff } from 'react-icons/tb';
import { IoIosPricetag } from 'react-icons/io';
import { FaUsers } from 'react-icons/fa';
import { FaRegNewspaper } from 'react-icons/fa6';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import Orders from './components/dashboard/Orders';
import Cookies from 'js-cookie';
import { useUser } from '../context/UserContext';
import Products from './components/dashboard/Products';
import Users from './components/dashboard/Users';
import LoadingModal from '../components/LoadingModal';
import ActivityLogs from './components/dashboard/ActivityLogs';
import ErrorLogs from './components/dashboard/ErrorLogs';
import Settings from './components/dashboard/Settings';
import { getAllOrders } from '../api/orders.api';
import EditPage from './pages/EditPage';

const AdminDashboard = () => {
	const { userRole, userDetails } = useUser();
	const [orders, setOrders] = useState([]);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [dashView, setDashView] = useState('home');
	const location = useLocation();

	const [revenue, setRevenue] = useState(0);
	const [sales, setSales] = useState(0);
	const [unfulOrders, setUnfulOrders] = useState(0);

	const fetchOrders = async () => {
		setLoading(true);
		try {
			const fetchedOrders = await getAllOrders();
			const activeOrders = fetchedOrders.filter(
				(order) => order.active === true
			);
			setOrders(activeOrders);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (location.hash) {
			const hashWithoutSymbol = location.hash.substring(1);
			setDashView(hashWithoutSymbol);
		}
		const token = Cookies.get('token');
		if (!token) {
			navigate('/login');
			return;
		}
	}, [location, setDashView]);

	const checkUser = async () => {
		setLoading(true);
		try {
			if (userDetails._id && userRole() < 2) {
				navigate('/user/dashboard');
			}
		} catch (error) {
			console.error('Admin user: ', error.message);
			navigate('/');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		checkUser();
		fetchOrders();
		window.scroll(0, 0);
	}, []);

	useEffect(() => {
		getDashData();
	}, [orders]);

	const getDashData = () => {
		const lastMonthDate = new Date();
		lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

		const lastMonthOrders = orders.filter(
			(order) => new Date(order.createdAt) > lastMonthDate
		);

		const paidOrders = orders
			.filter((order) => order.status.some((status) => status.type === 'paid'))
			.filter(
				(order) => !order.status.some((status) => status.type === 'shipped')
			);

		const retailOrders = orders.filter((order) => order.source === 'retail');

		const totalRevenue = lastMonthOrders.reduce(
			(total, order) => total + order.prices.total,
			0
		);

		// const netRevenue = lastMonthOrders.reduce(
		// 	(total, order) => total + order.prices.total,
		// 	0
		// );

		// const profits = lastMonthOrders.reduce(
		// 	(total, order) => total + order.prices.total,
		// 	0
		// );

		const paidOrdersCount = paidOrders.length;

		const thisMonthSales = lastMonthOrders.filter((order) => {
			const hasPaidStatus =
				order.status && order.status.some((status) => status.type === 'paid');
			const hasCashStatus =
				order.status && order.status.some((status) => status.type === 'cash');

			return hasPaidStatus || hasCashStatus;
		}).length;

		setRevenue(totalRevenue);
		setSales(thisMonthSales);
		setUnfulOrders(paidOrdersCount);
	};

	return (
		<div className='p-8 mt-[8rem] w-full'>
			<LoadingModal loading={loading} />
			<div className='flex flex-col lg:flex-row w-full items-center justify-between'>
				<h2 className='text-2xl font-bold'>Admin Home</h2>
				<div className='flex mt-8 lg:mt-0 gap-4 flex-wrap items-center justify-center'>
					<button
						onClick={() => {
							navigate('#home');
						}}
						className={`${dashView === 'home' ? 'btn' : 'btn-outline'} px-2`}
					>
						<MdOutlineHome size={30} />
					</button>
					<button
						onClick={() => {
							navigate('#orders');
						}}
						className={`${dashView === 'orders' ? 'btn' : 'btn-outline'} px-2`}
					>
						<MdOutlinePriceCheck size={30} />
					</button>
					<button
						onClick={() => {
							navigate('#products');
						}}
						className={`${
							dashView === 'products' ? 'btn' : 'btn-outline'
						} px-2`}
					>
						<TbBrandMinecraft size={30} />
					</button>

					<button
						onClick={() => {
							navigate('#pages');
						}}
						className={`${dashView === 'pages' ? 'btn' : 'btn-outline'} px-2`}
					>
						<FaRegNewspaper size={30} />
					</button>
					<button
						onClick={() => {
							navigate('#users');
						}}
						className={`${dashView === 'users' ? 'btn' : 'btn-outline'} px-2`}
					>
						<FaUsers size={30} />
					</button>
					<button
						onClick={() => {
							navigate('#settings');
						}}
						className={`${
							dashView === 'settings' ? 'btn' : 'btn-outline'
						} px-2`}
					>
						<MdOutlineSettings size={30} />
					</button>
					<button
						onClick={() => {
							navigate('#archived');
						}}
						className={`${userRole() > 2 ? 'block' : 'hidden'} ${
							dashView === 'archived' ? 'btn' : 'btn-outline'
						} px-2`}
					>
						<MdOutlineArchive size={30} />
					</button>
					<button
						onClick={() => {
							navigate('#activityLogs');
						}}
						className={`${userRole() > 2 ? 'block' : 'hidden'} ${
							dashView === 'activityLogs' ? 'btn' : 'btn-outline'
						} px-2`}
					>
						<BsActivity size={30} />
					</button>
					<button
						onClick={() => {
							navigate('#errorLogs');
						}}
						className={`${userRole() > 2 ? 'block' : 'hidden'} ${
							dashView === 'errorLogs' ? 'btn' : 'btn-outline'
						} px-2`}
					>
						<MdErrorOutline size={30} />
					</button>

					<button
						onClick={() => {
							navigate('#home');
						}}
						className={`lg:hidden ${
							dashView === 'notifications' ? 'btn' : 'btn-outline'
						} px-2`}
					>
						<MdOutlineNotificationsNone size={30} />
					</button>
				</div>
				<div className='hidden lg:block'>
					<button
						onClick={() => {
							navigate('#home');
						}}
						className={`${
							dashView === 'notifications' ? 'btn' : 'btn-outline'
						} px-2`}
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

						<p className='text-2xl'>
							{(revenue / 100).toLocaleString('en-US', {
								style: 'currency',
								currency: 'USD',
							})}
						</p>
						<p className='text-sm'>This month</p>
					</div>
					<div className='flex flex-col border-4 border-primary p-4 rounded-md'>
						<div className='flex items-center justify-between'>
							<h5 className='text-lg'>Sales</h5>
							<IoIosPricetag size={30} />
						</div>

						<p className='text-2xl'>{sales}</p>
						<p className='text-sm'>This month</p>
					</div>
					<div className='flex flex-col border-4 border-primary p-4 rounded-md'>
						<div className='flex items-center justify-between'>
							<h5 className='text-lg'>Unfufilled Orders</h5>
							<TbShipOff size={30} />
						</div>

						<p className='text-2xl'>{unfulOrders}</p>
						<p className='text-sm'>Not marked shipped</p>
					</div>
					<div className='flex flex-col border-4 border-primary p-4 rounded-md'>
						<div className='flex items-center justify-between'>
							<h5 className='text-lg'>More Data?</h5>
							<FaUsers size={30} />
						</div>

						<p className='text-2xl'>0</p>
						<p className='text-sm'></p>
					</div>
				</div>
			</div>
			<div className='my-4 w-full border-4'></div>
			{dashView === 'home' ? (
				<Dashboard />
			) : dashView === 'orders' ? (
				<Orders apiOrders={orders} fetchOrders={fetchOrders} />
			) : dashView === 'products' ? (
				<Products />
			) : dashView === 'pages' ? (
				<EditPage />
			) : dashView === 'users' ? (
				<Users />
			) : dashView === 'archived' ? (
				<Products archived={true} />
			) : dashView === 'settings' ? (
				<Settings />
			) : dashView === 'activityLogs' ? (
				<ActivityLogs />
			) : dashView === 'errorLogs' ? (
				<ErrorLogs />
			) : (
				<Dashboard />
			)}
		</div>
	);
};

export default AdminDashboard;
