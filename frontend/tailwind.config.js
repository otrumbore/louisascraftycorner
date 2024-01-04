/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#78A1BB',
				dark_primary: '#283044',
				secondary: '#EBF5EE',
				brown: '#BFA89E',
				dark_brown: '#8B786D',
				dark_gray: '#484349',
				light_gray: '#F7F0F0',
				aqua: '#8AF3FF',
				teal: '#18A999',
				purple: '#80A4ED',
				light_purple: '#BCD3F2',
			},
		},
	},
	plugins: [],
};
