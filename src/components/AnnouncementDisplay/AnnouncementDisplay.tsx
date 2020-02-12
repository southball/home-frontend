import * as React from 'react';
import {useEffect, useState} from 'react';
import * as marked from 'marked';
import axios from 'axios';

import AnnouncementManager from '../AnnouncementManager/AnnouncementManager';

import './AnnouncementDisplay.scss';
import {Announcement} from "../../class/Announcement";
import {AnnouncementComparator} from "../../utilities/Comparator";

interface AnnouncementWithHTML extends Announcement {
    compiledHTML: string;
}

interface MessageProps {
    title?: string;
    className?: string;
}

const Message: React.FC<MessageProps> =
    ({className, title, children,...props}) => (
        <article className={"message " + (className || '')}>
            {
                title &&
                <div className="message-header">
                    <p>{title}</p>
                </div>
            }
            <div className="message-body">{children}</div>
        </article>
    );

const AnnouncementPanel: React.FC<{announcement: AnnouncementWithHTML}> = ({announcement}) => (
    <Message title={announcement.title} className="announcement">
        <div dangerouslySetInnerHTML={{__html: announcement.compiledHTML}} />
    </Message>
);

const AnnouncementDisplay: React.FC = () => {
    const [announcements, setAnnouncements] = useState<AnnouncementWithHTML[]>([]);
    const [dummy] = useState<null>(null);

    useEffect(() => {
        axios
            .get('/api/announcements')
            .then((response) => {
                const announcements = (response.data.announcements as Announcement[])
                    .sort(AnnouncementComparator)
                    .map((announcement: Announcement) => ({
                        ...announcement,
                        compiledHTML: marked(announcement.content, {
                            gfm: true,
                            silent: true,
                        }),
                    }));
                setAnnouncements(announcements);
            });
    }, [dummy]);

    return (
        <div className="announcement-display">
            {!announcements.length && <p>There are no announcements.</p>}
            {announcements.map((announcement) => <AnnouncementPanel announcement={announcement} />)}
        </div>
    );
};

export default AnnouncementDisplay;
