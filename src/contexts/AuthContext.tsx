import * as React from 'react';
import {useState} from 'react';

const AuthContext = React.createContext<AuthData>({});

export interface AuthData {
    token?: string;
    permissionLevel?: string;
}

interface AuthProviderProps {
    children: (childrenProps: AuthProviderChildrenProps) => JSX.Element;
    defaultAuthData: AuthData;
}

interface AuthProviderChildrenProps {
    authData: AuthData;
    setAuthData: (authData: AuthData) => void;
}

interface AuthConsumerProps {
    children: (authData: AuthData) => React.ReactNode;
}

interface AuthOnlyProps {
    children: React.ReactNode;
    level?: AuthLevel;
}

interface AuthOnlyOtherwiseProps {
    children: React.ReactNode;
}

export enum AuthLevel {
    NONE = -1,
    VISITOR = 0,
    USER = 1,
    ADMIN = 2
}

function toAuthLevel(permissionLevel?: string): AuthLevel {
    if (permissionLevel === 'visitor')
        return AuthLevel.VISITOR;
    if (permissionLevel === 'user')
        return AuthLevel.USER;
    if (permissionLevel === 'admin')
        return AuthLevel.ADMIN;
    return AuthLevel.NONE;
}

export const AuthProvider = ({ defaultAuthData, children }: AuthProviderProps) => {
    const [authData, setAuthData] = useState(defaultAuthData);
    return (
        <AuthContext.Provider value={authData}>
            {children({ authData, setAuthData })}
        </AuthContext.Provider>
    );
};

export const AuthConsumer = ({ children }: AuthConsumerProps) => (
    <AuthContext.Consumer>
        {(authData: AuthData) => children(authData)}
    </AuthContext.Consumer>
);

export const AuthOnly = ({ children, level }: AuthOnlyProps) => {
    const authDisplay = React.Children.map(children,
        (child) => (child as any)?.type !== AuthOnlyOtherwise ? child : null);
    const noAuthDisplay = React.Children.map(children,
        (child) => (child as any)?.type === AuthOnlyOtherwise ? child : null);

    const requiredLevel = typeof level !== 'undefined' ? level : AuthLevel.NONE;

    // TODO fix authentication level check
    return (
        <AuthConsumer>
            {(authData) => (
                authData.token && toAuthLevel(authData.permissionLevel) >= requiredLevel
                    ? authDisplay
                    : noAuthDisplay
            )}
        </AuthConsumer>
    )
};

export const AuthOnlyOtherwise = ({children}: AuthOnlyOtherwiseProps) => <>{children}</>;

export default AuthContext;
