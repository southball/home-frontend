import * as React from "react";
import {Route} from "react-router";

import Nav from '../Nav/Nav';
import Home from '../../page/Home/Home';
import Login from '../../page/Login/Login';
import Admin from '../../page/Admin/Admin';

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
