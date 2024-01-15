import React from 'react';
import { MdClose } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useUser } from '../../../context/UserContext';

const UserModal = ({ user, onClose }) => {
	const { userRole } = useUser();

	return (
		<div
			className='fixed inset-0 overflow-y-auto bg-primary bg-opacity-20 top-0 left-0 right-0 bottom-0 z-10 flex justify-center items-center cursor-auto'
			onClick={onClose}
		>
			<div
				onClick={(event) => event.stopPropagation()}
				className='w-[600px] max-w-full max-h-[80vh] bg-white rounded-xl p-4 flex flex-col relative'
			>
				<MdClose
					className='absolute right-4 top-4 text-3xl text-red-600 cursor-pointer'
					onClick={onClose}
				/>
				<div
					className='mt-4 w-full p-4 rounded-md space-y-2 cursor-pointer'
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
					<div className='pt-4 flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center'>
						<button
							className={`btn-outline ${
								user.enabled
									? 'border-red-600 hover:bg-red-700'
									: 'border-green-600 hover:bg-green-700'
							} `}
						>
							{user.enabled ? 'Disable?' : 'Enable?'}
						</button>

						{userRole() > 2 && (
							<button className={`btn bg-red-600 hover:bg-red-700`}>
								Delete?
							</button>
						)}
						<button className={`btn `} onClick={onClose}>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserModal;
