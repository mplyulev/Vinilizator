import React, { Component } from 'react';
import _ from 'lodash';
import Pagination from './common/Pagination';
import SearchItem from "./SearchItem";

class Collection extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };

    }


    render () {
        const { collection, history, getSpecificResult, filterType } = this.props;

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