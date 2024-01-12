import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

//context
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';

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
				<CartProvider>
					<App />
				</CartProvider>
			</UserProvider>
		</SnackbarProvider>
	</BrowserRouter>
);
