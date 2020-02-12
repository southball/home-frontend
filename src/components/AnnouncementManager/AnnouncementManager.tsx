import * as React from 'react';
import {useState} from 'react';
import {Panel, PanelBlock} from '../Panel/Panel';
import AnnouncementEditor from '../AnnouncementManager/AnnouncementEditor';
import * as Fuse from 'fuse.js';

import './AnnouncementManager.scss';
import SearchableList from '../SearchableList/SearchableList';
import SearchBox from '../SearchBox/SearchBox';
import {Manager, ManagerProps} from "../../utilities/Manager";
import {useProvider} from "../../utilities/CRUDProvider";
import AnnouncementProvider from "../../providers/AnnouncementProvider";
import {Announcement} from "../../class/Announcement";

const AnnouncementFuseOptions: Fuse.FuseOptions<Announcement> = {
    keys: ['priority', 'title', 'content', 'id'] as (keyof Announcement)[],
    maxPatternLength: 128,
    threshold: 0.2,
    distance: 1e8,
};

const AnnouncementManager: Manager<Announcement, ManagerProps<Announcement>> = (props) => {
    const [entries, provider] = useProvider<Announcement>(AnnouncementProvider, props.token);
    const [selected, setSelected] = useState<Announcement | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    return (
        <div className="announcement-manager">
            {
                !selected &&
                <Panel title="Announcements List">
                    <PanelBlock>
                        <SearchBox
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)} />
                    </PanelBlock>
                    <PanelBlock>
                        <button className="button is-primary" type="button" onClick={() => provider.createEntry()}>
                            <span>Add Announcement</span>
                        </button>
                    </PanelBlock>
                    <SearchableList list={entries} query={searchQuery} fuseOptions={AnnouncementFuseOptions}>
                        {(announcement: Announcement) => (
                            <PanelBlock key={announcement.id} className="announcement-entry" onClick={() => setSelected(announcement)}>
                            <span className="panel-icon">
                                <i className="fas fa-sticky-note" />
                            </span>
                                <span>
                                <p>
                                    <span className="tag">#{announcement.id}</span>&nbsp;
                                    <b>{announcement.title}</b>
                                </p>
                                <p>
                                    {announcement.content.slice(0, 64)}
                                    {announcement.content.length > 64 && '(...)'}
                                </p>
                            </span>
                            </PanelBlock>
                        )}
                    </SearchableList>
                </Panel>
            }
            {
                selected &&
                <AnnouncementEditor
                    token={props.token}
                    selected={selected}
                    onEdit={(announcement) => (provider.editEntry(announcement), setSelected(null))}
                    onDelete={(announcement) => (provider.deleteEntry(announcement), setSelected(null))}
                    onCancel={() => setSelected(null)} />
            }
        </div>
    );
};

export default AnnouncementManager;
