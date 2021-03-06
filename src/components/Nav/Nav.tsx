import * as React from 'react';
import {useState} from 'react';
import {Link} from 'react-router-dom';
import {AuthLevel, AuthOnly, AuthOnlyOtherwise} from "../../contexts/AuthContext";

interface NavbarBrandProps {
    toggle: () => void;
}

interface NavbarBodyProps {
    toggled: boolean;
    children: React.ReactNode;
}

const NavbarBrand = ({toggle}: NavbarBrandProps) => (
    <div className="navbar-brand">
        <Link className="nav-item" to="/" style={{height: "52px"}}>
            <img src="/static/logo.png" style={{height: "52px", padding: "12px"}} />
        </Link>

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

    interface NavLinkProps {
        className?: string;
        children: React.ReactNode;
        to: string;
        onClick?: (event: React.MouseEvent<Link>) => void;

        // Allow any other properties
        [prop: string]: any;
    }

    const NavLink = ({className, children, to, onClick, ...props}: NavLinkProps) => {
        const extendedOnClick = (event: React.MouseEvent<Link>) => {
            setToggle(false);
            onClick?.(event);
        };
        const additionalClassName = typeof className !== 'undefined' ? className : '';
        return (
            <Link className={`navbar-item ${additionalClassName}`} to={to} onClick={extendedOnClick as any} {...props}>{children}</Link>
        );
    };

    return (
        <nav className="navbar is-fixed-top" style={{boxShadow: "0 2px 0 0 #f5f5f5"}}>
            <NavbarBrand toggle={toggle} />
            <NavbarBody toggled={toggled}>
                <NavbarItemLeft>
                    <NavLink to="/">Home</NavLink>
                    <AuthOnly level={AuthLevel.USER}>
                        <NavLink to="/files">Files</NavLink>
                    </AuthOnly>
                    <AuthOnly level={AuthLevel.ADMIN}>
                        <NavLink to="/admin">Admin</NavLink>
                    </AuthOnly>
                </NavbarItemLeft>
                <NavbarItemRight>
                    <AuthOnly>
                        <NavLink to="/logout">Logout</NavLink>
                        <AuthOnlyOtherwise>
                            <NavLink to="/login">Login</NavLink>
                        </AuthOnlyOtherwise>
                    </AuthOnly>
                </NavbarItemRight>
            </NavbarBody>
        </nav>
    );
};

export default Nav;
