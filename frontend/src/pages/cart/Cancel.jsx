import React, { useState } from 'react';
import LoadingModal from '../../components/LoadingModal';
import { useCart } from '../../context/CartContext';

const Cancel = () => {
	const [loading, setLoading] = useState(true);

	const { cartItems } = useCart();

	return <LoadingModal loading={loading} />;
};

export default Cancel;
