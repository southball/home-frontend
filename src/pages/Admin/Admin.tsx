import * as React from 'react';
import AuthContext, {AuthLevel, AuthOnly, AuthOnlyOtherwise} from "../../contexts/AuthContext";
import {useContext} from "react";
import {Link, Redirect, Route, useHistory} from "react-router-dom";
import UserManager from "../../components/UserManager/UserManager";
import AnnouncementManager from "../../components/AnnouncementManager/AnnouncementManager";

const Admin: React.FC = () => {
    const authData = useContext(AuthContext);
    const history = useHistory();

    console.log(history);

    const TabLink = ({to, children}: {to: string, children: React.ReactNode}) => (
        <li className={history.location.pathname.startsWith(to) ? "is-active" : ""}>
            <Link to={to}>{children}</Link>
        </li>
    );

    return (
        <div className="container main-container">
            <AuthOnly level={AuthLevel.ADMIN}>
                <h1 className="title">Admin</h1>

                <div className="tabs is-boxed">
                    <ul>
                        <TabLink to="/admin/users">Users</TabLink>
                        <TabLink to="/admin/announcements">Announcements</TabLink>
                    </ul>
                </div>

                <Route path="/admin/users">
                    <UserManager token={authData.token as string} />
                </Route>

                <Route path="/admin/announcements">
                    <AnnouncementManager token={authData.token as string} />
                </Route>

                <Redirect strict exact from="/admin" to="/admin/users" />

                <AuthOnlyOtherwise>
                    You cannot view this page.
                </AuthOnlyOtherwise>
            </AuthOnly>
        </div>
    );
};

export default Admin;
