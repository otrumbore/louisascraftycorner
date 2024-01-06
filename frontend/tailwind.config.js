/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#0066b2',
				dark_primary: '#002D62',
				secondary: '#00CCCC',
			},
		},
	},
	plugins: [],
};
