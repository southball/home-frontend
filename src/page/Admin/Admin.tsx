import * as React from 'react';
import {AuthOnly, AuthOnlyOtherwise} from "../../context/AuthContext";

const Admin: React.FC = () => (
    <div className="container main-container">
        <AuthOnly>
            <h1>Admin Page</h1>

            <AuthOnlyOtherwise>
                You cannot view this page.
            </AuthOnlyOtherwise>
        </AuthOnly>
    </div>
);

export default Admin;
