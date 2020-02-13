import * as React from 'react';
import {useState} from 'react';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-github';

import {Editor, EditorProps} from "../../utilities/Editor";
import {Announcement} from "../../class/Announcement";
import RangeArray from "../../utilities/Range";

const AnnouncementEditor: Editor<Announcement, EditorProps<Announcement>> = ({controller, onCancel, selected, ...props}) => {
    const [announcement, announcementUpdate] = useState(selected);

    return (
        <nav className="panel announcement-editor">
            <p className="panel-heading">
                Announcement Edit
            </p>
            <div className="panel-block">
                <form style={{width: '100%'}}>
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
                                       onChange={(event) => announcementUpdate({...announcement, title: event.target.value})} />
                            </div>
                        </div>
                    </div>

                    <div className="field is-horizontal">
                        <div className="field-label is-normal">
                            <label className="label">Priority</label>
                        </div>
                        <div className="field-body">
                            <div className="select is-fullwidth">
                                <select value={announcement.priority}
                                    onChange={(event) => announcementUpdate({...announcement, priority: +event.target.value})}>
                                    {RangeArray(-5, 5).map((value) => (
                                        <option key={value} value={value}>{value}</option>
                                    ))}
                                </select>
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
                                    mode="markdown"
                                    theme="github"
                                    name="announcement-content-ace-editor"
                                    onChange={(content: string) => announcementUpdate({...announcement, content})} />
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
                                    <button type="button" className="button is-primary" onClick={() => (controller.edit(announcement), onCancel())}>
                                        <span className="icon">
                                            <i className="fas fa-save" />
                                        </span>
                                        <span>Save</span>
                                    </button>
                                </p>
                                <p className="control">
                                    <button type="button" className="button is-info" onClick={() => onCancel()}>
                                        <span className="icon">
                                            <i className="fas fa-ban" />
                                        </span>
                                        <span>Cancel</span>
                                    </button>
                                </p>
                                <p className="control">
                                    <button type="button" className="button is-danger" onClick={() => (controller.delete(announcement), onCancel())}>
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
};

export default AnnouncementEditor;