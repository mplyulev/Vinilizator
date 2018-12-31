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
            data: {}
        };

        this.onChange = this.onChange.bind(this);
        this.setFilter = this.setFilter.bind(this);
    }

    onChange(event) {
        this.props.searchQuery(event.target.value);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (_.isEmpty(this.props.queryResult.results && _.isEmpty(nextProps.queryResult.results))) {
            this.setState({data: nextProps.queryResult.results});
        }
    }

    setFilter(data) {
        console.log('asd');
        this.setState({data: data});
    }

    render () {
        const { queryResult, getNextPageResult} = this.props;

        let searchResultArtist,
            searchResultLabel,
            searchResultMaster,
            searchResultRelease;

        if (queryResult && !_.isEmpty(queryResult.results) && queryResult.results.length > 0) {
            searchResultArtist = queryResult.results.filter(result => {
                return result.type === DATA_TYPE_ARTIST
            });

            searchResultLabel = queryResult.results.filter(result => {
                return result.type === DATA_TYPE_LABEL
            });

            searchResultRelease = queryResult.results.filter(result => {
                return result.type === DATA_TYPE_RELEASE
            });

            searchResultMaster = queryResult.results.filter(result => {
                return result.type === DATA_TYPE_MASTER
            });
        }

        return (
            <div>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">Search</InputGroupAddon>
                    <Input onChange={this.onChange} placeholder={this.props.searchQueryString}/>
                </InputGroup>

                <div className="search-result-container">
                    {!_.isEmpty(queryResult) && queryResult.results.length > 0
                        ? <span onClick={() => this.setFilter(queryResult.results)} className="result-filter">All
                            <span className="result-number">{queryResult.results.length}</span>
                        </span>
                        : null}
                    {searchResultRelease && searchResultRelease.length > 0
                        ? <span onClick={() => this.setFilter(searchResultRelease)} className="result-filter">Releases
                            <span className="result-number">{searchResultRelease.length}</span>
                        </span>
                        : null}
                    {searchResultLabel && searchResultLabel.length > 0
                        ? <span onClick={() => this.setFilter(searchResultLabel)} className="result-filter">Labels
                            <span className="result-number">{searchResultLabel.length}</span>
                        </span>
                        : null}
                    {searchResultArtist && searchResultArtist.length > 0
                        ?
                        <span onClick={() => this.setFilter(searchResultArtist)} className="result-filter">Artists
                            <span className="result-number">{searchResultArtist.length}</span>
                        </span>
                        : null}
                    {searchResultMaster && searchResultMaster.length > 0
                        ? <span onClick={() => this.setFilter(searchResultMaster)} className="result-filter">Master
                            <span className="result-number">{searchResultMaster.length}</span>
                        </span>
                        : null}

                    <div className="results-container"> {
                        !_.isEmpty(this.state.data) && this.state.data.map(result => {
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