import React, { Component } from 'react';
import _ from 'lodash';
import Pagination from './common/Pagination';
import SearchItem from "./SearchItem";
import {DATA_TYPE_ARTIST, DATA_TYPE_LABEL, DATA_TYPE_MASTER, DATA_TYPE_RELEASE} from "../constants";

class Collection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            prevProps: props,
            data: null
        };

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log(prevState.prevProps.data, nextProps.data);
        if (prevState.prevProps.data === null && nextProps.data) {
            console.log('asdas');
            return {
                prevProps: nextProps,
                data: nextProps.data
            };
        }

        return null;
    }



    render () {
        const { collection, history, getSpecificResult, filterType, data } = this.props;
        console.log(data);
        return (
            <div>
                {/*<Pagination getNextPageResult={getNextPageResult}*/}
                            {/*filterType={filterType}*/}
                            {/*isVisible={!_.isEmpty(queryResult.results) && queryResult.pagination.pages > 1}*/}
                            {/*data={queryResult.pagination} />*/}
                <div className="results-container">
                    {!_.isEmpty(collection) && collection.map(result => {
                        return (
                            <SearchItem history={history}
                                        release={result}
                                        filterType={filterType}
                                        getSpecificResult={getSpecificResult}
                                        key={result.id}>
                            </SearchItem>
                        );
                    })
                    }
                </div>
                {/*<Pagination getNextPageResult={getNextPageResult}*/}
                            {/*filterType={filterType}*/}
                            {/*isVisible={!_.isEmpty(queryResult.results) && queryResult.pagination.pages > 1}*/}
                            {/*data={queryResult.pagination} />*/}
            </div>
        );
    }
}

export default Collection;