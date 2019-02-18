import React, { Component } from 'react';
import _ from 'lodash';
import SearchItem from "./SearchItem";
import { DATA_TYPE_RELEASE, GENRES } from '../constants';
import ReactTooltip from 'react-tooltip';
import { InputGroup, InputGroupAddon, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class Collection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchQuery: '',
            filteredCollection: null,
            dropdownOpen: false,
            selectedGenre: ''
        };
    }

    onChange = (event) => {
        const { data } = this.props;
        const { filteredCollection, searchQuery, selectedGenre } = this.state;
        this.setState({ searchQuery: event.target.value.split(' ').join('')});

        const dataForFiltering = filteredCollection || data;
        const newFiltered = dataForFiltering.filter(vinyl => {
            const artistName = vinyl.artists[0].name.toLowerCase().split(' ').join('');
            const title = vinyl.title.toLowerCase().split(' ').join('');
            const searchQuery = event.target.value;
            if (artistName.includes(searchQuery) || title.includes(searchQuery)) {
                return vinyl
            }
        });

        if (newFiltered.length > 0) {
            this.setState({ filteredCollection : newFiltered });
        }

        if (searchQuery.length === 1 && selectedGenre) {
            this.setSelected(selectedGenre);
        }
    };

    toggle = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    };

    setSelected = (genre) => {
        const { data } = this.props;
        this.setState({ selectedGenre: genre });
        const filteredCollection = data.filter(vinyl =>
            vinyl.genres.includes(genre)
        );

        this.setState({ filteredCollection: genre === GENRES.all ? data : filteredCollection });
    };

    render () {
        const {
            history,
            getSpecificResult,
            setSpecificResult,
            currentRelease,
            data,
            clearCurrentRelease,
            collectionType
        } = this.props;

        const { filteredCollection, selectedGenre } = this.state;
        ReactTooltip.rebuild();
        let genres = [];
        data.map(release => {
            release.genres && release.genres.map(style => {
                genres.push(style);
            });
        });

        const representedGenres = [...new Set(genres)];
        const dropdownOptions = representedGenres.map(genre =>
            <DropdownItem className={selectedGenre === genre ? 'selected' : ''}
                          onClick={(event) => this.setSelected(event.target.innerText)}
                          value={genre}>
                {genre}
            </DropdownItem>
        );

        dropdownOptions.unshift(<DropdownItem className={selectedGenre === GENRES.all ? 'selected' : ''}
                                              onClick={(event) => this.setSelected(event.target.innerText)}
                                              value={GENRES.all}>
            {GENRES.all}
        </DropdownItem>);

        return (
            <div>
                <ReactTooltip id="search-page" />
                <InputGroup className="search-bar">
                    <InputGroupAddon addonType="prepend">Search</InputGroupAddon>
                    <Input onChange={this.onChange} />
                </InputGroup>
                <Dropdown isOpen={this.state.dropdownOpen}
                          toggle={this.toggle}>
                    <DropdownToggle caret>
                        {selectedGenre || 'Filter by genre'}
                    </DropdownToggle>
                    <DropdownMenu>
                        {dropdownOptions}
                    </DropdownMenu>
                </Dropdown>
                <div className="results-container">
                    {!_.isEmpty(data) && (filteredCollection || data).map(result => {
                        return (
                            <SearchItem history={history}
                                        release={result}
                                        currentRelease={currentRelease}
                                        clearCurrentRelease={clearCurrentRelease}
                                        collectionType={collectionType}
                                        filterType={DATA_TYPE_RELEASE}
                                        getSpecificResult={getSpecificResult}
                                        setSpecificResult={setSpecificResult}
                                        key={result.id}>
                            </SearchItem>
                        );
                    })
                    }
                </div>
            </div>
        );
    }
}

export default Collection;