import React from 'react';
import { css } from '@emotion/react';
import { PropagateLoader } from 'react-spinners';

const override = css`
	display: block;
	margin: 0 auto;
`;

const LoadingModal = ({ loading }) => {
	return (
		<div
			className={`fixed inset-0 overflow-y-auto bg-gray-800 bg-opacity-25 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center ${
				loading ? 'block' : 'hidden'
			}`}
		>
			<PropagateLoader
				color='#ffffff'
				loading={loading}
				css={override}
				size={15}
			/>
		</div>
	);
};

export default LoadingModal;
