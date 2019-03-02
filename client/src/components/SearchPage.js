import React, { Component, Fragment } from 'react';
import {
    InputGroup,
    InputGroupAddon,
    Input,
    Dropdown,
    DropdownToggle ,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import _ from 'lodash';
import ReactTooltip from 'react-tooltip';
import Pagination from './common/Pagination';
import SearchItem from "./SearchItem";
import { GENRES } from '../constants';

class SearchPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            prevProps: props,
            dropdownOpen: false
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        this.props.searchQuery(event.target.value);
    }

    toggle = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    };

    render () {
        const {
            getNextPageResult,
            searchQueryString,
            requestPending,
            getSpecificResult,
            history,
            currentRelease,
            queryResult,
            clearCurrentRelease
        } = this.props;

        ReactTooltip.rebuild();

        const dropdownOptions = Object.keys(GENRES).map(genre =>
            <DropdownItem value={genre}>{GENRES.name}</DropdownItem>
        );

        return (
            <div>
                <InputGroup className="search-bar">
                    <InputGroupAddon addonType="prepend">Search</InputGroupAddon>
                    <Input onChange={this.onChange} placeholder={searchQueryString} />
                </InputGroup>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle caret>
                        Filter by genre
                    </DropdownToggle>
                    <DropdownMenu>
                        {dropdownOptions}
                    </DropdownMenu>
                </Dropdown>
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
                                    <span className="loading-text">LOADING...</span></div>}
                            <div className="results-container">
                                <ReactTooltip id="search-page-tooltip" />
                                {!_.isEmpty(queryResult.results) && queryResult.results.map(result => {
                                    return (
                                        <SearchItem history={history}
                                                    release={result}
                                                    currentRelease={currentRelease}
                                                    clearCurrentRelease={clearCurrentRelease}
                                                    getSpecificResult={getSpecificResult}
                                                    key={result.id}>
                                        </SearchItem>
                                    );
                                })
                                }
                            </div>
                            <Pagination getNextPageResult={getNextPageResult}
                                        isInBottom={true}
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