// CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
	return useContext(CartContext);
}

export function CartProvider({ children }) {
	const [cartItems, setCartItems] = useState([]);
	const [lastUpdatedTime, setLastUpdatedTime] = useState(null);

	// Load cart from localStorage when component mounts
	useEffect(() => {
		const storedCart = localStorage.getItem('cartItems');
		const storedTime = localStorage.getItem('lastUpdatedTime');
		if (storedCart && storedTime) {
			setCartItems(JSON.parse(storedCart));
			setLastUpdatedTime(Number(storedTime));
		}
	}, []);

	// Save cart to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem('cartItems', JSON.stringify(cartItems));
		localStorage.setItem('lastUpdatedTime', Date.now());
	}, [cartItems]);

	// Check if 48 hours have elapsed since the last update, then clear cart
	useEffect(() => {
		const MAX_TIME_DIFF = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
		const currentTime = Date.now();
		if (lastUpdatedTime && currentTime - lastUpdatedTime > MAX_TIME_DIFF) {
			setCartItems([]);
			setLastUpdatedTime(null);
			localStorage.removeItem('cartItems');
			localStorage.removeItem('lastUpdatedTime');
		}
	}, [lastUpdatedTime]);

	const addToCart = (product, quantity) => {
		const existingItemIndex = cartItems.findIndex(
			(item) => item._id === product._id
		);

		if (existingItemIndex !== -1) {
			const updatedCartItems = [...cartItems];
			updatedCartItems[existingItemIndex].qty += quantity;
			setCartItems(updatedCartItems);
		} else {
			setCartItems([...cartItems, { ...product, qty: quantity }]);
		}
	};

	const updateAllCartItems = (allItems) => {
		setCartItems(allItems);
	};

	const removeFromCart = (itemId) => {
		const updatedCart = cartItems.filter((item) => item._id !== itemId);
		setCartItems(updatedCart);
	};

	const clearCart = () => {
		setCartItems([]);
	};

	const cartSubTotal = () => {
		const total = cartItems.reduce(
			(total, item) => total + item.qty * item.price,
			0
		);
		return total;
	};

	const cartSalesTotal = () => {
		const totalSavings = cartItems.reduce((total, item) => {
			if (item.sale > 0) {
				return total + item.qty * (item.price - item.sale); // Fix calculation
			}
			return total;
		}, 0);
		return totalSavings;
	};

	const cartTotal = () => {
		const subTotal = cartSubTotal();
		const savings = cartSalesTotal();
		const totalAfterSales = subTotal - savings;
		return totalAfterSales;
	};

	const cartItemsCount = () => {
		const totalQuantity = cartItems.reduce(
			(count, item) => count + item.qty,
			0
		);
		return totalQuantity;
	};

	const updateCartItem = (itemId, newQty) => {
		// Remove the old item from the cart
		const updatedCartItems = cartItems.filter((item) => item._id !== itemId);

		// Find the product to be updated (if it exists)
		const productToUpdate = cartItems.find((item) => item._id === itemId);

		if (productToUpdate) {
			// Add the updated item with the new quantity
			setCartItems([...updatedCartItems, { ...productToUpdate, qty: newQty }]);
		} else {
			// If the item was not found, retain the existing cart items
			setCartItems(updatedCartItems);
		}
	};

	return (
		<CartContext.Provider
			value={{
				cartItems,
				addToCart,
				removeFromCart,
				clearCart,
				cartSubTotal,
				cartItemsCount,
				updateCartItem,
				cartSalesTotal,
				cartTotal,
				updateAllCartItems,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}
