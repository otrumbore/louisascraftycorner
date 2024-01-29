import { useEffect, useRef, useState } from 'react';

let CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_NAME;

let imageURL = '';

export const sendImageURL = () => {
	return imageURL;
};

const ImageUpload = () => {
	const cloudinaryRef = useRef();
	const widgetRef = useRef();
	const [imageURLState, setImageURLState] = useState('');

	useEffect(() => {
		imageURL = '';
		cloudinaryRef.current = window.cloudinary;
		widgetRef.current = cloudinaryRef.current.createUploadWidget(
			{
				cloudName: CLOUD_NAME,
				uploadPreset: 'product',
				cropping: true,
				sources: ['local'],
				maxImageWidth: 1000,
				theme: 'blue',
			},
			function (error, result) {
				console.log('result: ', result);
				error && console.log('error: ', error);
				if (result.event === 'success') {
					imageURL = result.info.secure_url;
					setImageURLState(result.info.secure_url);
					//console.log('image url: ', result.info.secure_url); //info.secure_url
				}
			}
		);

		return () => {
			// Destroy Cloudinary upload widget
			widgetRef.current.destroy();
		};
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
