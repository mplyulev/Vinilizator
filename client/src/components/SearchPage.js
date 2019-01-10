import React, { Component, Fragment } from 'react';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import _ from 'lodash';

import Pagination from './common/Pagination';

import {
    DATA_TYPE_ARTIST,
    DATA_TYPE_LABEL,
    DATA_TYPE_RELEASE,
    DATA_TYPE_MASTER
} from '../constants';
import SearchItem from "./SearchItem";

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

    static getDerivedStateFromProps(nextProps, prevState) {
        const { filterType } = nextProps;
        const { allFilterQueryResult } = prevState.prevProps;

        if (nextProps.allFilterQueryResult && nextProps.allFilterQueryResult.pagination
            && nextProps.allFilterQueryResult.pagination.urls.last !== allFilterQueryResult.pagination.urls.last) {
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
                allFilterQueryResult,
                searchResultMaster,
                searchResultArtist,
                searchResultLabel,
                searchResultRelease
            };
        }

        return null;
    }

    requestByFilter = (searchQueryString, type) => {
        if (type !== this.props.filterType) {
            this.props.makeSearchRequest(searchQueryString, type)
        }
    };

    onChange(event) {
        this.props.searchQuery(event.target.value);
    }

    render () {
        const {
            getNextPageResult,
            searchQueryString,
            filterType,
            allFilterQueryResult,
            currentQueryResult,
            requestPending,
            getSpecificResult,
            history
        } = this.props;
        const {
            searchResultArtist,
            searchResultLabel,
            searchResultMaster,
            searchResultRelease
        } = this.state;

        const queryResult = !filterType ? allFilterQueryResult : currentQueryResult;
        const isAllSearch = searchQueryString === '';

        return (
            <div>
                <InputGroup className="search-bar">
                    <InputGroupAddon addonType="prepend">Search</InputGroupAddon>
                    <Input onChange={this.onChange} placeholder={searchQueryString} />
                </InputGroup>
                {queryResult.pagination.pages > 1 && <Pagination getNextPageResult={getNextPageResult}
                            filterType={filterType}
                            isVisible={!_.isEmpty(queryResult.results) && queryResult.pagination.pages > 1}
                            data={queryResult.pagination} />
                }
                <Fragment>
                    {!_.isEmpty(queryResult.results) && queryResult.results.length >= 1 ?
                        <div className="search-result-container">
                            {!requestPending
                                ? <div className="filter-container">
                                <span onClick={() => this.requestByFilter(searchQueryString)}
                                      className={`result-filter${!filterType ? ' selected' : ''}`}>All</span>
                                    {(searchResultRelease && searchResultRelease.length > 0) || isAllSearch
                                        ? <span onClick={() => this.requestByFilter(searchQueryString, DATA_TYPE_RELEASE)}
                                                className={`result-filter${filterType === DATA_TYPE_RELEASE ? ' selected' : ''}`}>Releases</span>
                                        : null}
                                    {(searchResultLabel && searchResultLabel.length > 0) || isAllSearch
                                        ? <span onClick={() => this.requestByFilter(searchQueryString, DATA_TYPE_LABEL)}
                                                className={`result-filter${filterType === DATA_TYPE_LABEL ? ' selected' : ''}`}>Labels</span>
                                        : null}
                                    {(searchResultArtist && searchResultArtist.length > 0) || isAllSearch
                                        ? <span onClick={() => this.requestByFilter(searchQueryString, DATA_TYPE_ARTIST)}
                                                className={`result-filter${filterType === DATA_TYPE_ARTIST ? ' selected' : ''}`}>Artists</span>
                                        : null}
                                    {(searchResultMaster && searchResultMaster.length > 0) || isAllSearch
                                        ? <span onClick={() => this.requestByFilter(searchQueryString, DATA_TYPE_MASTER)}
                                                className={`result-filter${filterType === DATA_TYPE_MASTER ? ' selected' : ''}`}>Master</span>
                                        : null}
                                    <span
                                        className="result-filter no-pointer">Results: {queryResult.pagination.items} of {allFilterQueryResult.pagination.items}</span>
                                </div>
                                : <div className='filter-container '><div className="loading"></div><span>Loading...</span></div>}
                            <div className="results-container"> {
                                !_.isEmpty(queryResult.results) && queryResult.results.map(result => {
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