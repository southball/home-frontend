import * as React from 'react';

import {Announcement} from './AnnouncementManager';
import {ChangeEvent, useEffect, useState} from "react";

import AceEditor from 'react-ace';

import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-github";

interface AnnouncementEditorProps {
    announcement: Announcement;
    token: string;
    onAnnouncementUpdated: (id: number, announcement: Announcement | null) => any;
    onCancel: () => any;
}

interface AnnouncementEditorState {
    announcement: Announcement;
}

class AnnouncementEditor extends React.Component<AnnouncementEditorProps, AnnouncementEditorState> {
    public constructor(props: AnnouncementEditorProps & any) {
        super(props);

        this.saveAnnouncement = this.saveAnnouncement.bind(this);
        this.cancelAnnouncement = this.cancelAnnouncement.bind(this);
        this.deleteAnnouncement = this.deleteAnnouncement.bind(this);

        this.onFieldChange = this.onFieldChange.bind(this);

        this.state = {
            announcement: props.announcement
        };
    }

    public onFieldChange =
        (fieldName: keyof Announcement) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
            const announcement = {...this.state.announcement, [fieldName]: event.target.value as string};
            this.setState({announcement});
        };

    public onFieldValueChange =
        (fieldName: keyof Announcement) => (value: string) => {
            const announcement = {...this.state.announcement, [fieldName]: value as string};
            this.setState({announcement});
        };

    public saveAnnouncement() {
        // axios
        //     .post('/api/announcement/edit', this.state.announcement, {
        //         params: {
        //             token: this.props.token,
        //         },
        //     })
        //     .then((response) => {
        //         const updatedAnnouncement: Announcement = response.data.announcement;
        //         console.log('Updated announcement:', updatedAnnouncement);
        //         this.props.onAnnouncementUpdated(updatedAnnouncement.id, updatedAnnouncement);
        //     });
        const announcement = this.state.announcement;
        this.props.onAnnouncementUpdated(announcement.id, announcement);
    }

    public cancelAnnouncement() {
        this.props.onCancel();
    }

    public deleteAnnouncement() {
        const announcement = this.state.announcement;
        this.props.onAnnouncementUpdated(announcement.id, null);
        // axios
        //     .post('/api/announcement/delete', {
        //         id: announcement.id,
        //     }, {
        //         params: {
        //             token: this.props.token,
        //         },
        //     });
    }

    public render() {
        const announcement = this.state.announcement;

        return (
            <nav className="panel announcement-editor">
                <p className="panel-heading">
                    Announcement Edit
                </p>
                <div className="panel-block">
                    <form style={{width: "100%"}}>
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">ID</label>
                            </div>
                            <div className="field-body">
                                <div className="field is-expanded">
                                    <input readOnly className="input is-static" type="text" value={announcement.id} />
                                </div>
                            </div>
                        </div>

                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">Title</label>
                            </div>
                            <div className="field-body">
                                <div className="field is-expanded">
                                    <input className="input" type="text" value={announcement.title}
                                           onChange={this.onFieldChange('title')} />
                                </div>
                            </div>
                        </div>

                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">Priority</label>
                            </div>
                            <div className="field-body">
                                <div className="field is-expanded">
                                    <input className="input" type="number" value={announcement.priority}
                                           onChange={this.onFieldChange('priority')} />
                                </div>
                            </div>
                        </div>

                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">Content</label>
                            </div>
                            <div className="field-body">
                                <div className="field is-expanded">
                                    <AceEditor
                                        fontSize={16}
                                        value={announcement.content}
                                        style={{width: "100%", height: "200px"}}
                                        onChange={this.onFieldValueChange('content')} />
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
                                        <button type="button" className="button is-primary" onClick={this.saveAnnouncement}>
                                            <span className="icon">
                                                <i className="fas fa-save" />
                                            </span>
                                            <span>Save</span>
                                        </button>
                                    </p>
                                    <p className="control">
                                        <button type="button" className="button is-info" onClick={this.cancelAnnouncement}>
                                            <span className="icon">
                                                <i className="fas fa-ban" />
                                            </span>
                                            <span>Cancel</span>
                                        </button>
                                    </p>
                                    <p className="control">
                                        <button type="button" className="button is-danger" onClick={this.deleteAnnouncement}>
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

export default AnnouncementEditor;