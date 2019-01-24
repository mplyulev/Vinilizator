import React, { Component, Fragment } from 'react';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import _ from 'lodash';
import ReactTooltip from 'react-tooltip';

import Pagination from './common/Pagination';
import SearchItem from "./SearchItem";

class SearchPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            prevProps: props
        };

        this.onChange = this.onChange.bind(this);
    }

    // static getDerivedStateFromProps(nextProps, prevState) {
    //     const { allFilterQueryResult } = prevState.prevProps;
    //
    //     if (nextProps.allFilterQueryResult && nextProps.allFilterQueryResult.pagination
    //         && nextProps.allFilterQueryResult.pagination.urls.last !== allFilterQueryResult.pagination.urls.last) {
    //         return {
    //             prevProps: nextProps,
    //             allFilterQueryResult
    //         };
    //     }
    //
    //     return null;
    // }

    onChange(event) {
        this.props.searchQuery(event.target.value);
    }

    render () {
        const {
            getNextPageResult,
            searchQueryString,
            requestPending,
            getSpecificResult,
            history,
            currentRelease,
            queryResult
        } = this.props;

        ReactTooltip.rebuild();

        return (
            <div>
                <InputGroup className="search-bar">
                    <InputGroupAddon addonType="prepend">Search</InputGroupAddon>
                    <Input onChange={this.onChange} placeholder={searchQueryString} />
                </InputGroup>
                {queryResult.pagination.pages > 1 && <Pagination getNextPageResult={getNextPageResult}
                                                                 isVisible={!_.isEmpty(queryResult.results) && queryResult.pagination.pages > 1}
                                                                 data={queryResult.pagination} />
                }
                <Fragment>
                    {!_.isEmpty(queryResult.results) && queryResult.results.length >= 1 ?
                        <div className="search-result-container">
                            {!requestPending
                                ? <div className="filter-container">
                                    <span
                                        className="result-filter no-pointer">Results: {queryResult.pagination.items}</span>
                                </div>
                                : <div className='filter-container '>
                                    <div className="loading"></div>
                                    <span>Loading...</span></div>}
                            <div className="results-container">
                                <ReactTooltip id="search-page" />
                                {!_.isEmpty(queryResult.results) && queryResult.results.map(result => {
                                    return (
                                        <SearchItem history={history}
                                                    release={result}
                                                    currentRelease={currentRelease}
                                                    getSpecificResult={getSpecificResult}
                                                    key={result.id}>
                                        </SearchItem>
                                    );
                                })
                                }
                            </div>
                            <Pagination getNextPageResult={getNextPageResult}
                                        isVisible={!_.isEmpty(queryResult.results) && queryResult.pagination.pages > 1}
                                        data={queryResult.pagination} />
                        </div>
                        : null
                    }
                </Fragment>
            </div>
        );
    }
}

export default SearchPage;