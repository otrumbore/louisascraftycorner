import React, { useEffect, useState } from 'react';
import getUsers from '../../../api/admin/users.api';
import LoadingModal from '../../../components/LoadingModal';
import productModal from './ProductModal';
import DeleteModal from '../DeleteModal';
import { MdAdd } from 'react-icons/md';
import { Link } from 'react-router-dom';

const users = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	const [showModal, setShowModal] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(null);

	const fetchUsers = async () => {
		try {
			const fetchedusers = await getUsers(); // Await the asynchronous function
			const filteredusers = fetchedusers.filter(
				(user) => user.archived === false
			);
			setUsers(fetchedusers);

			console.log(fetchedusers);
			setLoading(false); // Update loading state when data is fetched
			//console.log(filteredusers);
		} catch (error) {
			console.error(error);
			setLoading(false); // Update loading state in case of error
			return (
				<div className='mt-8 w-full justify-center text-xl'>
					Could not load users refresh to try again.
				</div>
			);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const adminNotifications = [
		{ text: '111111 - low inventory' },
		{ text: '111112 - low inventory' },
		{ text: '111111 - low inventory' },
		{ text: '111112 - low inventory' },
	];
	// Calculate counts of active and inactive users
	const activeCount = users.filter((user) => user.isActive === true).length;
	const disabledCount = users.filter((user) => user.enabled === false).length;

	return (
		<>
			<LoadingModal loading={loading} />

			<div className='mt-4 w-full'>
				<div className='flex flex-col lg:flex-row lg:gap-4 lg:mb-4'>
					<div className='lg:w-[50%] bg-yellow-400 p-4 text-black grid grid-cols-1 lg:grid-cols-2 flex-wrap justify-center rounded-md border-4 border-primary border-dashed'>
						{adminNotifications.map((item, i) => (
							<p key={i}>{i + 1 + ': ' + item.text}</p>
						))}
					</div>
					<div className='lg:w-[50%] lg:my-0 my-4 flex items-center justify-between p-4 border-4 border-primary border-dashed rounded-md'>
						<p>Total: {users.length}</p>
						<p>Active: {activeCount}</p>
						<p>Disabled: {disabledCount}</p>
					</div>
				</div>
				<div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-4'>
					{users.map((user) => (
						<div
							key={user._id}
							className='w-full p-4 border-4 border-primary rounded-md space-y-2 cursor-pointer'
							//onClick={}//openModal(user._id)}
						>
							<div className='w-full flex items-center justify-between'>
								<p className='text-xs'>
									<strong>System ID:</strong> {user._id}
								</p>

								<p className='hidden lg:block text-xs'>
									<strong>Enabled: </strong>
									{user.enabled ? 'Yes' : 'No'}
								</p>
							</div>
							<div className='flex flex-col gap-2'>
								<p
									className='flex-wrap'
									onClick={() => {
										//userModal(user);
									}}
								>
									<strong>Name: </strong>
									{user.name}
								</p>
								<p>
									<strong>Username: </strong>
									{user.username}
								</p>
								<p>
									<strong>Email: </strong>
									{user.email}
								</p>
							</div>
							<div className='flex flex-col lg:flex-row lg:justify-between lg:tems-center'>
								<p>
									<strong>Email Validated: </strong>
									{user.emailValidated ? 'Yes' : 'No'}
								</p>
								<p>
									<strong>Email Marketing: </strong>
									{user.emailMarketing ? 'Yes' : 'No'}
								</p>
							</div>
							<div className='flex items-center justify-between'>
								<p>
									<strong>Role: </strong>
									{user.role}
								</p>
								<div className='flex'>
									{user.isActive ? (
										<p className='text-green-600'>Online</p>
									) : (
										<p className='text-orange-500'>Offline</p>
									)}
									<p> (Maybe 😉)</p>
								</div>
							</div>
							{/* {showModal === user._id && (
								<userModal user={user} onClose={closeModal} />
							)} */}
							<p className='text-xs'>
								<strong>Last Activity: </strong>
								{user.lastActivity}
							</p>
							<div className='flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center'>
								<button
									className={`btn ${
										user.enabled
											? 'bg-red-600 hover:bg-red-700'
											: 'bg-green-600 hover:bg-green-700'
									} `}
								>
									Disable
								</button>
								<button className='btn'>Testing</button>
								<button className='btn-outline'>Lock Account</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default users;
