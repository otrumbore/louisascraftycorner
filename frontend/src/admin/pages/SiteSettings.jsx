import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import LoadingModal from '../../components/LoadingModal';
import { LOCALIP } from '../../config';

const SiteSettings = () => {
	const [websiteBanner, setWebsiteBanner] = useState('');

	const { id } = useParams();

	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		setLoading(true);
		axios
			.get(`http://${LOCALIP}:5555/products/${id}`)
			.then((response) => {
				setWebsiteBanner(response.data.data.storeId);

				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				enqueueSnackbar('Could not retrieve product', {
					variant: 'error',
					anchorOrigin: { horizontal: 'right', vertical: 'top' },
				});
				console.log(error);
				navigate('/admin');
			});
	}, []);

	const handleEditWebsiteSettings = () => {
		//const id = storeId;
		const data = {
			websiteBanner,
		};
		setLoading(true);
		console.log(id);
		axios
			.put(`http://${LOCALIP}:5555/products/${id}`, data)
			.then(() => {
				setLoading(false);
				enqueueSnackbar('Product updated', {
					variant: 'success',
					anchorOrigin: { horizontal: 'right', vertical: 'top' },
				});
				navigate('/admin');
			})
			.catch((error) => {
				setLoading(false);
				enqueueSnackbar('Could not update product', {
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
				<button className='p-2 bg-sky-300 m-8' onClick={handleEditProduct}>
					Save
				</button>
			</div>
		</div>
	);
};

export default SiteSettings;
