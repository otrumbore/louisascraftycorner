import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // Import js-cookie

const CookiesNotice = () => {
	const [acknowledged, setAcknowledged] = useState(false);

	const handleAcknowledge = () => {
		// Set acknowledged to true when the user acknowledges the notice
		setAcknowledged(true);
		Cookies.set('cookieAcknowledged', 'true', { expires: 7 }); // Set the cookie with a 7-day duration
	};

	// Check if the user has already acknowledged the cookie notice
	const isAcknowledged = Cookies.get('cookieAcknowledged') === 'true';

	return (
		// Render the notice only if it has not been acknowledged
		!acknowledged &&
		!isAcknowledged && (
			<div className='fixed top-0 left-0 bg-primary bg-opacity-50 w-full h-full z-50 flex items-end justify-center'>
				<div className='bg-gray-200 w-full h-auto p-4 rounded-md bg-opacity-80 flex flex-col lg:flex-row justify-center'>
					<div className='w-full flex items-center max-w-[1200px]'>
						<p className=''>
							We use cookies to ensure you get the best experience on our
							website. By using our site, you acknowledge that you have read and
							understood our{' '}
							<a href='/info/privacy' className='text-blue-500'>
								Privacy Policy
							</a>
							.
						</p>
					</div>
					<button
						className='mt-4 btn w-full lg:max-w-[10rem]'
						onClick={handleAcknowledge}
					>
						Got it!
					</button>
				</div>
			</div>
		)
	);
};

export default CookiesNotice;
