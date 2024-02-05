/** @type {import('tailwindcss').Config} */

import { setTheme } from './src/assets/theme.js';

const currentTheme = 'default'; // Change this dynamically based on user preference

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: setTheme(currentTheme),
	plugins: [],
};
