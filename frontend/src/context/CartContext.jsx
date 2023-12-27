// CartContext.js
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export function useCart() {
	return useContext(CartContext);
}

export function CartProvider({ children }) {
	const [cartItems, setCartItems] = useState([]);

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

	const removeFromCart = (itemId) => {
		const updatedCart = cartItems.filter((item) => item._id !== itemId);
		setCartItems(updatedCart);
	};

	const clearCart = () => {
		setCartItems([]);
	};

	const cartTotal = () => {
		// Calculate total cart value
		// Example calculation:
		const total = cartItems.reduce(
			(total, item) => total + item.qty * item.price,
			0
		);
		return total;
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
			setCartItems(cartItems);
		}
	};

	return (
		<CartContext.Provider
			value={{
				cartItems,
				addToCart,
				removeFromCart,
				clearCart,
				cartTotal,
				cartItemsCount,
				updateCartItem,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}
