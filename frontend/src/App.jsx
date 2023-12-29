import React from 'react';
import { Routes, Route } from 'react-router-dom';

//context
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';

//components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

//pages
import Home from './pages/Home';
import Cart from './pages/Cart';
import Register from './pages/Register';
import Login from './pages/Login';

//admin pages
import AdminHome from './admin/AdminHome';
import AddProduct from './admin/pages/AddProduct';
import EditProduct from './admin/pages/EditProduct';
import ProductPage from './pages/ProductPage';
import SiteSettings from './admin/pages/SiteSettings';

//user pages
import Dashbord from './users/Dashbord';
import Logout from './users/Logout';

const App = () => {
	return (
		<UserProvider>
			<CartProvider>
				<Navbar />
				<Routes>
					{/* Regular Website Routes */}
					<Route path='/' element={<Home />} />
					<Route path='/product/:id' element={<ProductPage />} />
					<Route path='/cart' element={<Cart />} />
					<Route path='/register' element={<Register />} />
					<Route path='/login' element={<Login />} />

					{/* Admin Product Routes */}
					<Route path='/admin' element={<AdminHome />} />
					<Route path='/admin/addproduct' element={<AddProduct />} />
					<Route path='/admin/editproduct/:id' element={<EditProduct />} />
					<Route path='/admin/site_settings' element={<SiteSettings />} />

					{/* Admin Users Routes */}

					{/* Store User Routes */}
					<Route path='/user/dashboard' element={<Dashbord />} />
					<Route path='/user/logout' element={<Logout />} />
				</Routes>
				<Footer />
			</CartProvider>
		</UserProvider>
	);
};
export default App;
