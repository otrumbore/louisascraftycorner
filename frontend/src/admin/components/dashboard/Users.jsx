import React, { useEffect, useState } from 'react';
import getUsers, { updateUser } from '../../../api/users.api';
import LoadingModal from '../../../components/LoadingModal';
import productModal from './ProductModal';
import DeleteModal from '../DeleteModal';
import {
	MdOutlineRemoveRedEye,
	MdOutlineLock,
	MdOutlineLockOpen,
	MdDeleteOutline,
	MdOutlineMarkEmailRead,
} from 'react-icons/md';
import { Link } from 'react-router-dom';
import UserModal from './UserModal';
import { useUser } from '../../../context/UserContext';
import { useSnackbar } from 'notistack';

const Users = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	const { enqueueSnackbar } = useSnackbar();

	const [showModal, setShowModal] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(null);

	const { userRole } = useUser();

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

	const sendUserUpdate = async (id, data, username) => {
		setLoading(true);
		try {
			const response = await updateUser(id, data);
			if (
				(response.status === 200 || response.status === 201) &&
				(data.enabled || !data.enabled)
			) {
				enqueueSnackbar(username + `'s account locked is ` + !data.enabled, {
					variant: 'success',
				});
			}

			if ((response === 200 || response === 201) && data.emailValidated) {
				enqueueSnackbar(username + ' email has been marked validated!', {
					variant: 'success',
				});
			}

			fetchUsers();
		} catch (error) {
			console.error(error);
			enqueueSnackbar(
				'Could not update ' + username + `'s email validation status!`,
				{
					variant: 'error',
				}
			);
		}
	};

	const openModal = (user) => {
		setShowModal(user);
	};

	const closeModal = () => {
		fetchUsers();
		setShowModal(null);
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const adminNotifications = [
		{ text: 'user: latrumbore - attempted login' },
		{ text: 'user: ntrumbore - created' },
		{ text: 'user: ntrumbore - created' },
		{ text: 'user: ntrumbore - created' },
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
				<table className='w-full'>
					<thead className='border-b-4 border-primary text-xl font-bold'>
						<tr className=''>
							<th className='pl-2 text-left'>Name</th>
							<th>Username</th>
							<th>Email</th>

							<th className=''>Status</th>
							<th className=''>Last Activity</th>
							<th className='text-right pr-2'>Actions</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user, i) => (
							<tr key={i} className='border-b-2'>
								<td className='pl-2 text-left py-2'>
									<button onClick={() => openModal(user)}>{user.name}</button>
								</td>
								<td className='text-center'>{user.username}</td>
								<td className='text-center'>{user.email}</td>
								<td className='text-center'>
									<p
										className={`text-wrap ${
											user.isActive ? 'text-green-600' : 'text-orange-400'
										}`}
									>
										{user.isActive ? 'Online' : 'Offline'}
									</p>
									<p
										className={`text-wrap ${
											user.enabled ? 'text-green-600' : 'text-orange-400'
										}`}
									>
										{user.enabled ? 'Enabled' : 'Disabled'}
									</p>
								</td>
								<td className='text-center'>
									<p className={`text-wrap text-center `}>
										{user.lastActivity
											? new Date(user.lastActivity).toLocaleString('en-US', {
													hour: 'numeric',
													minute: 'numeric',
													hour12: true,
													day: 'numeric',
													month: 'numeric',
													year: 'numeric',
											  })
											: 'No Recent Update'}
									</p>
								</td>
								<td className='flex justify-end gap-2 items-center'>
									<button
										className={`${
											user.emailValidated ? 'hidden' : 'block'
										} btn-ghost px-2 text-green-600`}
										onClick={() => {
											const data = { emailValidated: !user.emailValidated };
											sendUserUpdate(user._id, data, user.username);
										}}
									>
										<MdOutlineMarkEmailRead size={25} />
									</button>
									<button
										className='btn-ghost px-2'
										onClick={() => {
											const data = { enabled: !user.enabled };
											sendUserUpdate(user._id, data, user.username);
										}}
									>
										{user.enabled ? (
											<MdOutlineLock className='text-orange-400' size={25} />
										) : (
											<MdOutlineLockOpen className='text-green-600' size={25} />
										)}
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{showModal && <UserModal user={showModal} onClose={closeModal} />}

				{/* <div className='w-full grid grid-cols-1 border-4 border-primary rounded-md'>
					<div
						className='relative w-full flex px-4 py-4 cursor-pointer items-center border-b-2 border-slate-400'
						//onClick={}//openModal(user._id)}
					>
						<div className='hidden lg:block w-[20%] text-left text-lg font-bold'>
							Name
						</div>
						<div className='w-[15%] text-left text-lg font-bold'>Username</div>
						<div className='hidden lg:block w-[25%] text-left text-lg font-bold'>
							Email
						</div>

						<div className='hidden lg:flex absolute right-32 min-w-[20%] gap-x-4 justify-between text-lg font-bold'>
							<p>Status</p>
							<p>Last Activity</p>
						</div>
						<div className='absolute right-0 pr-2 flex w-[15%] gap-2 items-center justify-end text-lg font-bold'>
							Actions
						</div>
					</div>
					{users.map((user) => (
						<div
							key={user._id}
							className='relative w-full flex px-4 py-4 border-b-2 border-slate-300 items-center'
						>
							<button
								onClick={() => {
									openModal(user._id);
								}}
								className='flex w-full cursor-pointer items-center'
							>
								<div className='hidden lg:block w-[20%] text-left text-wrap'>
									{user.name}
								</div>
								<div className='w-[15%] text-left text-wrap'>
									{user.username}
								</div>
								<div className='hidden lg:block w-[25%] text-left text-wrap'>
									{user.email}
								</div>

								<div className='hidden lg:flex absolute right-32 min-w-[20%] gap-x-4 justify-between text-wrap'>
									<p
										className={`w-[5%] text-left text-wrap ${
											user.isActive ? 'text-green-600' : 'text-orange-400'
										}`}
									>
										{user.isActive ? 'Online' : 'Offline'}
									</p>
									<p
										className={`w-[5%] text-left text-wrap ${
											user.enabled ? 'text-green-600' : 'text-orange-400'
										}`}
									>
										{user.enabled ? 'Enabled' : 'Disabled'}
									</p>
									<p>
										{user.lastActivity
											? new Date(user.lastActivity).toLocaleString('en-US', {
													hour: 'numeric',
													minute: 'numeric',
													hour12: true,
													day: 'numeric',
													month: 'numeric',
													year: 'numeric',
											  })
											: 'No Recent Login'}
									</p>
								</div>
							</button>
							<div className='absolute right-0 pr-2 flex w-[15%] gap-2 items-center justify-end'>
								<button
									className='btn-ghost px-2'
									onClick={() => {
										const data = { enabled: !user.enabled };
										sendUserUpdate(user._id, data, user.username);
									}}
								>
									{user.enabled ? (
										<MdOutlineLock className='text-orange-400' size={25} />
									) : (
										<MdOutlineLockOpen className='text-green-600' size={25} />
									)}
								</button>
								<button
									className={`${
										user.emailValidated ? 'hidden' : 'block'
									} btn-ghost px-2 text-green-600`}
									onClick={() => {
										const data = { emailValidated: !user.emailValidated };
										sendUserUpdate(user._id, data, user.username);
									}}
								>
									<MdOutlineMarkEmailRead size={25} />
								</button>
							</div>

							
						</div>
					))}
				</div> */}
			</div>
		</>
	);
};

export default Users;
