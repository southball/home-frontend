import * as React from 'react';

import "./UserManager.scss";
import UserEditor from './UserEditor';
import {Panel, PanelBlock} from "../Panel/Panel";
import * as Fuse from "fuse.js";
import SearchBox from "../SearchBox/SearchBox";
import SearchableList from "../SearchableList/SearchableList";
import {User} from "../../class/User";
import {Manager, ManagerProps} from "../../utilities/Manager";
import {useProvider} from "../../utilities/CRUDProvider";
import {useState} from "react";
import UserProvider from "../../providers/UserProvider";

const UserFuseOptions: Fuse.FuseOptions<User> = {
    keys: ['permissionLevel', 'displayName', 'email', 'id'],
    maxPatternLength: 128,
    threshold: 0.2,
    distance: 1e8,
};

const UserManager: Manager<User, ManagerProps<User>> = (props) => {
    const [entries, controller] = useProvider<User>(UserProvider, props.token);
    const [selected, setSelected] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    return (
        <div className="user-manager">
            {
                !selected &&
                <Panel title="Users List">
                    <PanelBlock>
                        <SearchBox
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)} />
                    </PanelBlock>
                    <PanelBlock>
                        <button className="button is-primary" type="button" onClick={() => provider.createEntry()}>
                            <span className="icon">
                                <i className="fas fa-user" />
                            </span>
                            <span>Add User</span>
                        </button>
                    </PanelBlock>
                    <SearchableList list={entries} query={searchQuery} fuseOptions={UserFuseOptions}>
                        {(user: User) => (
                            <PanelBlock key={user.id} className="user-entry" onClick={() => setSelected(user)}>
                                <span className="panel-icon">
                                    <i className="fas fa-user" />
                                </span>
                                <span style={{wordBreak: "break-all"}}>
                                    <span className="tag">#{user.id}</span>&nbsp;
                                    {user.displayName || '-'} ({user.email || 'no email'}) [{user.permissionLevel}]
                                </span>
                            </PanelBlock>
                        )}
                    </SearchableList>
                </Panel>
            }
            {
                selected &&
                <UserEditor
                    token={props.token}
                    selected={selected}
                    controller={controller}
                    onCancel={() => setSelected(null)} />
            }
        </div>
    )
};

export default UserManager;
