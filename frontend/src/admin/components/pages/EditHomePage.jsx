import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useUser } from '../../../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import LoadingModal from '../../../components/LoadingModal';
import { getPageData, updatePage } from '../../../api/pages.api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditHomePage = () => {
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(true);
	const [homeData, setHomeData] = useState([]);
	const [heroSelector, setHeroSelector] = useState(0);
	const [formData, setFormData] = useState({
		data: '',
		title: '',
		link: '',
		image: '',
		active: true,
	});

	const handleChange = (valueOrEvent, inputName) => {
		let name = inputName;
		let value;
		if (valueOrEvent.target) {
			name = valueOrEvent.target.name;
			value =
				valueOrEvent.target.type === 'checkbox'
					? valueOrEvent.target.checked
					: valueOrEvent.target.value;
		} else {
			value = valueOrEvent;
		}

		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const updatePageContent = async () => {
		setLoading(true);
		try {
			const data = {
				page_name: 'home', // Assuming 'home' is the fixed page name
				content: homeData.content.map((item, index) =>
					index === heroSelector ? { ...item, ...formData } : item
				),
			};

			const update = await updatePage(data);
			if (update.status !== 200 && update.status !== 201) {
				enqueueSnackbar(`Failed to update the page!`, {
					variant: 'error',
				});
				return;
			}
			enqueueSnackbar(`Updated successfully!`, {
				variant: 'success',
			});
		} catch (error) {
			console.log(error);
			enqueueSnackbar(`Failed to update the page!`, {
				variant: 'error',
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const fetchHomePage = async () => {
			try {
				setLoading(true);
				const page = await getPageData('home');
				setHomeData(page);
				//console.log(page);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		fetchHomePage();
	}, []);

	useEffect(() => {
		setFormData({
			title: homeData.content?.[heroSelector].title,
			image: homeData.content?.[heroSelector].image,
			link: homeData.content?.[heroSelector].link,
			data: homeData.content?.[heroSelector].data,
			active: homeData.content?.[heroSelector].active,
		});
	}, [homeData, heroSelector]);

	const handleSave = () => {
		updatePageContent();
	};

	return (
		<div className='w-full flex justify-center'>
			<LoadingModal loading={loading} />
			<div className='p-4 w-full max-w-[1200px]'>
				{/* <h2 className='text-2xl mb-8 text-center'>Edit Home Page</h2> */}
				<div className='w-full'>
					<div className='flex justify-center items-center gap-4 mb-8'>
						<button
							className={`${heroSelector === 0 ? 'btn' : 'btn-outline'}`}
							onClick={() => setHeroSelector(0)}
						>
							Main Hero
						</button>
						<button
							className={`${heroSelector === 1 ? 'btn' : 'btn-outline'}`}
							onClick={() => setHeroSelector(1)}
						>
							Hero 2
						</button>
						<button
							className={`${heroSelector === 2 ? 'btn' : 'btn-outline'}`}
							onClick={() => setHeroSelector(2)}
						>
							Hero 3
						</button>
					</div>
					<div className='p-4 mb-4 border-4 border-primary rounded-md'>
						<div className='flex flex-col mb-4 gap-4'>
							<input
								type='text'
								name='title'
								className='input'
								placeholder='Hero 1 Title'
								onChange={handleChange}
								value={formData.title || ''}
							/>
							<input
								type='text'
								name='link'
								className='input'
								placeholder='Link'
								onChange={handleChange}
								value={formData.link || ''}
							/>
							<input
								type='text'
								name='image'
								className='input'
								placeholder='Image'
								onChange={handleChange}
								value={formData.image || ''}
							/>
						</div>

						<ReactQuill
							value={formData.data || ''}
							onChange={(content) => handleChange(content, 'data')}
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
					<div className='flex justify-end gap-8 items-center'>
						<div className='flex gap-2 items-center'>
							<input
								type='checkbox'
								className='transform scale-125 cursor-pointer'
								name='active'
								id='active'
								checked={formData.active || false}
								disabled={heroSelector === 0}
								onChange={handleChange}
							/>
							<label htmlFor='active' className='text-xl cursor-pointer'>
								Active?
							</label>
						</div>

						<button onClick={() => handleSave()} className='btn'>
							Save Content
						</button>
					</div>

					{/* <p className='text-center'>Preview:</p>
					<div
						className='border-4 border-primary rounded-md p-4 adminHTML'
						dangerouslySetInnerHTML={{ __html: value }}
					/> */}
				</div>
			</div>
		</div>
	);
};

export default EditHomePage;
