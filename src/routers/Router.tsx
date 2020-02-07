import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';

class Router extends React.PureComponent {
    public render() {
        return (
            <BrowserRouter>
                {this.props.children}
            </BrowserRouter>
        );
    }
}

export default Router;
