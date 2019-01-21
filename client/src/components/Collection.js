import React, { Component } from 'react';
import _ from 'lodash';
import Pagination from './common/Pagination';
import SearchItem from "./SearchItem";
import { DATA_TYPE_RELEASE } from '../constants';
import ReactTooltip from 'react-tooltip';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';

class Collection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            prevProps: props,
            data: null
        };

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
        const { history, getSpecificResult, setSpecificResult, currentRelease, data } = this.props;

        return (
            <div>
                <ReactTooltip id="search-page" />
                <InputGroup className="search-bar">
                    <InputGroupAddon addonType="prepend">Search</InputGroupAddon>
                    <Input onChange={this.onChange} />
                </InputGroup>
                {/*<Pagination getNextPageResult={getNextPageResult}*/}
                            {/*filterType={filterType}*/}
                            {/*isVisible={!_.isEmpty(queryResult.results) && queryResult.pagination.pages > 1}*/}
                            {/*data={queryResult.pagination} />*/}
                <div className="results-container">
                    {!_.isEmpty(data) && data.map(result => {
                        console.log(result);
                        return (
                            <SearchItem history={history}
                                        release={result}
                                        currentRelease={currentRelease}
                                        isInCollection={true}
                                        filterType={DATA_TYPE_RELEASE}
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