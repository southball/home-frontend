import * as React from 'react';

const Login = () => (
    <div className="container main-container">
        <h1 className="title">Login</h1>
        <a href="/api/auth/login">
            <button className="button">
                <span className="icon">
                    <i className="fab fa-google" />
                </span>
                <span>Login with Google</span>
            </button>
        </a>
    </div>
);

export default Login;
