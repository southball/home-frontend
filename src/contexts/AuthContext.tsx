import * as React from 'react';
import {useState} from "react";

const AuthContext = React.createContext<AuthData>(null);

interface AuthData {
    token?: string;
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

enum AuthLevel {
    USER,
    ADMIN
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
        {(authData: AuthData) => (console.log(authData), children(authData))}
    </AuthContext.Consumer>
);

export const AuthOnly = ({ children, level }: AuthOnlyProps) => {
    const authDisplay = React.Children.map(children,
        (child) => (child as any)?.type !== AuthOnlyOtherwise ? child : null);
    const noAuthDisplay = React.Children.map(children,
        (child) => (child as any)?.type === AuthOnlyOtherwise ? child : null);

    // TODO fix authentication level check
    return (
        <AuthConsumer>
            {(authData) => (
                authData.token
                    ? authDisplay
                    : noAuthDisplay
            )}
        </AuthConsumer>
    )
};

export const AuthOnlyOtherwise = ({children}: AuthOnlyOtherwiseProps) => <>{children}</>;

export default AuthContext;
