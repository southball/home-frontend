import * as React from 'react';
import {Route} from 'react-router';

import Nav from '../Nav/Nav';
import Home from '../../pages/Home/Home';
import Login from '../../pages/Login/Login';
import Logout from '../../pages/Logout/Logout';
import Files from '../../pages/Files/Files';
import Admin from '../../pages/Admin/Admin';

const App = () => (
    <>
        <Nav />
        <Route exact path="/">
            <Home />
        </Route>
        <Route exact path="/login">
            <Login />
        </Route>
        <Route exact path="/logout">
            <Logout />
        </Route>
        <Route path="/admin">
            <Admin />
        </Route>
        <Route path="/files">
            <Files />
        </Route>
    </>
);

export default App;
