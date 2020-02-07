import * as React from 'react';
import * as mime from 'mime';
import axios from 'axios';

import './FileManager.scss';
import {useState} from "react";

interface File {
    filename: string;
    type: 'file' | 'directory';
    tags: string[];
}

interface FileManagerProps {
    token: string;
}

interface FileManagerState {
    path: string[];
    files: File[] | null;
}

class FileManager extends React.Component<FileManagerProps, FileManagerState> {
    public constructor(props: any) {
        super(props);

        this.Breadcrumb = this.Breadcrumb.bind(this);
        this.FileEntry = this.FileEntry.bind(this);
        this.FileIcon = this.FileIcon.bind(this);
        this.FileLoading = this.FileLoading.bind(this);
        this.FileListing = this.FileListing.bind(this);

        this.state = {
            path: [],
            files: null
        };

        this.fetchPath('');
    };

    public fetchPath(path: string) {
        axios
            .get('/api/files', {
                params: {
                    path,
                    token: this.props.token,
                },
            })
            .then((response) => {
                if (response.data.success) {
                    const files: File[] = response.data.files;
                    const sortedFiles = [
                        ...files.filter((file) => file.type === 'directory').sort((file1, file2) => +(file1.filename > file2.filename)),
                        ...files.filter((file) => file.type === 'file').sort((file1, file2) => +(file1.filename > file2.filename))
                    ];
                    this.setState({
                        files: sortedFiles
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    public setPath(path: string[]) {
        this.setState({path, files: []});
        this.fetchPath(path.join('/'));
    }

    public slicePath(remain: number) {
        const newPath = this.state.path.slice(0, remain);
        this.setPath(newPath);
    }

    public handleFileAction(file: File) {
        if (file.type === 'directory') {
            this.setPath([...this.state.path, file.filename]);
        } else {
            window.open('/api/file/' + this.state.path.map(encodeURI).join('/') + '/' + encodeURI(file.filename) + "?token=" + this.props.token);
        }
    }

    public Breadcrumb() {
        return (
            <div className="panel-block">
                <span className="panel-icon">
                    <i className="fas fa-map-marker-alt" />
                </span>
                <b>You are at:</b>&nbsp;
                <nav className="breadcrumb">
                    <ul>
                        <li className="home">
                            <a onClick={() => this.slicePath(0)}>
                                <span className="icon is-small"><i className="fas fa-home" /></span>
                                &#8203;
                            </a>
                        </li>
                        {
                            this.state.path.map((component, id) => (
                                <li className="folder">
                                    <a onClick={() => this.slicePath(id + 1)}>
                                        <span className="icon is-small"><i className="fas fa-folder" /></span>
                                        {component}
                                    </a>
                                </li>
                            ))
                        }
                    </ul>
                </nav>
            </div>
        )
    }

    public FileIcon({file}: {file: File}) {
        if (file.type === 'directory') {
            return <i className="fas fa-folder" />;
        }

        const type = mime.getType(file.filename);
        if (type === null) {
            return <i className="fas fa-file-alt" />;
        } else if (type.startsWith("image"))  {
            return <i className="fas fa-file-image" />;
        } else if (type.startsWith("audio")) {
            return <i className="fas fa-music" />;
        } else if (type.startsWith("video")) {
            return <i className="fas fa-video" />;
        } else if (type.startsWith("text")) {
            return <i className="fas fa-file-alt" />;
        } else {
            return <i className="fas fa-file-alt" />;
        }
    }

    public FileEntry({ file }: { file: File }) {
        const [showAdditionalMenu, setDisplay] = useState(false);

        return (
            <>
                <div className="panel-block file-entry"
                     onClick={() => this.handleFileAction(file)}>
                    <span className="panel-icon">
                        <this.FileIcon file={file} />
                    </span>
                    {file.filename}
                    <span className="tag-display">
                        {file.tags.map((tag) => (
                            <span className="tag is-info is-light">{tag}</span>
                        ))}
                    </span>
                    <span className="panel-icon file-entry-ellipsis"
                        // style={{marginLeft: "auto"}}
                        onClick={(e) => (e.stopPropagation(), setDisplay(!showAdditionalMenu))}>
                        <i className="fas fa-ellipsis-v" />
                    </span>
                </div>
                {
                    showAdditionalMenu &&
                    <div className="panel-block">
                        Tags:
                    </div>
                }
            </>
        );
    }

    public FileListing() {
        return (
            <>
                {this.state.files?.map((file) => (
                    <this.FileEntry file={file} key={file.filename} />
                ))}
            </>
        );
    }

    public FileLoading() {
        return (
            <div className="panel-block">
                Loading folder...
            </div>
        );
    }

    public render() {
        return (
            <nav className="panel file-manager">
                <p className="panel-heading">File Manager</p>

                <div className="panel-block">
                    <p className="control has-icons-left">
                        <input type="text" className="input" placeholder="Search" />
                        <span className="icon is-left">
                            <i className="fas fa-search" />
                        </span>
                    </p>
                </div>

                <this.Breadcrumb />

                {
                    this.state.files === null
                        ? <this.FileLoading />
                        : <this.FileListing />
                }
            </nav>
        )
    }
}

export default FileManager;
