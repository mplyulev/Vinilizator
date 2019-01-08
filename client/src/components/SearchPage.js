import React, { Component, Fragment } from 'react';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import _ from 'lodash';

import Pagination from './common/Pagination';

import {
    DATA_TYPE_ARTIST,
    DATA_TYPE_LABEL,
    DATA_TYPE_RELEASE, DATA_TYPE_MASTER
} from '../constants';
import Release from "./Release";

class SearchPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allFilterQueryResult: [],
            searchResultArtist: [],
            searchResultLabel: [],
            searchResultRelease: [],
            searchResultMaster: [],
            prevProps: props
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        this.props.searchQuery(event.target.value);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { filterType } = nextProps;
        const { requestPending } = prevState.prevProps;
        if (nextProps.requestPending !== requestPending && !nextProps.requestPending && !filterType) {

            const queryResult = nextProps.allFilterQueryResult;

            const searchResultArtist = queryResult.results.filter(result => {
                return result.type === DATA_TYPE_ARTIST
            });

            const searchResultLabel = queryResult.results.filter(result => {
                return result.type === DATA_TYPE_LABEL
            });

            const searchResultRelease = queryResult.results.filter(result => {
                return result.type === DATA_TYPE_RELEASE
            });

            const searchResultMaster = queryResult.results.filter(result => {
                return result.type === DATA_TYPE_MASTER
            });

            return {
                prevProps: nextProps,
                requestPending: nextProps.requestPending,
                searchResultMaster,
                searchResultArtist,
                searchResultLabel,
                searchResultRelease
            };
        }

        return null;
    }

    render () {
        const { getNextPageResult, makeSearchRequest, searchQueryString, filterType, allFilterQueryResult, currentQueryResult } = this.props;
        const {
            searchResultArtist,
            searchResultLabel,
            searchResultMaster,
            searchResultRelease
        } = this.state;

        const queryResult = !filterType ? allFilterQueryResult : currentQueryResult;

        return (
            <div>
                <InputGroup className="search-bar">
                    <InputGroupAddon addonType="prepend">Search</InputGroupAddon>
                    <Input onChange={this.onChange} placeholder={searchQueryString} />
                </InputGroup>
                <Pagination getNextPageResult={getNextPageResult}
                            filterType={filterType}
                            isVisible={!_.isEmpty(queryResult.results) && queryResult.pagination.pages > 1}
                            data={queryResult.pagination} />

                <Fragment>
                    {!_.isEmpty(queryResult.results) && queryResult.results.length >= 1 ?
                        <div className="search-result-container">
                            <div className="filter-container">
                            <span onClick={() => makeSearchRequest(searchQueryString)}
                                  className={`result-filter${!filterType ? ' selected' : ''}`}>All</span>
                                {searchResultRelease && searchResultRelease.length > 0
                                    ? <span onClick={() => makeSearchRequest(searchQueryString, DATA_TYPE_RELEASE)}
                                            className={`result-filter${filterType === DATA_TYPE_RELEASE ? ' selected' : ''}`}>Releases</span>
                                    : null}
                                {searchResultLabel && searchResultLabel.length > 0
                                    ? <span onClick={() => makeSearchRequest(searchQueryString, DATA_TYPE_LABEL)}
                                            className={`result-filter${filterType === DATA_TYPE_LABEL ? ' selected' : ''}`}>Labels</span>
                                    : null}
                                {searchResultArtist && searchResultArtist.length > 0
                                    ? <span onClick={() => makeSearchRequest(searchQueryString, DATA_TYPE_ARTIST)}
                                            className={`result-filter${filterType === DATA_TYPE_ARTIST ? ' selected' : ''}`}>Artists</span>
                                    : null}
                                {searchResultMaster && searchResultMaster.length > 0
                                    ? <span onClick={() => makeSearchRequest(searchQueryString, DATA_TYPE_MASTER)}
                                            className={`result-filter${filterType === DATA_TYPE_MASTER ? ' selected' : ''}`}>Master</span>
                                    : null}
                                <span className="result-filter no-pointer">Results: {queryResult.pagination.items} of {allFilterQueryResult.pagination.items}</span>
                            </div>
                            <div className="results-container"> {
                                !_.isEmpty(queryResult.results) && queryResult.results.map(result => {
                                    return (<Release data={result} key={result.id}></Release>)
                                })
                            }
                            </div>
                            <Pagination getNextPageResult={getNextPageResult}
                                        filterType={filterType}
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