import React from 'react';
import { Routes, Route } from 'react-router-dom';

//components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookiesNotice from './components/CookiesNotice';
import ToTop from './components/ToTop';

//pages
import Home from './pages/Home';
import Cart from './pages/Cart';
import Register from './pages/Register';
import Login from './pages/Login';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import Information from './pages/Information';
import NotFound from './pages/errors/NotFound';
import Success from './pages/cart/Success';
import ForgotUser from './pages/ForgotUser';
import PasswordReset from './pages/PasswordReset';

//admin pages
import AddProduct from './admin/pages/AddProduct';
import EditProduct from './admin/pages/EditProduct';
import ProductPage from './pages/ProductPage';
import AdminDashboard from './admin/AdminDashboard';
import EditPage from './admin/pages/EditPage';

//user pages
import Dashbord from './users/Dashbord';
import Logout from './users/Logout';
import Events from './pages/Events';
import About from './pages/About';

const App = () => {
	return (
		<div className='w-full'>
			<div className='mb-[8rem]'>
				<Navbar />
			</div>

			<Routes>
				{/* Regular Website Routes */}
				<Route path='/' element={<Home />} />
				<Route path='/product/:id' element={<ProductPage />} />
				<Route path='/cart' element={<Cart />} />
				<Route path='/register' element={<Register />} />
				<Route path='/login' element={<Login />} />
				<Route path='/login/:status' element={<Login />} />
				<Route path='/login/user/:userParam' element={<Login />} />
				<Route path='/shop' element={<Shop />} />
				<Route path='/contact' element={<Contact />} />
				<Route path='/info/:section' element={<Information />} />
				<Route path='/info/:section' element={<Information />} />
				<Route path='/info/:section' element={<Information />} />
				<Route path='/order/success/:orderId' element={<Success />} />
				<Route path='/events' element={<Events />} />
				<Route path='/about' element={<About />} />

				<Route path='*' element={<NotFound />} />

				{/* Admin Product/Page Routes */}
				<Route path='/admin' element={<AdminDashboard />} />
				<Route path='/admin/addproduct' element={<AddProduct />} />
				<Route path='/admin/editproduct/:id' element={<EditProduct />} />
				<Route path='/admin/editpage' element={<EditPage />} />

				{/* Store User Routes */}
				<Route path='/user/dashboard' element={<Dashbord />} />
				<Route path='/user/logout' element={<Logout />} />
				<Route path='/user/forgot/:page' element={<ForgotUser />} />
				<Route
					path='/user/reset-password/:emailToken'
					element={<PasswordReset />}
				/>
			</Routes>
			<Footer />
			<CookiesNotice />
			<ToTop />
		</div>
	);
};
export default App;
