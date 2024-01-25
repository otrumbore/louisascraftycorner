import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActivityLogs } from '../../../api/admin/logging.api';
import LoadingModal from '../../../components/LoadingModal';

const ActivityLogs = () => {
	const [loading, setLoading] = useState(false);
	const [activity, setActivity] = useState([]);

	const fetchActivity = async () => {
		try {
			const res = await getActivityLogs();
			// Sort the activity array based on createdAt in descending order (newest first)
			const sortedActivity = [...res].sort(
				(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
			);

			// Keep only the last 30 logs
			const trimmedActivity = sortedActivity.slice(0, 30);

			setActivity(trimmedActivity);
			//setActivity(res);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	useEffect(() => {
		setLoading(true);
		fetchActivity();
	}, []);

	useEffect(() => {
		if (activity && activity.length > 0) {
			setLoading(false);
		}
	}, [activity]);

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
							<th className='max-md:hidden text-right hidden'>Operations</th>
						</tr>
					</thead>
					<tbody>
						{activity.map((item, index) => (
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
								<td className=''>{item.user?.username ?? 'No Data'}</td>
								<td className='text-wrap'>
									{item.activityData?.activity ?? 'No Data'}
								</td>
								<td className=''>{item.activityData?.page ?? 'No Data'}</td>
								<td className='max-md:hidden text-right hidden'>Buttons</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default ActivityLogs;
