import * as React from 'react';
import {Panel, PanelBlock} from '../Panel/Panel';
import axios from 'axios';
import AnnouncementEditor from '../AnnouncementManager/AnnouncementEditor';
import {ChangeEventHandler} from 'react';
import * as Fuse from 'fuse.js';
import nonNull from '../../utilities/nonNull';

import './AnnouncementManager.scss';
import SearchableList from '../SearchableList/SearchableList';
import SearchBox from '../SearchBox/SearchBox';

export interface Announcement {
    id: number;
    title: string;
    priority: number;
    content: string;
}

interface AnnouncementManagerProps {
    token: string;
}

interface AnnouncementManagerState {
    announcements: Announcement[];
    selectedAnnouncement?: Announcement;
    searchQuery: string;
}

class AnnouncementManager extends React.Component<AnnouncementManagerProps, AnnouncementManagerState> {
    private fuseOptions: Fuse.FuseOptions<Announcement> = {
        keys: ['priority', 'title', 'content', 'id'] as (keyof Announcement)[],
        maxPatternLength: 128,
        threshold: 0.2,
        distance: 1e8,
    };

    public static announcementComparator = (announcement1: Announcement, announcement2: Announcement) => {
        if (announcement1.priority !== announcement2.priority) return +(announcement1.priority < announcement2.priority);
        if (announcement1.title !== announcement2.title) return +(announcement1.title > announcement2.title);
        return +(announcement1.content > announcement2.content);
    };

    public selectAnnouncement(announcement: Announcement) {
        this.setState({
            selectedAnnouncement: announcement
        });
    }

    public constructor(props: any) {
        super(props);

        this.state = {
            announcements: [],
            selectedAnnouncement: undefined,
            searchQuery: '',
        };

        axios
            .get('/api/announcements', {
                params: {
                    token: this.props.token,
                },
            })
            .then((response) => {
                const announcements = (response.data.announcements as Announcement[])
                    .sort(AnnouncementManager.announcementComparator);
                this.setState({announcements});
            });

        this.AnnouncementList = this.AnnouncementList.bind(this);

        this.computeSearchQuery = this.computeSearchQuery.bind(this);
        this.addAnnouncement = this.addAnnouncement.bind(this);
        this.selectAnnouncement = this.selectAnnouncement.bind(this);

        this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
        this.onAnnouncementUpdated = this.onAnnouncementUpdated.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    public addAnnouncement() {
        axios
            .post('/api/announcement/create', {}, {
                params: {
                    token: this.props.token,
                },
            })
            .then((response) => {
                const announcements = [...this.state.announcements, response.data.announcement as Announcement];
                this.setState({announcements});
            });
    }

    public AnnouncementList() {
        return (
            <Panel title="Announcements List">
                <PanelBlock>
                    <SearchBox onChange={this.onSearchQueryChange} value={this.state.searchQuery} />
                </PanelBlock>
                <PanelBlock>
                    <button className="button is-primary" type="button" onClick={this.addAnnouncement}>
                        <span>Add Announcement</span>
                    </button>
                </PanelBlock>
                <SearchableList list={this.state.announcements} query={this.state.searchQuery} fuseOptions={this.fuseOptions}>
                    {(announcement: Announcement) => (
                        <PanelBlock key={announcement.id} className="announcement-entry" onClick={() => this.selectAnnouncement(announcement)}>
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
        )
    }

    public computeSearchQuery(query: string, announcements: Announcement[]): Announcement[] {
        if (!query.length) return announcements;

        const result = new Fuse(announcements, this.fuseOptions).search(query) as Announcement[];
        return result;
    }

    public onSearchQueryChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        this.setState({
            searchQuery: event.target.value as string,
        });
    };

    public onAnnouncementUpdated(id: number, newAnnouncement: Announcement | null) {
        const announcements = this.state.announcements
            .map((announcement) => announcement.id !== id ? announcement : newAnnouncement)
            .filter(nonNull)
            .sort(AnnouncementManager.announcementComparator);

        const originalAnnouncement = this.state.announcements
            .filter((announcement) => announcement.id === id)?.[0];

        if (originalAnnouncement) {
            if (newAnnouncement === null) {
                axios.post('/api/announcement/delete', originalAnnouncement, {params: {token: this.props.token}});
            } else {
                axios.post('/api/announcement/edit', newAnnouncement, {params: {token: this.props.token}});
            }
        } else {
            console.error('Original announcement not found. Cannot update to server.');
        }

        this.setState({
            announcements,
            selectedAnnouncement: undefined,
        });
    }

    public onCancel() {
        this.setState({
            selectedAnnouncement: undefined,
        });
    }

    public render() {
        return (
            <div className="announcement-manager">
                {
                    !this.state.selectedAnnouncement &&
                    <this.AnnouncementList />
                }
                {
                    this.state.selectedAnnouncement &&
                    <AnnouncementEditor
                        token={this.props.token}
                        announcement={this.state.selectedAnnouncement}
                        onAnnouncementUpdated={this.onAnnouncementUpdated}
                        onCancel={this.onCancel} />
                }
            </div>
        );
    }
}

export default AnnouncementManager;
