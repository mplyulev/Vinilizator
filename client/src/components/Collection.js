import React, { Component } from 'react';
import _ from 'lodash';
import Pagination from './common/Pagination';
import SearchItem from "./SearchItem";

class Collection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            prevProps: props,
            data: null
        };

    }

    componentDidMount = () => {
      console.log(this.props)
    }
    

    // static getDerivedStateFromProps(nextProps, prevState) {
    //     console.log(prevState.prevProps, nextProps.data);
    //     if (prevState.prevProps.data === null && nextProps.data) {
    //         console.log('asdas');
    //         console.log(nextProps.data);
    //         return {
    //             prevProps: nextProps,
    //             data: nextProps.data
    //         };
    //     }
    //
    //     return null;
    // }



    render () {
        const { history, getSpecificResult, setSpecificResult, filterType, data } = this.props;
        console.log(data);
        console.log(this.props);
        return (
            <div>
                {/*<Pagination getNextPageResult={getNextPageResult}*/}
                            {/*filterType={filterType}*/}
                            {/*isVisible={!_.isEmpty(queryResult.results) && queryResult.pagination.pages > 1}*/}
                            {/*data={queryResult.pagination} />*/}
                <div className="results-container">
                    {!_.isEmpty(data) && data.map(result => {
                        return (
                            <SearchItem history={history}
                                        release={result}
                                        isInCollection={true}
                                        filterType={filterType}
                                        getSpecificResult={getSpecificResult}
                                        setSpecificResult={setSpecificResult}
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