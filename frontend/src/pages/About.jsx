import React, { useEffect, useState } from 'react';
import { getAboutPage } from '../api/pages.api';

const About = () => {
	const [aboutData, setAboutData] = useState([]);

	const fetchAboutPage = async () => {
		try {
			const page = await getAboutPage();
			setAboutData(page);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchAboutPage();
		window.scroll(0, 0);
	}, []);

	return (
		<div className='w-full flex justify-center min-h-[65vh]'>
			<div className='p-4 w-full max-w-[1200px]'>
				<h2 className='text-3xl font-semibold text-center mb-8'>About</h2>
				<div className='flex justify-center '>
					<div
						className='w-[80%] p-4 border-4 border-primary rounded-md adminHTML'
						dangerouslySetInnerHTML={{ __html: aboutData.content }}
					/>
				</div>
			</div>
		</div>
	);
};

export default About;
