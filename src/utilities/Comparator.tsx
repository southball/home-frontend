import {Announcement} from "../class/Announcement";

type Comparator<T> = (t1: T, t2: T) => number;

export const AnnouncementComparator: Comparator<Announcement> = (announcement1: Announcement, announcement2: Announcement) => {
    if (announcement1.priority !== announcement2.priority) return +(announcement1.priority < announcement2.priority);
    if (announcement1.title !== announcement2.title) return +(announcement1.title > announcement2.title);
    return +(announcement1.content > announcement2.content);
};

