import * as React from 'react';
import * as ReactDOM from 'react-dom';

import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/brands';

import './style.scss';

import Router from './routers/Router';
import App from './components/App/App';
import AuthCookieProvider from "./AuthCookieProvider";

ReactDOM.render(
    <AuthCookieProvider>
        <Router>
            <App />
        </Router>
    </AuthCookieProvider>,
    document.getElementById('root')
);
