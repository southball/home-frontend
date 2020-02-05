import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './style.scss';

import Router from './routers/Router';
import App from './components/App/App';
import {AuthProvider} from "./contexts/AuthContext";

ReactDOM.render(
    <AuthProvider defaultAuthData={{ token: 'test' }}>
        {() =>
            <Router>
                <App />
            </Router>
        }
    </AuthProvider>,
    document.getElementById('root')
);
