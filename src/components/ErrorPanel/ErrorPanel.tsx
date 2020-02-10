import * as React from 'react';

import './ErrorPanel.scss';
import {Panel, PanelBlock} from "../Panel/Panel";
import {CSSTransition} from "react-transition-group";

interface ErrorPanelProps {
    show: boolean;
}

const ErrorPanel: React.FC<ErrorPanelProps> = ({show, children}) => (
    <CSSTransition
        in={show}
        appear={true}
        timeout={{appear: 1000, enter: 1000, exit: 1000}}
        classNames="error-transition">
        <Panel className="is-danger error-panel" title="Error">
            <PanelBlock>{children}</PanelBlock>
        </Panel>
    </CSSTransition>
);

export default ErrorPanel;
