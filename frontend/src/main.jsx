import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

//context
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { useUser } from './context/UserContext';
import LoadingModal from './components/LoadingModal.jsx';

const AppWithProviders = () => {
	const { userDetails, loading } = useUser();

	// Check if user details are loaded
	if (loading) {
		// Render a loading state or component
		return <LoadingModal loading={loading} />;
	}

	// If user details are available, render the App and its providers
	return (
		<CartProvider>
			<App />
		</CartProvider>
	);
};

ReactDOM.createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<SnackbarProvider
			maxSnack={3}
			anchorOrigin={{
				horizontal: 'center',
				vertical: 'top',
			}}
			autoHideDuration={2000}
			dense={true}
			disableWindowBlurListener={true}
			preventDuplicate={true}
		>
			<UserProvider>
				<AppWithProviders />
			</UserProvider>
		</SnackbarProvider>
	</BrowserRouter>
);
