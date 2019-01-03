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
            searchResultMaster: []
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        this.props.searchQuery(event.target.value);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const { filterType } = nextProps;

        if (nextProps.requestPending !== this.props.requestPending && !nextProps.requestPending && !filterType) {

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

            this.setState({searchResultMaster, searchResultRelease, searchResultLabel, searchResultArtist});
        }
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
                <InputGroup>
                    <InputGroupAddon addonType="prepend">Search</InputGroupAddon>
                    <Input onChange={this.onChange} placeholder={searchQueryString} />
                </InputGroup>
                {!_.isEmpty(queryResult.results) && queryResult.pagination.pages > 1
                    ? <Pagination getNextPageResult={getNextPageResult}
                                  filterType={filterType}
                                  data={queryResult.pagination} />
                    : null}
                <Fragment>
                    {!_.isEmpty(queryResult.results) && queryResult.results.length >= 1 ?
                        <div className="search-result-container">
                            <span onClick={() => makeSearchRequest(searchQueryString)}
                                  className="result-filter">All</span>
                            {searchResultRelease && searchResultRelease.length > 0
                                ? <span onClick={() => makeSearchRequest(searchQueryString, DATA_TYPE_RELEASE)}
                                        className="result-filter">Releases</span>
                                : null}
                            {searchResultLabel && searchResultLabel.length > 0
                                ? <span onClick={() => makeSearchRequest(searchQueryString, DATA_TYPE_LABEL)}
                                        className="result-filter">Labels</span>
                                : null}
                            {searchResultArtist && searchResultArtist.length > 0
                                ? <span onClick={() => makeSearchRequest(searchQueryString, DATA_TYPE_ARTIST)}
                                        className="result-filter">Artists</span>
                                : null}
                            {searchResultMaster && searchResultMaster.length > 0
                                ? <span onClick={() => makeSearchRequest(searchQueryString, DATA_TYPE_MASTER)}
                                        className="result-filter">Master</span>
                                : null}
                            <span>Results: {queryResult.pagination.items} of {allFilterQueryResult.pagination.items}</span>
                            <div className="results-container"> {
                                !_.isEmpty(queryResult.results) && queryResult.results.map(result => {
                                    return (<Release data={result} key={result.id}></Release>)
                                })
                            }
                            </div>
                            {!_.isEmpty(queryResult.results) && queryResult.pagination.pages > 1
                                ? <Pagination getNextPageResult={getNextPageResult}
                                              filterType={filterType}
                                              data={queryResult.pagination} />
                                : null}
                        </div>
                        : null
                    }
                </Fragment>
            </div>
        );
    }
}

export default SearchPage;