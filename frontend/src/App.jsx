import React from 'react';
import { Routes, Route } from 'react-router-dom';

//pages
import Home from './pages/Home';

//admin pages
import AdminHome from './admin/AdminHome';
import AddProduct from './admin/pages/AddProduct';
import EditProduct from './admin/pages/EditProduct';
import Navbar from './components/Navbar';
import ProductPage from './pages/ProductPage';
//import Hero from './components/Hero';

const App = () => {
	return (
		<>
			<Navbar />
			<Routes>
				{/* Regular Website Routes */}
				<Route path='/' element={<Home />} />
				<Route path='/product/:id' element={<ProductPage />} />

				{/* Admin Product Routes */}
				<Route path='/admin' element={<AdminHome />} />
				<Route path='/admin/addproduct' element={<AddProduct />} />
				<Route path='/admin/editproduct/:id' element={<EditProduct />} />

				{/* Admin Users Routes */}

				{/* Store User Routes */}
			</Routes>
		</>
	);
};
export default App;
