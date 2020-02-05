import * as React from 'react';
import {useState} from 'react';
import {Link} from 'react-router-dom';
import {AuthOnly} from "../../contexts/AuthContext";

interface NavbarBrandProps {
    toggle: () => void;
}

interface NavbarBodyProps {
    toggled: boolean;
    children: React.ReactNode;
}

const NavbarBrand = ({toggle}: NavbarBrandProps) => (
    <div className="navbar-brand">
        <a className="nav-item" href="/" style={{height: "52px"}}>
            <img src="/static/logo.png" style={{height: "52px", padding: "12px"}} />
        </a>

        <a className="navbar-burger burger" onClick={toggle}>
            <span />
            <span />
            <span />
        </a>
    </div>
);

const NavbarItemLeft: React.FC = ({children}) => <>{children}</>;
const NavbarItemRight: React.FC = ({children}) => <>{children}</>;

const NavbarBody = ({toggled, children}: NavbarBodyProps) => {
    const leftItems = React.Children.map(children,
        (child) => (child as any)?.type === NavbarItemLeft ? child : null);
    const rightItems = React.Children.map(children,
        (child) => (child as any)?.type === NavbarItemRight ? child : null);

    return (
        <div className={"navbar-menu" + (toggled ? " is-active" : "")}>
            <div className="navbar-start">
                {leftItems}
            </div>
            <div className="navbar-end">
                {rightItems}
            </div>
        </div>
    );
};

const Nav = () => {
    const [toggled, setToggle] = useState(false);
    const toggle = () => setToggle(toggled => !toggled);

    return (
        <nav className="navbar is-fixed-top" style={{boxShadow: "0 2px 0 0 #f5f5f5"}}>
            <NavbarBrand toggle={toggle} />
            <NavbarBody toggled={toggled}>
                <NavbarItemLeft>
                    <Link className="navbar-item" to="/">Home</Link>
                    <AuthOnly>
                        <Link className="navbar-item" to="/admin">Admin</Link>
                    </AuthOnly>
                </NavbarItemLeft>
                <NavbarItemRight>
                    <Link className="navbar-item" to="/login">Login</Link>
                </NavbarItemRight>
            </NavbarBody>
        </nav>
    );
};

export default Nav;
