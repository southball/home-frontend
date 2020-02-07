import * as React from 'react';
import AuthContext, {AuthLevel, AuthOnly, AuthOnlyOtherwise} from "../../contexts/AuthContext";
import FileManager from '../../components/FileManager/FileManager';
import {useContext} from "react";

const Files = () => {
    const authData = useContext(AuthContext);

    return (
        <div className="container main-container">
            <AuthOnly level={AuthLevel.USER}>
                <h1 className="title">Files</h1>
                <FileManager token={authData.token as string} />

                <AuthOnlyOtherwise>
                    You cannot view this page.
                </AuthOnlyOtherwise>
            </AuthOnly>
        </div>
    );
};

export default Files;
