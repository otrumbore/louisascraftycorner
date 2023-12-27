import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { LOCALIP } from '../config.js';

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
	const [contextValue, setContextValue] = useState([]);

	useEffect(() => {
		axios
			.get(`http://${LOCALIP}:5555/products`)
			.then((response) => {
				setContextValue(response.data.data);
			})
			.catch((error) => {
				console.log(error);
				alert('Could not find product');
				setLoading(false);
				navigate('/');
			});
	});

	return (
		<ShopContext.Provider value={contextValue}>
			{props.children}
		</ShopContext.Provider>
	);
};

export default ShopContextProvider;
