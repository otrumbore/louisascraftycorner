import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useUser } from '../../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import LoadingModal from '../../components/LoadingModal';
import getAboutPage, { getEventsPage, updatePage } from '../../api/pages.api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditPage = () => {
	const { enqueueSnackbar } = useSnackbar();
	const [eventsData, setEventsData] = useState([]);
	const [aboutData, setAboutData] = useState([]);
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

	const updatePageContent = async () => {
		try {
			let pageContent;
			if (pageSelector === 'about') {
				pageContent = [...aboutData.content];
			} else if (pageSelector === 'events') {
				pageContent = [...eventsData.content];
			}
			if (pageContent.length > 0) {
				pageContent[0] = { ...pageContent[0], data: value };
			} else {
				pageContent.push({ data: value });
			}

			const data = {
				page_name: pageSelector,
				content: pageContent,
			};

			const update = await updatePage(data);
			console.log(update);
			if (update.status !== 200 && update.status !== 201) {
				enqueueSnackbar(`Failed to update the page!`, {
					variant: 'error',
				});
				return;
			}
			enqueueSnackbar(`Updated ${pageSelector} successfully!`, {
				variant: 'success',
			});
		} catch (error) {
			console.log(error);
			enqueueSnackbar(`Failed to update the page!`, {
				variant: 'error',
			});
		}
	};

	const fetchAboutPage = async () => {
		try {
			const page = await getAboutPage();
			setAboutData(page);
			console.log(page);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (pageSelector === 'events') {
			setValue(eventsData.content?.[0].data || '');
		} else if (pageSelector === 'about') {
			setValue(aboutData.content?.[0].data || '');
		} else {
			console.log('something went wrong with the selection of which page!');
		}
	}, [pageSelector]);

	useEffect(() => {
		fetchEventsPage();
		fetchAboutPage();
	}, [pageSelector]);

	useEffect(() => {
		if (pageSelector === 'events') {
			setValue(eventsData.content?.[0].data || '');
		}
	}, [eventsData]);

	useEffect(() => {
		if (pageSelector === 'about') {
			setValue(aboutData.content?.[0].data || '');
		}
	}, [aboutData]);

	const handleSave = () => {
		updatePageContent();
	};

	return (
		<div className='w-full flex justify-center'>
			<div className='p-4 w-full max-w-[1200px]'>
				<h2 className='text-2xl mb-8 text-center'>Edit Pages</h2>

				<div className='flex justify-center items-center gap-4 mb-8'>
					<button
						className={`${pageSelector === 'events' ? 'btn' : 'btn-outline'}`}
						onClick={() => setPageSelector('events')}
					>
						Events Page
					</button>
					<button
						className={`${pageSelector === 'about' ? 'btn' : 'btn-outline'}`}
						onClick={() => setPageSelector('about')}
					>
						About Page
					</button>
				</div>
				<div className='w-full'>
					<div className='mb-4 border-4 border-primary rounded-md'>
						<ReactQuill
							value={value || ''}
							onChange={handleChange}
							theme='snow'
							modules={{
								toolbar: [
									[{ header: [1, 2, false] }],
									['bold', 'italic', 'underline', 'strike', 'blockquote'],
									[
										{ list: 'ordered' },
										{ list: 'bullet' },
										{ indent: '-1' },
										{ indent: '+1' },
									],
									['link', 'image'],
									['clean'],
								],
							}}
						/>
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
