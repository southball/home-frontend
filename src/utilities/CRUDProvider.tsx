import {useEffect, useState} from "react";

interface TypeWithID {
    id: number;
}

export abstract class CRUDProvider<T extends TypeWithID> {
    public inited: boolean = false;
    public abstract collection: T[];
    public token?: string;
    public hook?: (collection: T[]) => any;
    public comparator?: (t1: T, t2: T) => number;

    protected abstract getInitialCollection(): Promise<T[]>;
    protected abstract serverCreateEntry(): Promise<T>;
    protected abstract serverEditEntry(entry: T): Promise<T>;
    protected abstract serverDeleteEntry(entry: T): Promise<void>;

    public constructor(token?: string) {
        this.token = token;
    }

    protected setCollection(collection: T[]) {
        this.collection = collection;
        this.hook?.(collection);
    }

    public init(): void {
        if (!this.inited) {
            this.inited = true;
            this.getInitialCollection()
                .then(this.setCollection.bind(this));
        }
    }

    public trySort(collection: T[]): T[] {
        return this.comparator ? collection.sort(this.comparator) : collection;
    }

    public async createEntry(): Promise<void> {
        const entry = await this.serverCreateEntry();
        this.setCollection(this.trySort([...this.collection, entry]));
    }

    public async editEntry(entry: T): Promise<void> {
        this.setCollection(this.trySort(this.collection.map((t: T) => t.id !== entry.id ? t : entry)));
        await this.serverEditEntry(entry);
    }

    public async deleteEntry(entry: T): Promise<void> {
        this.setCollection(this.trySort(this.collection.filter((t: T) => t.id !== entry.id)));
        await this.serverDeleteEntry(entry);
    }
}

export function useProvider<T extends TypeWithID>(Provider: new (token?: string) => CRUDProvider<T>, token?: string): [T[], CRUDProvider<T>] {
    const [provider] = useState<CRUDProvider<T>>(new Provider(token));
    const [collection, setCollection] = useState<T[]>(provider.collection);

    if (!provider.inited) {
        provider.hook = (collection) => {
            setCollection(collection);
        };
        provider.init();
    }

    return [collection, provider];
}
