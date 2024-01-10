import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import LoadingModal from '../../components/LoadingModal';
import { LOCALIP } from '../../config';
import Cookies from 'js-cookie';
import { useUser } from '../../context/UserContext';
import getSettings from '../../api/siteSettings.api';

const SiteSettings = () => {
	const [websiteBanner, setWebsiteBanner] = useState('');
	const [collections, setCollections] = useState([]);
	const [addCollection, setAddCollection] = useState('');

	//const { id } = useParams();
	const [id, setId] = useState('');

	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const { isAdmin } = useUser();

	useEffect(() => {
		setLoading(true);
		const checkUser = async () => {
			try {
				const token = Cookies.get('token');
				if (token) {
					!isAdmin() && navigate('/user/dashboard');
					return;
				}
				navigate('/login');
			} catch (error) {
				console.error('Admin user: ', error.message);
				navigate('/');
			}
		};

		console.log(getSettings());

		//checkUser();
		axios
			.get(`http://${LOCALIP}:5555/admin/site_settings/`)
			.then((response) => {
				setWebsiteBanner(response.data?.data[0]?.website_banner);
				console.log(response.data);
				setCollections(response.data?.data[0]?.collections);
				setId(response.data.data[0]._id);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				enqueueSnackbar('Could not retrieve settings', {
					variant: 'error',
					anchorOrigin: { horizontal: 'right', vertical: 'top' },
				});
				console.log(error);
				navigate('/admin');
			});
	}, []);

	const handleEditWebsiteSettings = () => {
		//const id = storeId;
		// Define the new collection object to add
		const newCollection = { name: addCollection };

		// Update the 'collections' state using the state updater function and spread operator
		setCollections((prevCollections) => [...prevCollections, newCollection]);
		sendSettings();
	};

	const sendSettings = async () => {
		const data = {
			website_banner: websiteBanner,
			collections: collections,
		};
		setLoading(true);
		console.log('sending data: ', data);
		axios
			.put(`http://${LOCALIP}:5555/admin/site_settings/${id}`, data)
			.then(() => {
				setLoading(false);
				enqueueSnackbar('Settings updated', {
					variant: 'success',
					anchorOrigin: { horizontal: 'right', vertical: 'top' },
				});
				//navigate('/admin');
			})
			.catch((error) => {
				setLoading(false);
				enqueueSnackbar('Could not update settings', {
					variant: 'error',
					anchorOrigin: { horizontal: 'right', vertical: 'top' },
				});
				console.log(error);
			});
	};

	return (
		<div className='p-4 mt-[8rem]'>
			<BackButton />
			<h1 className='text-3xl my-4'>Edit Website Settings</h1>
			<LoadingModal loading={loading} />
			<div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
				<div className='my-4'>
					<label className='text-xl mr-4 text-gray-500'>Website Banner</label>
					<input
						type='text'
						value={websiteBanner}
						onChange={(e) => setWebsiteBanner(e.target.value)}
						className='border-2 border-gray-500 px-4 py-2 w-full'
					/>
				</div>
				<div className='my-4'>
					<label className='text-xl mr-4 text-gray-500'>Collections:</label>
					<select>
						{collections.map((item, i) => (
							<option key={i}>{item.name}</option>
						))}
					</select>
				</div>
				<div className='my-4'>
					<label className='text-xl mr-4 text-gray-500'>
						Add to Collections:
					</label>
					<input
						type='text'
						value={addCollection}
						onChange={(e) => setAddCollection(e.target.value)}
						className='border-2 border-gray-500 px-4 py-2 w-full'
					/>
				</div>
				<button
					className='p-2 bg-sky-300 m-8'
					onClick={handleEditWebsiteSettings}
				>
					Save
				</button>
			</div>
		</div>
	);
};

export default SiteSettings;
