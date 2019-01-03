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
        if (this.props.searchQueryString !== nextProps.searchQueryString) {
            this.setState({allFilterQueryResult: nextProps.queryResult.results});
            console.log(nextProps.queryResult.results);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {allFilterQueryResult} = this.state;
        console.log(allFilterQueryResult);
        if (allFilterQueryResult && !_.isEmpty(allFilterQueryResult.results) && allFilterQueryResult.results.length > 0) {
            const searchResultArtist = allFilterQueryResult.results.filter(result => {
                return result.type === DATA_TYPE_ARTIST
            });

            const searchResultLabel = allFilterQueryResult.results.filter(result => {
                return result.type === DATA_TYPE_LABEL
            });

            const searchResultRelease = allFilterQueryResult.results.filter(result => {
                return result.type === DATA_TYPE_RELEASE
            });

            const searchResultMaster = allFilterQueryResult.results.filter(result => {
                return result.type === DATA_TYPE_MASTER
            });

            this.setState({searchResultMaster, searchResultRelease, searchResultLabel, searchResultArtist});
        }
    }


    render () {
        const { queryResult, getNextPageResult, makeSearchRequest, searchQueryString } = this.props;
        const {
            allFilterQueryResult,
            searchResultArtist,
            searchResultLabel,
            searchResultMaster,
            searchResultRelease
        } = this.state;

        console.log(this.state)

        return (
            <div>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">Search</InputGroupAddon>
                    <Input onChange={this.onChange} placeholder={searchQueryString}/>
                </InputGroup>
                {!_.isEmpty(queryResult.results) && queryResult.pagination.pages > 1
                    ? <Pagination getNextPageResult={getNextPageResult} data={queryResult.pagination}/>
                    : null}
                <div className="search-result-container">
                    {!_.isEmpty(queryResult) && queryResult.results.length > 0
                        ? <span onClick={() => makeSearchRequest(searchQueryString)} className="result-filter">All
                            <span className="result-number">{queryResult.results.length}</span>
                        </span>
                        : null}
                    {searchResultRelease && searchResultRelease.length > 0
                        ? <span onClick={() => makeSearchRequest(searchQueryString, DATA_TYPE_RELEASE)} className="result-filter">Releases
                            <span className="result-number">{searchResultRelease.length}</span>
                        </span>
                        : null}
                    {searchResultLabel && searchResultLabel.length > 0
                        ? <span onClick={() => makeSearchRequest(searchQueryString, DATA_TYPE_LABEL)} className="result-filter">Labels
                            <span className="result-number">{searchResultLabel.length}</span>
                        </span>
                        : null}
                    {searchResultArtist && searchResultArtist.length > 0
                        ?
                        <span onClick={() => makeSearchRequest(searchQueryString, DATA_TYPE_ARTIST)} className="result-filter">Artists
                            <span className="result-number">{searchResultArtist.length}</span>
                        </span>
                        : null}
                    {searchResultMaster && searchResultMaster.length > 0
                        ? <span onClick={() => makeSearchRequest(searchQueryString, DATA_TYPE_MASTER)} className="result-filter">Master
                            <span className="result-number">{searchResultMaster.length}</span>
                        </span>
                        : null}
                    <div className="results-container"> {
                        !_.isEmpty(queryResult.results) && queryResult.results.map(result => {
                            return (<Release data={result} key={result.id}></Release>)
                        })
                    }
                    </div>
                    {!_.isEmpty(queryResult.results) && queryResult.pagination.pages > 1
                        ? <Pagination getNextPageResult={getNextPageResult} data={queryResult.pagination}/>
                        : null}
                </div>
            </div>
        );
    }
}

export default SearchPage;