import * as React from 'react';

export interface EditorProps<T> {
    token: string;
    selected: T;
    onEdit: (t: T) => void;
    onDelete: (t: T) => void;
    onCancel: () => void;
}

export type Editor<T, K extends EditorProps<T>> = React.FC<K>;
