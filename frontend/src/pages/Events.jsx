import React, { useEffect, useState } from 'react';
import { getPageData } from '../api/pages.api';

const Events = () => {
	const [eventsData, setEventsData] = useState([]);

	const fetchEventsPage = async () => {
		try {
			const page = await getPageData('events');
			setEventsData(page);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchEventsPage();
		document.title = "Events | Louisa's Crafts";
		window.scroll(0, 0);
	}, []);
	return (
		<div className='w-full flex justify-center min-h-[65vh]'>
			<div className='p-4 w-full max-w-[1200px]'>
				<h2 className='text-3xl font-semibold text-center mb-8'>Events</h2>
				<div className='flex justify-center '>
					<div
						className='w-full lg:w-[80%] p-4 adminHTML'
						dangerouslySetInnerHTML={{
							__html: eventsData.content?.[0].data || '',
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default Events;
