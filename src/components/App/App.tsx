import * as React from "react";
import {Route} from "react-router";

import Nav from '../Nav/Nav';
import Home from '../../pages/Home/Home';
import Login from '../../pages/Login/Login';
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
        <Route path="/admin">
            <Admin />
        </Route>
    </>
);

export default App;
