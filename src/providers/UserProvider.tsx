import axios from 'axios';
import {CRUDProvider} from "../utilities/CRUDProvider";
import {User} from "../class/User";

class UserProvider extends CRUDProvider<User> {
    public collection: User[] = [];

    protected async getInitialCollection() {
        const options = this.token ? {params: {token: this.token}} : {};
        const response = await axios.get('/api/users', options);
        return response.data.users as User[];
    }

    protected async serverCreateEntry() {
        const response = await axios.post('/api/user/create', {}, {params: {token: this.token}});
        return response.data.user as User;
    }

    protected async serverEditEntry(entry: User) {
        const response = await axios.post('/api/user/edit', entry, {params: {token: this.token}});
        return response.data.user as User;
    }

    protected async serverDeleteEntry(entry: User) {
        await axios.post('/api/user/delete', entry, {params: {token: this.token}});
    }
}

export default UserProvider;
