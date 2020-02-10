import * as React from 'react';
import axios from "axios";

import {User} from './UserManager';
import {ChangeEvent, useEffect, useState} from "react";

interface UserEditorProps {
    user: User;
    token: string;
    onUserUpdated: (id: number, user: User | null) => any;
    onCancel: () => any;
}

interface UserEditorState {
    user: User;
}

class UserEditor extends React.Component<UserEditorProps, UserEditorState> {
    public constructor(props: UserEditorProps & any) {
        super(props);

        this.saveUser = this.saveUser.bind(this);
        this.cancelUser = this.cancelUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);

        this.onFieldChange = this.onFieldChange.bind(this);

        this.state = {
            user: props.user
        };
    }

    public onFieldChange =
        (fieldName: keyof User) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const user = {...this.state.user, [fieldName]: event.target.value as string};
            this.setState({user});
        };

    public saveUser() {
        // axios
        //     .post('/api/user/edit', this.state.user, {
        //         params: {
        //             token: this.props.token,
        //         },
        //     })
        //     .then((response) => {
        //         const updatedUser: User = response.data.user;
        //         console.log('Updated user:', updatedUser);
        //         this.props.onUserUpdated(updatedUser.id, updatedUser);
        //     });
        const user = this.state.user;
        this.props.onUserUpdated(user.id, user);
    }

    public cancelUser() {
        this.props.onCancel();
    }

    public deleteUser() {
        const user = this.state.user;
        this.props.onUserUpdated(user.id, null);
        // axios
        //     .post('/api/user/delete', {
        //         id: user.id,
        //     }, {
        //         params: {
        //             token: this.props.token,
        //         },
        //     });
    }

    public render() {
        const user = this.state.user;

        return (
            <nav className="panel user-editor">
                <p className="panel-heading">
                    User Edit
                </p>
                <div className="panel-block">
                    <form style={{width: "100%"}}>
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">Display Name</label>
                            </div>
                            <div className="field-body">
                                <div className="field is-expanded">
                                    <input className="input" type="text" value={user.displayName}
                                           onChange={this.onFieldChange('displayName')} />
                                </div>
                            </div>
                        </div>

                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">Email</label>
                            </div>
                            <div className="field-body">
                                <div className="field is-expanded">
                                    <input className="input" type="text" value={user.email}
                                           onChange={this.onFieldChange('email')} />
                                </div>
                            </div>
                        </div>

                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">Permission Level</label>
                            </div>
                            <div className="field-body">
                                <div className="field is-expanded">
                                    <div className="select is-fullwidth">
                                        <select value={user.permissionLevel} onChange={this.onFieldChange('permissionLevel')}>
                                            <option value="visitor">Visitor</option>
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">Actions</label>
                            </div>
                            <div className="field-body">
                                <div className="field is-expanded is-grouped is-grouped-multiline">
                                    <p className="control">
                                        <button type="button" className="button is-primary" onClick={this.saveUser}>
                                            <span className="icon">
                                                <i className="fas fa-save" />
                                            </span>
                                            <span>Save</span>
                                        </button>
                                    </p>
                                    <p className="control">
                                        <button type="button" className="button is-info" onClick={this.cancelUser}>
                                            <span className="icon">
                                                <i className="fas fa-ban" />
                                            </span>
                                            <span>Cancel</span>
                                        </button>
                                    </p>
                                    <p className="control">
                                        <button type="button" className="button is-danger" onClick={this.deleteUser}>
                                            <span className="icon">
                                                <i className="fas fa-trash-alt" />
                                            </span>
                                            <span>Delete</span>
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </nav>
        );
    }
}

export default UserEditor;