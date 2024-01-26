import React, { useEffect, useState } from 'react';
import getSettings, { updateSetting } from '../../../api/siteSettings.api';
import { useSnackbar } from 'notistack';
import { MdDeleteForever } from 'react-icons/md';

const Settings = () => {
	const [loading, setLoading] = useState(false);
	const [websiteBanner, setWebsiteBanner] = useState('');
	const [collections, setCollections] = useState([]);
	const [addCollection, setAddCollection] = useState('');
	const { enqueueSnackbar } = useSnackbar();
	const [collectionSelect, setCollectionSelect] = useState('');

	const fetchSettings = async () => {
		setLoading(true);
		try {
			const fetchedSettings = await getSettings();
			setCollections(fetchedSettings.collections);
			setWebsiteBanner(fetchedSettings.website_banner);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const sendUpdateSettings = async (updatedData) => {
		setLoading(true);
		try {
			await updateSetting(updatedData);
			fetchSettings();
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleCollectionAddChange = () => {
		let updatedCollections = [...collections];

		if (collectionSelect === 'new' && addCollection.trim() !== '') {
			// Adding a new collection
			updatedCollections.push({ name: addCollection });
			enqueueSnackbar(`Collection "${addCollection}" added.`, {
				variant: 'success',
			});
		} else if (collectionSelect !== 'new' && addCollection.trim() !== '') {
			// Changing the existing collection
			updatedCollections = updatedCollections.map((collection) =>
				collection.name === collectionSelect
					? { ...collection, name: addCollection }
					: collection
			);
			enqueueSnackbar(
				`Collection "${collectionSelect}" changed to "${addCollection}".`,
				{
					variant: 'success',
				}
			);
		} else {
			enqueueSnackbar('Please enter a valid collection name.', {
				variant: 'error',
			});
			return;
		}

		const updatedData = { collections: updatedCollections };
		sendUpdateSettings(updatedData);

		setCollections(updatedCollections);
		setCollectionSelect('');
		setAddCollection('');
	};

	// Add this function to your component
	const handleDeleteCollection = () => {
		if (collectionSelect !== '' && collectionSelect !== 'new') {
			// Filter out the selected collection
			const updatedCollections = collections.filter(
				(collection) => collection.name !== collectionSelect
			);

			// Update state and perform any additional actions
			setCollections(updatedCollections);
			setCollectionSelect('');
			setAddCollection('');

			// You can also perform other actions like making an API call to delete the collection on the server
			// Example: deleteCollectionOnServer(collectionSelect);
			const updatedData = { collections: updatedCollections };
			sendUpdateSettings(updatedData);

			enqueueSnackbar(`Collection "${collectionSelect}" deleted.`, {
				variant: 'success',
			});
		} else {
			enqueueSnackbar('Please select a valid collection to delete.', {
				variant: 'error',
			});
		}
	};

	const handleSaveSettings = () => {
		try {
			const data = { website_banner: websiteBanner };
			sendUpdateSettings(data);
			enqueueSnackbar(`Changed webiste banner!`, {
				variant: 'success',
			});
		} catch (error) {
			console.log(error);
			enqueueSnackbar(`could not update website banner`, {
				variant: 'error',
			});
		}
	};

	useEffect(() => {
		fetchSettings();
		window.scroll(0, 0);
	}, []);

	return (
		<>
			<div className='mt-4 flex flex-col-reverse lg:flex-row justify-between items-start gap-4'>
				<div className='border-4 w-full border-primary p-4 rounded-md lg:w-[50%]'>
					<h3 className='text-xl border-b-4 pb-2 mb-2'>Main Settings</h3>
					<div className='grid grid-flow-row gap-4'>
						<div className='grid items-center grid-cols-[1fr,2fr]'>
							<h4 className='text-xl'>Banner</h4>
							<input
								className='input py-1'
								onChange={(e) => setWebsiteBanner(e.target.value)}
								value={websiteBanner}
							/>
						</div>
						<div className='grid items-center grid-cols-[1fr,2fr]'>
							<h4 className='text-xl'>Rewards</h4>
							<div className='itens-center'>
								<select value={true} className='input py-2'>
									<option value={true}>ON</option>
									<option value={false}>OFF</option>
								</select>
							</div>
						</div>
					</div>
					<div className='mt-4 flex justify-end'>
						<button className='btn' onClick={handleSaveSettings}>
							Save
						</button>
					</div>
				</div>
				<div className='border-4 w-full border-primary p-4 rounded-md lg:w-[50%]'>
					<div className='flex w-full justify-between items-center border-b-4 pb-2 mb-2'>
						<div>
							<h3 className='text-xl'>Product Settings</h3>
						</div>
					</div>
					<div className='flex flex-col gap-2 justify-center'>
						<div className='flex justify-between items-center'>
							<h4 className='text-xl'>Collections:</h4>
							<select
								className='px-4 py-1 w-fit border-4 border-primary rounded-md'
								value={collectionSelect}
								onChange={(e) => setCollectionSelect(e.target.value)}
							>
								<option value=''>Select Collection</option>
								<option value='new'>Add New...</option>
								{collections.map((item, i) => (
									<option key={i} value={item.name}>
										{item.name}
									</option>
								))}
							</select>
							<div>
								{collectionSelect !== '' && (
									<button
										className='btn-ghost p-2 text-red-600'
										onClick={handleDeleteCollection}
									>
										<MdDeleteForever size={30} />
									</button>
								)}
							</div>
						</div>
						{collectionSelect !== '' && (
							<div className='flex gap-2'>
								<input
									type='text'
									className='input py-1'
									placeholder={
										collectionSelect !== 'new'
											? collectionSelect
											: 'Add Collection'
									}
									//value={}
									onChange={(e) => setAddCollection(e.target.value)}
								/>
								<button className='btn' onClick={handleCollectionAddChange}>
									{collectionSelect === 'new' ? 'Add' : 'Change'}
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Settings;
