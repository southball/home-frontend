import {useState} from "react";

export interface TypeWithID {
    id: number;
}

type Setter<T> = (t: T) => any;

export abstract class CRUDProvider<T extends TypeWithID> {
    protected comparator?: (t1: T, t2: T) => number;

    public abstract getInitialCollection(token?: string): Promise<T[]>;

    protected abstract serverCreateEntry(token?: string): Promise<T>;
    protected abstract serverEditEntry(entry: T, token?: string): Promise<T>;
    protected abstract serverDeleteEntry(entry: T, token?: string): Promise<void>;

    public trySort(collection: T[]): T[] {
        return this.comparator ? collection.sort(this.comparator) : collection;
    }

    public async createEntry(collection: T[], setCollection: Setter<T[]>, token?: string): Promise<void> {
        const entry = await this.serverCreateEntry(token);
        setCollection(this.trySort([...collection, entry]));
    }

    public async editEntry(collection: T[], setCollection: Setter<T[]>, entry: T, token?: string): Promise<void> {
        setCollection(this.trySort(collection.map((t: T) => t.id !== entry.id ? t : entry)));
        await this.serverEditEntry(entry, token);
    }

    public async deleteEntry(collection: T[], setCollection: Setter<T[]>, entry: T, token?: string): Promise<void> {
        setCollection(this.trySort(collection.filter((t: T) => t.id !== entry.id)));
        await this.serverDeleteEntry(entry, token);
    }
}

export interface ProviderController<T extends TypeWithID> {
    create: () => Promise<void>;
    edit: (entry: T) => Promise<void>;
    delete: (entry: T) => Promise<void>;
}

export function useProvider<T extends TypeWithID>(Provider: new (token?: string) => CRUDProvider<T>, token?: string): [T[], ProviderController<T>] {
    const [collection, setCollection] = useState<T[]>([]);
    const [inited, setInited] = useState<boolean>(false);

    if (!inited) {
        setInited(true);
        new Provider()
            .getInitialCollection(token)
            .then((collection) => {
                setCollection(collection);
            });
    }

    const controller: ProviderController<T> = {
        async create() {
            new Provider().createEntry(collection, setCollection, token);
        },
        async edit(entry) {
            new Provider().editEntry(collection, setCollection, entry, token);
        },
        async delete(entry) {
            new Provider().deleteEntry(collection, setCollection, entry, token);
        }
    };

    return [collection, controller];
}
