import axios from 'axios';
import {CRUDProvider} from "../utilities/CRUDProvider";
import {User} from "../class/User";

class UserProvider extends CRUDProvider<User> {
    public async getInitialCollection(token: string) {
        const options = token ? {params: {token}} : {};
        const response = await axios.get('/api/users', options);
        return response.data.users as User[];
    }

    protected async serverCreateEntry(token: string) {
        const response = await axios.post('/api/user/create', {}, {params: {token}});
        return response.data.user as User;
    }

    protected async serverEditEntry(entry: User, token: string) {
        const response = await axios.post('/api/user/edit', entry, {params: {token}});
        return response.data.user as User;
    }

    protected async serverDeleteEntry(entry: User, token: string) {
        await axios.post('/api/user/delete', entry, {params: {token}});
    }
}

export default UserProvider;
