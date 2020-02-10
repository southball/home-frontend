import * as React from "react";

const SearchBox: React.FC<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>> =
    (props) => (
        <p className="control has-icons-left is-expanded">
            <input type="text" className="input" placeholder="Search" {...props} />
            <span className="icon is-left">
                <i className="fas fa-search" />
            </span>
        </p>
    );

export default SearchBox;
