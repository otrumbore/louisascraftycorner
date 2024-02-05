export const setTheme = (theme) => {
	let primaryColor;
	let secondaryColor;
	let darkPrimaryColor;

	switch (theme) {
		case 'easter':
			primaryColor = '#87CEEB';
			secondaryColor = '#FFC0CB';
			break;
		case 'christmas':
			primaryColor = '#289049';
			secondaryColor = '#FF0000';
			break;
		case 'valentine':
			primaryColor = '#E3A4C5';
			secondaryColor = '#FF0000';
			break;
		case 'default':
		default:
			primaryColor = '#0066b2';
			secondaryColor = '#00CCCC';
			break;
	}

	darkPrimaryColor = darken(primaryColor, 90);

	return {
		extend: {
			colors: {
				primary: primaryColor,
				dark_primary: darkPrimaryColor,
				secondary: secondaryColor,
			},
		},
	};
};

// Helper function to darken a color
function darken(color, percent) {
	const num = parseInt(color.slice(1), 16);
	const amt = Math.round(2.55 * percent);
	const r = (num >> 16) - amt;
	const b = ((num >> 8) & 0x00ff) - amt;
	const g = (num & 0x0000ff) - amt;

	return `#${((1 << 24) | (r << 16) | (b << 8) | g).toString(16).slice(1)}`;
}
