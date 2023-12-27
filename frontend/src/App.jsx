import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

//components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

//pages
import Home from './pages/Home';

//admin pages
import AdminHome from './admin/AdminHome';
import AddProduct from './admin/pages/AddProduct';
import EditProduct from './admin/pages/EditProduct';
import ProductPage from './pages/ProductPage';
import SiteSettings from './admin/pages/SiteSettings';
//import Hero from './components/Hero';

import ShopContextProvider from './context/ShopContext';
import Cart from './pages/Cart';

const App = () => {
	return (
		<CartProvider>
			<Navbar />
			<Routes>
				{/* Regular Website Routes */}
				<Route path='/' element={<Home />} />
				<Route path='/product/:id' element={<ProductPage />} />
				<Route path='/cart' element={<Cart />} />

				{/* Admin Product Routes */}
				<Route path='/admin' element={<AdminHome />} />
				<Route path='/admin/addproduct' element={<AddProduct />} />
				<Route path='/admin/editproduct/:id' element={<EditProduct />} />
				<Route path='/admin/site_settings/:id' element={<SiteSettings />} />

				{/* Admin Users Routes */}

				{/* Store User Routes */}
			</Routes>
			<Footer />
		</CartProvider>
	);
};
export default App;
