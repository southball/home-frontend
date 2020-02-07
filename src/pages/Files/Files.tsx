import * as React from 'react';
import {AuthLevel, AuthOnly, AuthOnlyOtherwise} from "../../contexts/AuthContext";

const Files = () => (
    <div className="container main-container">
        <AuthOnly level={AuthLevel.USER}>
            <h1 className="title">Files</h1>

            <AuthOnlyOtherwise>
                You cannot view this page.
            </AuthOnlyOtherwise>
        </AuthOnly>
    </div>
);

export default Files;
