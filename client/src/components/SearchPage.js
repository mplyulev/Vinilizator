import React, { Component, Fragment } from 'react';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import _ from 'lodash';

import {
    DATA_TYPE_ARTIST,
    DATA_TYPE_LABEL,
    DATA_TYPE_RELEASE, DATA_TYPE_MASTER
} from '../constants';

class SearchPage extends Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        this.props.searchQuery(event.target.value);
    }

    render () {
        const { queryResult } = this.props;
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
                    {!_.isEmpty(queryResult) && queryResult.results.length > 0 && <span>All</span>}
                    {searchResultRelease && searchResultRelease.length > 0 && <span>Releases {searchResultRelease.length}</span>}
                    {searchResultLabel && searchResultLabel.length > 0 && <span>Labels {searchResultLabel.length}</span>}
                    {searchResultArtist && searchResultArtist.length > 0 && <span>Artists {searchResultArtist.length}</span>}
                    {searchResultMaster && searchResultMaster.length > 0 && <span>Master {searchResultMaster.length}</span>}

                    <Fragment> {
                        !_.isEmpty(queryResult.results) && queryResult.results.map(result => {
                            return (<p key={result.id}>{result.title}</p>)
                        })
                    }
                    </Fragment>
                </div>
            </div>
        );
    }
}

export default SearchPage;