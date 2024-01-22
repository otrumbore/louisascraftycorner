import { Link } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';

const BackButton = ({ destination = '/admin' }) => {
	return (
		<div className='flex'>
			<Link to={destination} className='btn px-4'>
				<BsArrowLeft className='text-2xl' />
			</Link>
		</div>
	);
};

export default BackButton;
