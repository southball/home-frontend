import * as React from 'react';
import {useHistory} from 'react-router-dom';

function Logout() {
    const history = useHistory();

    const logout = () => {
        localStorage.removeItem('session-token');
        localStorage.removeItem('session-permissionLevel');
        history.push("/");
        document.location.reload();
    };

    return (
        <div className="container main-container">
            <h1 className="title">Logout</h1>
            <button className="button" onClick={logout}>
                        <span className="icon">
                            <i className="fas fa-sign-out-alt" />
                        </span>
                <span>Logout</span>
            </button>
        </div>
    );
}

export default Logout;
