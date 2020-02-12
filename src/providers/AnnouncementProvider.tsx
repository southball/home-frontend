import axios from 'axios';
import {CRUDProvider} from "../utilities/CRUDProvider";
import {Announcement} from "../class/Announcement";
import {AnnouncementComparator} from "../utilities/Comparator";

class AnnouncementProvider extends CRUDProvider<Announcement> {
    public collection: Announcement[] = [];
    public comparator = AnnouncementComparator;

    protected async getInitialCollection() {
        const options = this.token ? {params: {token: this.token}} : {};
        const response = await axios.get('/api/announcements', options);
        return response.data.announcements as Announcement[];
    }

    protected async serverCreateEntry() {
        const response = await axios.post('/api/announcement/create', {}, {params: {token: this.token}});
        return response.data.announcement as Announcement;
    }

    protected async serverEditEntry(entry: Announcement) {
        const response = await axios.post('/api/announcement/edit', entry, {params: {token: this.token}});
        return response.data.announcement as Announcement;
    }

    protected async serverDeleteEntry(entry: Announcement) {
        await axios.post('/api/announcement/delete', entry, {params: {token: this.token}});
    }
}

export default AnnouncementProvider;
