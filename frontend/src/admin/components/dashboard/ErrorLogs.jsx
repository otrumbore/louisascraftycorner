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
			setErrors(res);
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
				<table className='w-full table-auto'>
					<thead className=''>
						<tr>
							<th className='text-left'>Date/Time</th>
							<th className='text-left'>User</th>
							<th className='text-left'>Activity</th>
							<th className='text-left'>Page</th>
							<th className='text-left'>Browser</th>
							<th className='text-right'>Operations</th>
						</tr>
					</thead>
					<tbody>
						{errors.length === 0 && <div>No errors logged!</div>}
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
								<td className=''>{item.user.username}</td>
								<td className='text-wrap'>{item.errorData.error}</td>
								<td className=''>{item.errorData.page}</td>
								<td className=''>{item.browser}</td>
								<td className='text-right'>Buttons</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default ErrorLogs;
