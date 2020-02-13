import axios from 'axios';
import {CRUDProvider} from "../utilities/CRUDProvider";
import {Announcement} from "../class/Announcement";
import {AnnouncementComparator} from "../utilities/Comparator";

class AnnouncementProvider extends CRUDProvider<Announcement> {
    protected comparator = AnnouncementComparator;

    public async getInitialCollection(token?: string) {
        const options = token ? {params: {token}} : {};
        const response = await axios.get('/api/announcements', options);
        return response.data.announcements as Announcement[];
    }

    protected async serverCreateEntry(token: string) {
        const response = await axios.post('/api/announcement/create', {}, {params: {token}});
        return response.data.announcement as Announcement;
    }

    protected async serverEditEntry(entry: Announcement, token: string) {
        const response = await axios.post('/api/announcement/edit', entry, {params: {token}});
        return response.data.announcement as Announcement;
    }

    protected async serverDeleteEntry(entry: Announcement, token: string) {
        await axios.post('/api/announcement/delete', entry, {params: {token}});
    }
}

export default AnnouncementProvider;
