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
				className='text-gray-600 flex items-center space-x-2'
			>
				<FaArrowLeft size={30} />
				<span>Back</span>
			</div>
			<div className='mt-4 w-full flex justify-center'>
				<h3 className='text-2xl'>Order {orderNum}</h3>
			</div>
		</div>
	);
};

export default ViewOrder;
