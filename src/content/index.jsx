import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthProvider from '../components/technical/AuthContext';

const rootElement = document.createElement('div');
rootElement.id = 'react-chrome-app';

document.body.prepend(rootElement);

const root = ReactDOM.createRoot(rootElement);
root.render(
	<React.StrictMode>
		<AuthProvider>
			<App />
		</AuthProvider>
	</React.StrictMode>
);
