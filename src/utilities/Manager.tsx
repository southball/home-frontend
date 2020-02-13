import * as React from 'react';
import {TypeWithID} from "./CRUDProvider";

export interface ManagerProps<T extends TypeWithID> {
    token: string;
}

export type Manager<T extends TypeWithID, K extends ManagerProps<T>> = React.FC<K>;
