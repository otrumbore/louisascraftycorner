import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorLogs } from '../../../api/admin/logging.api';
import LoadingModal from '../../../components/LoadingModal';

const ErrorLogs = () => {
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState([]);

	const fetchErrors = async () => {
		try {
			const res = await getErrorLogs();
			res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
			const slicedLogs = res.slice(0, 20);
			setErrors(slicedLogs);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	useEffect(() => {
		setLoading(true);
		fetchErrors();
	}, []);

	useEffect(() => {
		if (errors && errors.length > 0) {
			setLoading(false);
		} else {
			setLoading(false);
		}
	}, [errors]);
	return (
		<>
			<LoadingModal loading={loading} />
			<div className='flex p-4 border-4 border-primary rounded-md'>
				{errors.length === 0 && <div>No errors logged!</div>}
				<table
					className={`${errors.length === 0 && 'hidden'} w-full table-auto`}
				>
					<thead className=''>
						<tr>
							<th className='text-left'>Date/Time</th>
							<th className='text-left px-4'>User</th>
							<th className='text-left px-4'>Activity</th>
							<th className='text-left px-4'>Page</th>
							<th className='text-left max-lg:hidden px-4'>Browser</th>
							<th className='text-right hidden'>Operations</th>
						</tr>
					</thead>
					<tbody>
						{errors.map((item, index) => (
							<tr key={index} className='border-t-4'>
								<td className='text-left'>
									{item.createdAt
										? new Date(item.createdAt).toLocaleString('en-US', {
												hour: 'numeric',
												minute: 'numeric',
												hour12: true,
												day: 'numeric',
												month: 'numeric',
												year: 'numeric',
										  })
										: 'No Recent Update'}
								</td>
								<td className='px-4'>{item.user.username}</td>
								<td className='text-wrap px-4'>{item.errorData.error}</td>
								<td className='px-4'>{item.errorData.page}</td>
								<td className='max-lg:hidden px-4'>{item.browser}</td>
								<td className='text-right hidden'>Buttons</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default ErrorLogs;
