import * as React from 'react';
import {ProviderController, TypeWithID} from "./CRUDProvider";

export interface EditorProps<T extends TypeWithID> {
    token: string;
    selected: T;
    controller: ProviderController<T>;
    onCancel: () => any;
}

export type Editor<T extends TypeWithID, K extends EditorProps<T>> = React.FC<K>;
