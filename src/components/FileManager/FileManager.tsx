import * as React from 'react';
import * as mime from 'mime';
import * as Fuse from 'fuse.js';
import axios from 'axios';

import './FileManager.scss';
import {useState} from "react";
import {Panel, PanelBlock} from "../Panel/Panel";

interface File {
    // ID for sorting
    id?: number;
    filename: string;
    type: 'file' | 'directory';
    tags: string[];
}

interface FileManagerProps {
    token: string;
}

interface FileManagerState {
    path: string[];
    tags: string[];
    files: File[] | null;
    searchQuery: string;
    displayedFiles: File[] | null;
}

class FileManager extends React.Component<FileManagerProps, FileManagerState> {
    private fuseOptions: Fuse.FuseOptions<File> = {
        keys: ['filename', 'tags'],
        maxPatternLength: 128,
        threshold: 0.2,
        distance: 1e8,
    };

    public constructor(props: any) {
        super(props);

        this.Breadcrumb = this.Breadcrumb.bind(this);
        this.FileEntry = this.FileEntry.bind(this);
        this.FileTagsEditor = this.FileTagsEditor.bind(this);
        this.FileIcon = this.FileIcon.bind(this);
        this.FileLoading = this.FileLoading.bind(this);
        this.FileListing = this.FileListing.bind(this);

        this.state = {
            path: [],
            tags: [],
            files: null,
            searchQuery: '',
            displayedFiles: null,
        };

        axios
            .get('/api/tags', {
                params: {
                    token: this.props.token,
                },
            })
            .then((response) => {
                this.setState({
                    tags: response.data.tags
                });
            });

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
                    const fileComparator = (file1: File, file2: File) =>
                        +(file1.filename.toLowerCase() > file2.filename.toLowerCase());
                    const sortedFiles = [
                        ...files.filter((file) => file.type === 'directory').sort(fileComparator),
                        ...files.filter((file) => file.type === 'file').sort(fileComparator),
                    ].map((file, index) => ({...file, id: index}));
                    this.setState({
                        files: sortedFiles,
                        displayedFiles: this.computeSearchQuery(this.state.searchQuery, sortedFiles),
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    public computeSearchQuery(query: string, files: File[] | null): File[] | null {
        if (!query.length || files === null) {
            return files;
        }

        const result = new Fuse(files, this.fuseOptions).search(query) as File[];
        return result.sort((file1, file2) => {
            const id1 = file1.id ?? 0;
            const id2 = file2.id ?? 0;
            return id1 !== id2 ? id1 - id2 : +(file1.filename > file2.filename);
        });
    }

    public setSearchQuery(query: string) {
        this.setState({
            searchQuery: query,
            displayedFiles: this.computeSearchQuery(query, this.state.files),
        });
    }

    public setPath(path: string[]) {
        this.setState({path, files: null, displayedFiles: null});
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
            const path = this.state.path.length ? this.state.path.map(encodeURI).join('/') + '/' : '';
            window.open('/api/file/' + path + encodeURI(file.filename) + "?token=" + this.props.token);
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

    public updateFileTags(filename: string, tags: string[]) {
        const sanitizedTags = [...new Set(tags)].sort();
        const files = this.state.files
            ?.map((file) => file.filename !== filename ? file : ({
                ...file,
                tags: sanitizedTags,
            })) || null;
        axios
            .post('/api/tags/set', {
                file: (this.state.path.length ? this.state.path.join('/') + '/' : '') + filename,
                tags,
            }, {
                params: {
                    token: this.props.token,
                },
            })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
        this.setState({
            files,
            tags: [...new Set(this.state.tags.concat(sanitizedTags))].sort(),
            displayedFiles: this.computeSearchQuery(this.state.searchQuery, files),
        });
    }

    public FileTagsEditor({file}: {file: File}) {
        const [newTag, setNewTag] = useState('');

        return (
            <div className="panel-block tag-editor" style={{display: "block"}}>
                <span className="field is-grouped is-grouped-multiline tag-list">
                    {file.tags.map((tag) => (
                        <div className="control">
                            <div className="tags are-medium has-addons">
                                <span className="tag">{tag}</span>
                                <span className="tag is-delete is-danger"
                                      onClick={() => {
                                          this.updateFileTags(file.filename, file.tags.filter((t) => t !== tag));
                                      }} />
                            </div>
                        </div>
                    ))}
                    {!file.tags.length && (
                        <div className="tag is-medium is-white">
                            No tags yet.
                        </div>
                    )}
                </span>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    this.updateFileTags(file.filename, [...file.tags, newTag]);
                    setNewTag('');
                }}>
                    <div className="columns tag-control">
                        <div className="column">
                            <div className="select is-fullwidth">
                                <select
                                    onChange={(event) => {
                                        this.updateFileTags(file.filename, [...file.tags, event.target.value]);
                                    }}
                                    value="">
                                    <option disabled value="">Select an already used tag...</option>
                                    {this.state.tags.map((tag) => (
                                        <option value={tag}>{tag}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="column">
                            <div className="field has-addons">
                                <p className="control is-expanded">
                                    <input type="text"
                                           placeholder="New tag"
                                           className="input"
                                           onChange={(event) => setNewTag(event.target.value)}
                                           value={newTag} />
                                </p>
                                <p className="control">
                                    <button className="button is-info" type="submit">Add</button>
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
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
                            <span key={tag} className="tag is-info is-light">{tag}</span>
                        ))}
                    </span>
                    <button className="button is-small"
                            onClick={(e) => {
                                // Prevent the parent onClick event from being triggered
                                e.stopPropagation();
                                setDisplay(!showAdditionalMenu);
                            }}>
                        <span className="icon file-entry-toggle">
                            <i className="fas fa-ellipsis-v" />
                        </span>
                    </button>
                </div>
                {
                    showAdditionalMenu &&
                        <this.FileTagsEditor file={file} />
                }
            </>
        );
    }

    public FileListing() {
        return (
            <>
                {this.state.displayedFiles?.map((file) => (
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
            <Panel className="file-manager" title="File Manager">
                <PanelBlock>
                    <p className="control has-icons-left">
                        <input type="text" className="input" placeholder="Search"
                            onChange={(event) => {
                                this.setSearchQuery(event.target.value);
                            }}
                            value={this.state.searchQuery} />
                        <span className="icon is-left">
                            <i className="fas fa-search" />
                        </span>
                    </p>
                </PanelBlock>

                <this.Breadcrumb />

                {
                    this.state.files === null
                        ? <this.FileLoading />
                        : <this.FileListing />
                }
            </Panel>
        )
    }
}

export default FileManager;
