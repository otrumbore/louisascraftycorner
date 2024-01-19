import { useEffect, useRef, useState } from 'react';

let imgURL = '';

export const sendImageURL = () => {
	return imgURL;
};

const ImageUpload = () => {
	const cloudinaryRef = useRef();
	const widgetRef = useRef();
	const [imageURL, setImageURL] = useState('');

	useEffect(() => {
		cloudinaryRef.current = window.cloudinary;
		widgetRef.current = cloudinaryRef.current.createUploadWidget(
			{
				cloudName: 'dedinrpix',
				uploadPreset: 'product',
			},
			function (error, result) {
				console.log('result: ', result);
				// Handle the result or error here
				//setImageURL(result);
				if (result.event === 'success') {
					imgURL = result.info.secure_url;
					setImageURL(imgURL);
					//console.log('image url: ', result.info.secure_url); //info.secure_url
				}
			}
		);
	}, []);

	return (
		<div className='flex flex-col justify-center'>
			<button className='btn-outline' onClick={() => widgetRef.current.open()}>
				Upload Image
			</button>
			<div className='my-4'>
				{imageURL && (
					<div className='flex flex-col justify-center items-center'>
						New Image:
						<img
							src={imageURL}
							alt='Selected Preview'
							style={{ maxWidth: '50%', marginTop: '8px' }}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default ImageUpload;
