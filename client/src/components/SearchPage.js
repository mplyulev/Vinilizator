import React, { Component, Fragment } from 'react';
import Dropdown from './common/DropdownMultiSelect';

import {
    InputGroup,
    InputGroupAddon,
    Input,
    DropdownItem
} from 'reactstrap';
import _ from 'lodash';
import ReactTooltip from 'react-tooltip';
import Pagination from './common/Pagination';
import SearchItem from "./SearchItem";
import { GENRES, GENRES_ALL } from '../constants';

class SearchPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            prevProps: props,
            isGenreDropdownOpen: false,
            isStyleDropdownOpen: false,
            searchQueryString: props.searchQueryString,
            selectedGenre: null,
            selectedStyle: ''
        };

        this.onChange = this.onChange.bind(this);
    }

    closeDropdowns = () => {
        this.setState({isGenreDropdownOpen: false, isStyleDropdownOpen: false})
    };

    componentDidMount() {
        window.addEventListener("scroll", this.closeDropdowns);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.closeDropdowns);
    }

    onChange(event) {
        this.props.searchQuery(event.target.value, this.state.selectedGenre && this.state.selectedGenre.name, this.state.selectedStyle);
        this.setState({ searchQueryString: event.target.value })
    }

    setSelectedGenre = (genre) => {
        this.setState({ selectedGenre: genre });
        let { selectedStyle } = this.state;

        if (!genre.styles.includes(selectedStyle)) {
            this.setState({ selectedStyle: '' });
        }

        this.props.makeSearchRequest(this.props.searchQueryString, genre.name === GENRES_ALL ? '' : genre.name, selectedStyle ? selectedStyle : '');
    };


    setSelectedStyle = (style) => {
        const { selectedGenre } = this.state;
        this.setState({ selectedStyle: style });

        this.props.makeSearchRequest(this.props.searchQueryString, selectedGenre && selectedGenre.name !== GENRES_ALL ? selectedGenre.name : '', style)
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

        const { selectedGenre, selectedStyle} = this.state;

        ReactTooltip.rebuild();
        const genreDropdownOptions = Object.values(GENRES).map(genre =>
            <DropdownItem onClick={() => this.setSelectedGenre(genre)}
                          className={selectedGenre && selectedGenre.name === genre.name ? 'selected' : ''}
                          value={genre.name}>
                {genre.name}
            </DropdownItem>
        );

        let allStyles = [];
        Object.values(GENRES).forEach(genre => {
            if (genre.styles) {
                allStyles = allStyles.concat(genre.styles);
            }
        });

        let styleDropdownOptions = null;
        !selectedGenre || selectedGenre.name === GENRES_ALL
            ?
            styleDropdownOptions = allStyles.map(style =>
                <DropdownItem onClick={() => this.setSelectedStyle(style)}
                              className={style && style === selectedStyle ? 'selected' : ''}
                              value={style}>
                    {style}
                </DropdownItem>
            )
            :
            styleDropdownOptions = selectedGenre.styles && selectedGenre.styles.map(style =>
                <DropdownItem onClick={() => this.setSelectedStyle(style)}
                              className={style && style === selectedStyle ? 'selected' : ''}
                              value={style}>
                    {style}
                </DropdownItem>
            );

        console.log('asd', queryResult);

        return (
            <div>
                <InputGroup className="search-bar">
                    <InputGroupAddon addonType="prepend">Search</InputGroupAddon>
                    <Input onChange={this.onChange} value={this.state.searchQueryString} />
                </InputGroup>
                <Dropdown items={genreDropdownOptions} title={selectedGenre ? selectedGenre.name : `Filter by genre`}></Dropdown>
                <Dropdown items={styleDropdownOptions} title={selectedStyle || 'Filter by style'}></Dropdown>
                {queryResult.pagination.pages > 1 && <Pagination getNextPageResult={getNextPageResult}
                                                                 style={selectedStyle}
                                                                 genre={selectedGenre}
                                                                 isVisible={!_.isEmpty(queryResult.results) && queryResult.pagination.pages > 1}
                                                                 data={queryResult.pagination} />
                }
                <Fragment>
                    <div className="search-result-container">
                        {!_.isEmpty(queryResult.results) && <div className="filter-container">
                                {/*<span className="result-filter no-pointer">*/}
                                {/*    Results: {queryResult.pagination.items}*/}
                                {/*</span>*/}
                                <p className="result-filter no-pointer">
                                    Page: {queryResult.pagination.page} from {queryResult.pagination.pages}
                                </p>
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
                            {!_.isEmpty(queryResult.results) && !requestPending && queryResult.results.map(result => {
                                return (
                                    <SearchItem history={history}
                                                release={result}
                                                requestPending={requestPending}
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