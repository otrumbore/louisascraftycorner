import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ContentPage = () => {
	const { section } = useParams();
	const [content, setContent] = useState('');

	useEffect(() => {
		// Fetch content based on the URL parameter (section)
		// You can make API calls or set content based on the section parameter
		// For demonstration, setting static content based on section
		switch (section) {
			case 'terms':
				setContent(`Terms of Use

                1. Acceptance of Terms
                By accessing or using this website ("Site") operated by Louisa Trumbore, Odnel Trumbore, and affiliates at louisascrafts.com and louisascraftycorner.com with website by Odnel Trumbore, you agree to abide by these Terms of Use. If you do not agree with these terms, please refrain from using this Site.
                
                2. Use of the Site
                a. You must be at least 18 years old to use this Site. If you are under 18, you may only use the Site under the supervision of a parent or guardian.
                b. You agree not to use this Site for any unlawful purpose or in violation of any applicable laws or regulations.
                c. You agree not to disrupt, modify, or interfere with the proper functioning of the Site.
                
                3. Intellectual Property
                a. All content on this Site, including but not limited to text, graphics, logos, images, and software, is the property of louisascrafts.com and louisascraftycorner.com and is protected by copyright, trademark, and other intellectual property laws.
                b. You may not reproduce, distribute, or transmit any content from this Site without prior written permission from louisascrafts.com and louisascraftycorner.com.
                
                4. Product Information and Pricing
                a. We strive to provide accurate product information, but we do not warrant that product descriptions, images, pricing, or other content on the Site are accurate, complete, reliable, current, or error-free.
                b. Prices are subject to change without notice. We reserve the right to modify or discontinue products without liability.
                
                5. Privacy Policy
                Please refer to our Privacy Policy to understand how we collect, use, and protect your personal information.
                
                6. Limitation of Liability
                a. louisascrafts.com and louisascraftycorner.com shall not be liable for any indirect, incidental, special, or consequential damages arising out of the use or inability to use the Site.
                b. In no event shall louisascrafts.com and louisascraftycorner.com's total liability to you for all damages, losses, or causes of action exceed the amount paid by you, if any, for accessing the Site.
                
                7. Indemnification
                You agree to indemnify, defend, and hold harmless louisascrafts.com and louisascraftycorner.com from any claims, damages, liabilities, costs, or expenses arising from your use of the Site or violation of these Terms of Use.
                
                8. Governing Law
                These Terms of Use shall be governed by and construed in accordance with the laws of the United States and Pennsylvania, without regard to its conflict of law principles.
                
                9. Changes to Terms
                louisascrafts.com and louisascraftycorner.com reserves the right to revise or modify these Terms of Use at any time without prior notice. Continued use of the Site after such changes constitutes acceptance of the updated terms.
                
                If you have any questions about these Terms of Use, please contact us at louisascraftycorner@gmail.com.
                
                Last updated: 02/02/2024
                `);
				break;
			case 'privacy':
				setContent(`Privacy Policy
                
                LouisasCrafts.com and LouisasCraftyCorner.com ("we," "our," or "us") are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, disclose, and safeguard your personal information when you visit our website.
                
                1. Information We Collect
                a. Personal Information:
                   - We may collect personally identifiable information such as your name, email address, postal address, phone number, and payment information when voluntarily provided by you during account creation, purchases, or when contacting us.
                b. Non-Personal Information:
                   - We automatically collect certain non-personal information such as browser type, operating system, IP address, and website usage data through cookies and similar technologies.
                
                2. Use of Information
                a. We may use the collected information to:
                   - Process your orders, fulfill your requests, and provide customer service.
                   - Personalize your experience and improve our website.
                   - Send promotional emails, newsletters, or marketing communications if you have opted to receive them.
                b. We do not sell, trade, or rent your personal information to third parties unless required for providing services to you (e.g., shipping companies, payment processors) or as required by law.
                
                3. Cookies and Tracking Technologies
                a. We use cookies, web beacons, and similar tracking technologies to enhance user experience and gather information about your interactions with our website.
                b. You can control cookies through your browser settings; however, disabling cookies may limit your access to certain features of the website.
                
                4. Data Security
                a. We implement security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                b. However, no data transmission over the internet or method of storage is entirely secure. We cannot guarantee the absolute security of your information.
                
                5. Third-Party Links
                a. Our website may contain links to third-party websites or services not operated by us. We are not responsible for the privacy practices or content of these third-party sites.
                
                6. Children's Privacy
                a. Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us to have it removed.
                
                7. Changes to Privacy Policy
                a. We reserve the right to modify this Privacy Policy at any time. Updates will be posted on this page with a revised "Last Updated" date.
                
                8. Contact Us
                If you have any questions or concerns about our Privacy Policy or how we handle your information, please contact us at louisascraftycorner@gmail.com.
                
                By using LouisasCrafts.com and LouisasCraftyCorner.com, you agree to the terms of this Privacy Policy.

                Last Updated: 01/05/2024
                
                `);
				break;
			case 'help':
				setContent('Help/FAQ content coming soon!');
				break;
			default:
				setContent('Page not found...');
		}
		window.scroll(0, 0);
	}, [section]);

	return (
		<div className='p-4 min-h-[65vh] w-full flex justify-center'>
			<div className='flex flex-col items-center w-full max-w-[1400px]'>
				<h2 className='text-3xl uppercase'>{section}</h2>
				<div className='mt-8 w-full'>
					{/* Display content based on the URL parameter */}
					<p className='whitespace-pre-line'>{content}</p>
				</div>
			</div>
		</div>
	);
};

export default ContentPage;
