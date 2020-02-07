import * as React from 'react';
import {AuthLevel, AuthOnly, AuthOnlyOtherwise} from "../../contexts/AuthContext";

const Admin: React.FC = () => (
    <div className="container main-container">
        <AuthOnly level={AuthLevel.ADMIN}>
            <h1 className="title">Admin</h1>

            <AuthOnlyOtherwise>
                You cannot view this page.
            </AuthOnlyOtherwise>
        </AuthOnly>
    </div>
);

export default Admin;
