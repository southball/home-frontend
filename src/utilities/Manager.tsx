import * as React from 'react';

export interface ManagerProps<T> {
    token: string;
}

export type Manager<T, K extends ManagerProps<T>> = React.FC<K>;
