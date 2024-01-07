import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { BiShow } from 'react-icons/bi';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import ProductModal from './ProductModal';
import DeleteModal from '../DeleteModal';

const ProductsTable = ({ products }) => {
	const [showModal, setShowModal] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(null);

	const openModal = (productId) => {
		setShowModal(productId);
	};

	const closeModal = () => {
		setShowModal(null);
	};

	const openDeleteModal = (productId) => {
		setShowDeleteModal(productId);
	};

	const closeDeleteModal = () => {
		setShowDeleteModal(null);
	};

	return (
		<table className='w-full border-separate border-spacing-2'>
			<thead>
				<tr>
					<th className='border border-slate-600 rounded-md'>ID</th>
					<th className='border border-slate-600 rounded-md'>Name</th>
					<th className='border border-slate-600 rounded-md max-md:hidden'>
						Price
					</th>
					<th className='border border-slate-600 rounded-md max-md:hidden'>
						Sale
					</th>
					<th className='border border-slate-600 rounded-md'>QTY.</th>
					<th className='border border-slate-600 rounded-md max-md:hidden'>
						Rating
					</th>
					<th className='border border-slate-600 rounded-md'>Operations</th>
				</tr>
			</thead>
			<tbody>
				{products.map((product, index) => (
					<tr key={product._id} className='h-8'>
						<td className='border border-slate-700 rounded-md text-center'>
							{product.storeId}
						</td>

						<td className='border border-slate-700 rounded-md text-center'>
							{product.name}
						</td>
						<td className='border border-slate-700 rounded-md text-center max-md:hidden'>
							$
							{product.sale > 0 ? (
								<span className='line-through'>{product.price}</span>
							) : (
								product.price
							)}
						</td>

						<td className='border border-slate-700 rounded-md text-center max-md:hidden'>
							{product.sale > 0 ? (
								<span className='text-red-400'>${product.sale}</span>
							) : (
								'No Sale'
							)}
						</td>
						<td className='border border-slate-700 rounded-md text-center'>
							{product.inventory < 3 ? (
								<span className='text-red-400'>{product.inventory}</span>
							) : (
								product.inventory
							)}
						</td>
						<td className='border border-slate-700 rounded-md text-center max-md:hidden'>
							{product.rating}
						</td>
						<td className='border border-slate-700 rounded-md text-center'>
							<div className='flex justify-center items-center gap-x-4'>
								<BiShow
									className='text-3xl text-blue-800 hover:scale-150 cursor-pointer'
									onClick={() => openModal(product._id)}
								/>
								{/* <Link to={`/books/details/${product._id}`}>
									<BsInfoCircle className='text-2xl text-green-800' />
								</Link> */}
								<Link to={`/admin/editproduct/${product._id}`}>
									<AiOutlineEdit className='text-2xl text-yellow-600 hover:scale-150' />
								</Link>
								{/* <Link to={`/books/delete/${product._id}`}>
									<MdOutlineDelete className='text-2xl text-red-600' />
								</Link> */}
								<MdOutlineDelete
									className='text-2xl text-red-600 hover:scale-150 cursor-pointer'
									onClick={() => openDeleteModal(product._id)}
								/>
								{showModal === product._id && (
									<ProductModal product={product} onClose={closeModal} />
								)}
								{showDeleteModal === product._id && (
									<DeleteModal product={product} onClose={closeDeleteModal} />
								)}
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default ProductsTable;
