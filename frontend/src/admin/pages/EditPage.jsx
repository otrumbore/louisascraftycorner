import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useUser } from '../../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import LoadingModal from '../../components/LoadingModal';
import { getEventsPage, updateEventsPage } from '../../api/pages.api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditPage = () => {
	const [eventsData, setEventsData] = useState([]);
	const [value, setValue] = useState('');
	const [pageSelector, setPageSelector] = useState('events');

	const handleChange = (e) => {
		setValue(e);
	};

	const fetchEventsPage = async () => {
		try {
			const page = await getEventsPage();
			setEventsData(page);
		} catch (error) {
			console.log(error);
		}
	};

	const updateEventsPageContent = async () => {
		try {
			const data = { page_name: 'events', content: value };
			const update = await updateEventsPage(data);
			console.log(update);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		// Fetch page content only once on mount
		fetchEventsPage();
	}, []);

	useEffect(() => {
		// Update the editor content when the page content is changed
		setValue(eventsData.content || '');
	}, [eventsData]);

	const handleSave = () => {
		updateEventsPageContent();
	};

	return (
		<div className='w-full flex justify-center'>
			<div className='p-4 w-full max-w-[1200px]'>
				<h2 className='text-2xl mb-8 text-center'>Edit Pages</h2>
				<div className='w-full'>
					<div className='mb-4 border-4 border-primary rounded-md'>
						<ReactQuill value={value} onChange={handleChange} theme='snow' />
					</div>
					<div className='flex justify-end'>
						<button onClick={() => handleSave()} className='btn'>
							Save Content
						</button>
					</div>

					<p className='text-center'>Preview:</p>
					<div
						className='border-4 border-primary rounded-md p-4 adminHTML'
						dangerouslySetInnerHTML={{ __html: value }}
					/>
				</div>
			</div>
		</div>
	);
};

export default EditPage;
