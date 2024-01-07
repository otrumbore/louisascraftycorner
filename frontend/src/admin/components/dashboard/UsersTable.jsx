import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { BiShow } from 'react-icons/bi';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import UserModal from './UserModal';
import DeleteModal from '../DeleteModal';

const UsersTable = ({ users }) => {
	const [showModal, setShowModal] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(null);

	const openModal = (userId) => {
		//setShowModal(productId);
	};

	const closeModal = () => {
		//setShowModal(null);
	};

	const openDeleteModal = (userId) => {
		setShowDeleteModal(userId);
	};

	const closeDeleteModal = () => {
		setShowDeleteModal(null);
	};

	return (
		<table className='w-full border-separate border-spacing-2'>
			<thead>
				<tr>
					<th className='border border-slate-600 rounded-md'>ID</th>
					<th className='border border-slate-600 rounded-md'>Name</th>
					<th className='border border-slate-600 rounded-md max-md:hidden'>
						Price
					</th>
					<th className='border border-slate-600 rounded-md max-md:hidden'>
						Sale
					</th>
					<th className='border border-slate-600 rounded-md'>QTY.</th>
					<th className='border border-slate-600 rounded-md max-md:hidden'>
						Rating
					</th>
					<th className='border border-slate-600 rounded-md'>Operations</th>
				</tr>
			</thead>
			<tbody>
				{users.map((user, index) => (
					<tr key={user._id} className='h-8'>
						<td className='border border-slate-700 rounded-md text-center'>
							{user.storeId}
						</td>

						<td className='border border-slate-700 rounded-md text-center'>
							{user.name}
						</td>
						<td className='border border-slate-700 rounded-md text-center max-md:hidden'>
							$
							{user.sale > 0 ? (
								<span className='line-through'>{user.price}</span>
							) : (
								user.price
							)}
						</td>

						<td className='border border-slate-700 rounded-md text-center max-md:hidden'>
							{user.sale > 0 ? (
								<span className='text-red-400'>${user.sale}</span>
							) : (
								'No Sale'
							)}
						</td>
						<td className='border border-slate-700 rounded-md text-center'>
							{user.inventory < 3 ? (
								<span className='text-red-400'>{user.inventory}</span>
							) : (
								user.inventory
							)}
						</td>
						<td className='border border-slate-700 rounded-md text-center max-md:hidden'>
							{user.rating}
						</td>
						<td className='border border-slate-700 rounded-md text-center'>
							<div className='flex justify-center items-center gap-x-4'>
								<BiShow
									className='text-3xl text-blue-800 hover:scale-150 cursor-pointer'
									onClick={() => openModal(user._id)}
								/>
								{/* <Link to={`/books/details/${user._id}`}>
									<BsInfoCircle className='text-2xl text-green-800' />
								</Link> */}
								<Link to={`/admin/edituser/${user._id}`}>
									<AiOutlineEdit className='text-2xl text-yellow-600 hover:scale-150' />
								</Link>
								{/* <Link to={`/books/delete/${user._id}`}>
									<MdOutlineDelete className='text-2xl text-red-600' />
								</Link> */}
								<MdOutlineDelete
									className='text-2xl text-red-600 hover:scale-150 cursor-pointer'
									onClick={() => openDeleteModal(user._id)}
								/>
								{showModal === user._id && (
									<UserModal user={user} onClose={closeModal} />
								)}
								{showDeleteModal === user._id && (
									<DeleteModal id={user} onClose={closeDeleteModal} />
								)}
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default UsersTable;
