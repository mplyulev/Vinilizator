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
            dropdownOpen: false,
            searchQueryString: props.searchQueryString,
            selectedGenre: null,
            selectedStyle: ''
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        this.props.searchQuery(event.target.value, this.state.selectedGenre && this.state.selectedGenre.name, this.state.selectedStyle);
        this.setState({ searchQueryString: event.target.value })
    }

    toggle = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    };

    setSelectedGenre = (genre) => {
        this.setState({ selectedGenre: genre });

        this.props.makeSearchRequest(this.props.searchQueryString, genre.name)
    };

    render () {
        const {
            getNextPageResult,
            requestPending,
            getSpecificResult,
            history,
            currentRelease,
            queryResult,
            clearCurrentRelease
        } = this.props;

        const { selectedGenre, selectedStyle } = this.state;

        ReactTooltip.rebuild();
        const dropdownOptions = Object.values(GENRES).map(genre =>
            <DropdownItem onClick={() => this.setSelectedGenre(genre)}
                          className={selectedGenre && selectedGenre.name === genre.name ? 'selected' : ''}
                          value={genre.name}>
                {genre.name}
            </DropdownItem>
        );

        const styleDropddownOptions = Object.values(GENRES).map(genre => {
                genre.styles && genre.styles.map(style =>
                    <DropdownItem onClick={() => this.setSelectedGenre(genre)}
                                  className={selectedGenre && selectedGenre.name === genre.name ? 'selected' : ''}
                                  value={genre.name}>
                        {genre.name}
                    </DropdownItem>
                )
            }
        );

        console.log(styleDropddownOptions);

        return (
            <div>
                <InputGroup className="search-bar">
                    <InputGroupAddon addonType="prepend">Search</InputGroupAddon>
                    <Input onChange={this.onChange} value={this.state.searchQueryString} />
                </InputGroup>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle caret>
                        {selectedGenre ? selectedGenre.name : `Filter by genre`}
                    </DropdownToggle>
                    <DropdownMenu>
                        {dropdownOptions}
                    </DropdownMenu>
                </Dropdown>
                {queryResult.pagination.pages > 1 && <Pagination getNextPageResult={getNextPageResult}
                                                                 style={selectedStyle}
                                                                 genre={selectedGenre}
                                                                 isVisible={!_.isEmpty(queryResult.results) && queryResult.pagination.pages > 1}
                                                                 data={queryResult.pagination} />
                }
                <Fragment>
                    <div className="search-result-container">
                        {!_.isEmpty(queryResult.results) && <div className="filter-container">
                                <span className="result-filter no-pointer">
                                    Results: {queryResult.pagination.items}
                                </span>
                        </div>}
                        <div className="results-container">
                            {requestPending ?
                                <div className="loader-wrapper">
                                    <div className="loading"></div>
                                    <span className="loading-text">LOADING...</span>
                                </div>
                                : null
                            }
                            <ReactTooltip id="search-page-tooltip" />
                            {!requestPending && !_.isEmpty(queryResult.results) && queryResult.results.map(result => {
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
                        {!requestPending &&
                        <Pagination getNextPageResult={getNextPageResult}
                                    isInBottom={true}
                                    style={selectedStyle}
                                    genre={selectedGenre}
                                    isVisible={!_.isEmpty(queryResult.results) && queryResult.pagination.pages > 1}
                                    data={queryResult.pagination} />}
                    </div>
                </Fragment>
            </div>
        );
    }
}

export default SearchPage;