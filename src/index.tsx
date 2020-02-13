import * as React from 'react';
import * as ReactDOM from 'react-dom';

// import '@fortawesome/fontawesome-free/js/fontawesome';
// import '@fortawesome/fontawesome-free/js/solid';
// import '@fortawesome/fontawesome-free/js/brands';

import '../node_modules/@fortawesome/fontawesome-free/scss/fontawesome.scss';
import '../node_modules/@fortawesome/fontawesome-free/scss/solid.scss';
import '../node_modules/@fortawesome/fontawesome-free/scss/brands.scss';

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
