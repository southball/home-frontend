import * as React from 'react';
import AuthContext, {AuthData} from "./contexts/AuthContext";
import * as Cookies from 'js-cookie';

interface AuthCookieProviderState {
    authData: AuthData;
}

class AuthCookieProvider extends React.Component<{}, AuthCookieProviderState> {
    public constructor(props: any) {
        super(props);

        this.state = {
            authData: {}
        };

        // Fetch from cookie
        if (Cookies.get('session-token') && Cookies.get('session-permissionLevel')) {
            this.state = {
                authData: {
                    token: Cookies.get('session-token'),
                    permissionLevel: Cookies.get('session-permissionLevel'),
                },
            };

            console.log('Detected authData from cookie:', this.state.authData);
            console.log('Removing authData from cookie.');
            Cookies.remove('session-token');
            Cookies.remove('session-permissionLevel');

            console.log('Storing authData to localStorage.');
            localStorage.setItem('session-token', this.state.authData.token as string);
            localStorage.setItem('session-permissionLevel', this.state.authData.permissionLevel as string);
        }

        // Fetch from localStorage
        else if (localStorage.getItem('session-token') !== null && localStorage.getItem('session-permissionLevel') !== null) {
            this.state = {
                authData: {
                    token: localStorage.getItem('session-token') as string,
                    permissionLevel: localStorage.getItem('session-permissionLevel') as string,
                },
            };
            console.log('Detected authData from localStorage:', this.state.authData);
        }
    }

    public render() {
        return (
            <AuthContext.Provider value={this.state.authData}>
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}

export default AuthCookieProvider;
