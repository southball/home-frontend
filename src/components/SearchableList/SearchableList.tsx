import * as React from 'react';
import * as Fuse from 'fuse.js';

interface SearchableListProps<T> {
    list: T[];
    query: string;
    fuseOptions: Fuse.FuseOptions<T>;
    children: (t: T) => JSX.Element;
}

interface SearchableListState<T> {
    prevList: T[];
    prevQuery: string;
    prevFuseOptions: Fuse.FuseOptions<T>;
    filteredList: T[];
}

class SearchableList<T> extends React.Component<SearchableListProps<T>, SearchableListState<T>> {
    public constructor(props: SearchableListProps<T>) {
        super(props);

        this.state = {
            prevList: props.list,
            prevQuery: props.query,
            prevFuseOptions: props.fuseOptions,
            filteredList: SearchableList.computeSearchQuery<T>(props.query, props.list, props.fuseOptions),
        };
    }

    static computeSearchQuery<T>(query: string, list: T[], options: Fuse.FuseOptions<T>) {
        if (query === '') {
            return list;
        } else {
            return new Fuse(list, options).search(query) as T[];
        }
    }
    
    static getDerivedStateFromProps<T>(nextProps: SearchableListProps<T>, prevState: SearchableListState<T>) {
        if (nextProps.list !== prevState.prevList ||
            nextProps.query !== prevState.prevQuery ||
            nextProps.fuseOptions !== prevState.prevFuseOptions) {
            return {
                prevList: nextProps.list,
                prevQuery: nextProps.query,
                prevFuseOptions: nextProps.fuseOptions,
                filteredList: SearchableList.computeSearchQuery(nextProps.query, nextProps.list, nextProps.fuseOptions),
            };
        }

        return null;
    }

    public render() {
        return (
            <>
                {this.state.filteredList.map(this.props.children)}
            </>
        )
    }
}

export default SearchableList;
