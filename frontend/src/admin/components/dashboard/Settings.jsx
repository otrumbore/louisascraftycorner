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
			console.log(fetchedSettings);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const sendUpdateSettings = async (updatedData) => {
		setLoading(true);
		try {
			console.log(updatedData);
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
					<div className='flex flex-col gap-2'>
						<div className='flex w-full gap-2 items-center'>
							<h4 className='text-xl w-[25%]'>Website Banner</h4>
							<input
								className='input py-1'
								onChange={(e) => setWebsiteBanner(e.target.value)}
								value={websiteBanner}
							/>
						</div>
						<div>
							<div className='flex mt-4 w-full gap-2 items-center'>
								<h4 className='text-xl w-[20%]'>Toggles</h4>
								<div className='itens-center'>
									<input
										class="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
										type='checkbox'
										role='switch'
										checked
										id='flexSwitchCheckDefault'
									/>
									<label
										class='inline-block pl-[0.15rem] hover:cursor-pointer'
										for='flexSwitchCheckDefault'
									>
										Reward System
									</label>
								</div>
							</div>
						</div>
						<div className='flex justify-end'>
							<button className='btn' onClick={handleSaveSettings}>
								Save
							</button>
						</div>
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
							<h5 className=''>Collections:</h5>
							<select
								className='px-4 py-1 w-fit border-4 border-primary rounded-md'
								value={collectionSelect}
								onChange={(e) => setCollectionSelect(e.target.value)}
							>
								<option value=''>Select Collection</option>
								{collections.map((item, i) => (
									<option key={i} value={item.name}>
										{item.name}
									</option>
								))}
								<option value='new'>Add New...</option>
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
