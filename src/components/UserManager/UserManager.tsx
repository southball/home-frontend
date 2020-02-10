import * as React from 'react';
import axios from 'axios';

import "./UserManager.scss";
import UserEditor from './UserEditor';
import nonNull from '../../utilities/nonNull';
import {Panel, PanelBlock} from "../Panel/Panel";
import ErrorPanel from "../ErrorPanel/ErrorPanel";
import * as Fuse from "fuse.js";
import {ChangeEventHandler} from "react";
import SearchBox from "../SearchBox/SearchBox";
import SearchableList from "../SearchableList/SearchableList";

export interface User {
    id: number;
    displayName: string;
    email: string;
    permissionLevel: string;
}

interface UserManagerProps {
    token: string;
}

interface UserManagerState {
    users: User[];
    selectedUser?: User;
    searchQuery: string;
}

class UserManager extends React.Component<UserManagerProps, UserManagerState> {
    private fuseOptions: Fuse.FuseOptions<User> = {
        keys: ['permissionLevel', 'displayName', 'email', 'id'],
        maxPatternLength: 128,
        threshold: 0.2,
        distance: 1e8,
    };

    public constructor(props: any) {
        super(props);

        this.state = {
            users: [],
            selectedUser: undefined,
            searchQuery: ''
        };

        axios
            .get('/api/users', {
                params: {
                    token: this.props.token,
                },
            })
            .then((response) => {
                const users: User[] = response.data.users;
                this.setState((state) => ({
                    users,
                }));
            });

        this.UserList = this.UserList.bind(this);

        this.selectUser = this.selectUser.bind(this);
        this.onUserUpdated = this.onUserUpdated.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    public selectUser(user: User) {
        this.setState({
            selectedUser: user,
        });
    }

    public onSearchQueryChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const searchQuery = event.target.value;
        this.setState({
            searchQuery,
        });
    };

    public UserList() {
        return (
            <Panel title="Users List">
                <PanelBlock>
                    <SearchBox onChange={this.onSearchQueryChange} value={this.state.searchQuery} />
                </PanelBlock>
                <SearchableList list={this.state.users} query={this.state.searchQuery} fuseOptions={this.fuseOptions}>
                    {(user: User) => (
                        <PanelBlock key={user.id} className="user-entry" onClick={() => this.selectUser(user)}>
                            <span className="panel-icon">
                                <i className="fas fa-user" />
                            </span>
                            <span style={{wordBreak: "break-all"}}>
                                <span className="tag">#{user.id}</span>&nbsp;
                                {user.displayName} ({user.email}) [{user.permissionLevel}]
                            </span>
                        </PanelBlock>
                    )}
                </SearchableList>
            </Panel>
        );
    }

    public onUserUpdated(id: number, newUser: User | null) {
        const users = this.state.users
            .map((user) => user.id !== id ? user : newUser)
            .filter(nonNull);
        this.setState({
            users,
            selectedUser: undefined,
        });
    }

    public onCancel() {
        this.setState({
            selectedUser: undefined,
        });
    }

    public render() {
        return (
            <div className="user-manager">
                {
                    !this.state.selectedUser &&
                    <this.UserList />
                }
                {
                    this.state.selectedUser &&
                    <UserEditor
                        token={this.props.token}
                        user={this.state.selectedUser}
                        onUserUpdated={this.onUserUpdated}
                        onCancel={this.onCancel} />
                }
            </div>
        );
    }
}

export default UserManager;
