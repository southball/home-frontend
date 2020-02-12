import * as React from 'react';
import {useState} from "react";

import {User} from "../../class/User";
import {Editor, EditorProps} from "../../utilities/Editor";

const UserEditor: Editor<User, EditorProps<User>> = (props) => {
    const [user, userUpdate] = useState(props.selected);

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
                                       onChange={(event) => userUpdate({...user, displayName: event.target.value})} />
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
                                       onChange={(event) => userUpdate({...user, email: event.target.value})} />
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
                                    <select
                                        value={user.permissionLevel}
                                        onChange={(event) => userUpdate({...user, permissionLevel: event.target.value})}>
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
                                    <button type="button" className="button is-primary" onClick={() => props.onEdit(user)}>
                                            <span className="icon">
                                                <i className="fas fa-save" />
                                            </span>
                                        <span>Save</span>
                                    </button>
                                </p>
                                <p className="control">
                                    <button type="button" className="button is-info" onClick={() => props.onCancel()}>
                                            <span className="icon">
                                                <i className="fas fa-ban" />
                                            </span>
                                        <span>Cancel</span>
                                    </button>
                                </p>
                                <p className="control">
                                    <button type="button" className="button is-danger" onClick={() => props.onDelete(user)}>
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

export default UserEditor;