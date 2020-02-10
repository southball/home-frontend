import * as React from 'react';

interface PanelProps {
    className?: string;
    title?: string;
}

interface PanelBlockProps {
    className?: string;
    divFix?: boolean;
}

const Panel: React.FC<PanelProps & React.HTMLAttributes<HTMLElement>> = ({className, title, children, ...props}) => {
    return (
        <nav className={`panel ${className || ''}`} {...props}>
            {title && <p className="panel-heading">{title}</p>}
            {children}
        </nav>
    )
};

const PanelBlock: React.FC<PanelBlockProps & React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    children,
    divFix,
    ...props
}) => {
    return (
        <div className={`panel-block ${className || ''}`} {...props}>
            {/* An extra div to ensure the style in the block. */}
            {
                divFix
                    ? <div>{children}</div>
                    : children
            }
        </div>
    )
};

export {Panel, PanelBlock};
