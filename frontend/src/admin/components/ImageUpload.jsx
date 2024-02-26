import { useEffect, useRef, useState } from 'react';

let CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_NAME;
let imagesURL = [];

export const sendImageURL = () => {
	return imagesURL;
};

const ImageUpload = () => {
	const cloudinaryRef = useRef();
	const widgetRef = useRef();
	const [imagesURLState, setImagesURLState] = useState([]);

	useEffect(() => {
		imagesURL = []; // Reset the imagesURL array
		cloudinaryRef.current = window.cloudinary;
		widgetRef.current = cloudinaryRef.current.createUploadWidget(
			{
				cloudName: CLOUD_NAME,
				uploadPreset: 'product',
				cropping: true,
				croppingShowDimensions: true,
				croppingAspectRatio: 4 / 3,
				sources: ['local'],
				//maxImageWidth: ,
				//minImageWidth: 524,
				//maxImageHeight: 2048,
				//minImageHeight: ,
				theme: 'default',
			},
			(error, result) => {
				console.log('result: ', result);
				if (error) {
					console.log('error: ', error);
					return;
				}
				if (result.event === 'success') {
					// Push each successful upload's URL to the imagesURL array
					imagesURL.push(result.info.secure_url);
					setImagesURLState((prevState) => [
						...prevState,
						result.info.secure_url,
					]);
					console.log('image url: ', result.info.secure_url); //info.secure_url
				}
			}
		);

		return () => {
			// Destroy Cloudinary upload widget
			widgetRef.current.destroy();
		};
	}, []);

	const removeImage = (img) => {
		setImagesURLState((currentImages) =>
			currentImages.filter((image) => image !== img)
		);
	};

	return (
		<div className='flex flex-col justify-center'>
			<button className='btn-outline' onClick={() => widgetRef.current.open()}>
				Upload Image
			</button>
			<div className='my-4'>
				{imagesURLState.length > 0 && (
					<>
						<p>Added Images:</p>
						<div className='flex gap-2 items-center w-full overflow-x-scroll'>
							{imagesURLState.map((url, index) => (
								<div key={index} className='relative'>
									<img
										src={url}
										alt={`Selected Preview ${index + 1}`}
										className='w-auto h-[75px] inline-block rounded-md'
									/>
									<span
										onClick={() => removeImage(url)}
										className='absolute cursor-pointer px-1 py-[.05rem] bg-red-600 top-0 -right-1 bg-opacity-75 rounded-md text-sm text-white'
									>
										X
									</span>
								</div>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default ImageUpload;
