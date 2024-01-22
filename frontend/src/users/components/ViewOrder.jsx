import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const ViewOrder = ({ orderNum, setViewOrder }) => {
	return (
		<div className='w-full'>
			<div
				onClick={() => {
					setViewOrder('');
				}}
				className='btn-outline w-fit px-3 py-1 flex items-center space-x-2 cursor-pointer'
			>
				<FaArrowLeft size={30} />
				<span className='hidden lg:block'>Back</span>
			</div>
			<div className='w-full flex justify-center'>
				<h3 className='text-2xl'>Order #{orderNum}</h3>
			</div>
		</div>
	);
};

export default ViewOrder;
