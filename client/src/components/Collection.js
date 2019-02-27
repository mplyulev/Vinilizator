import React, { Component } from 'react';
import _ from 'lodash';
import SearchItem from "./SearchItem";
import {
    COLLECTION_TYPE_FOR_SELL,
    COLLECTION_TYPE_MARKET,
    DATA_TYPE_RELEASE,
    GENRE_DROPDOWN,
    GENRES, STYLE_DROPDOWN, STYLES_ALL
} from '../constants';
import ReactTooltip from 'react-tooltip';
import { InputGroup, InputGroupAddon, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class Collection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchQuery: '',
            filteredCollection: null,
            isGenreDropdownOpen: false,
            isStyleDropdownOpen: false,
            selectedGenre: '',
            selectedStyle: ''
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
            this.setSelectedGenre(selectedGenre);
        }
    };

    toggle = (type) => {
        type === GENRE_DROPDOWN
            ? this.setState(prevState => ({
                isGenreDropdownOpen: !prevState.isGenreDropdownOpen,
                isStyleDropdownOpen: false
            }))
            : this.setState(prevState => ({
                isStyleDropdownOpen: !prevState.isStyleDropdownOpen,
                isGenreDropdownOpen: false,
            }));
    };

    setSelectedGenre = (genre) => {
        const { data } = this.props;
        this.setState({ selectedGenre: genre });
        const filteredCollection = data.filter(vinyl =>
            vinyl.genres.includes(genre)
        );

        this.setState({ filteredCollection: genre === GENRES.all ? data : filteredCollection, selectedStyle: 'Filter by style' });
    };

    setSelectedStyle = (style) => {
        const { data } = this.props;
        this.setState({ selectedStyle: style });
        const filteredCollection = (this.state.filteredCollection || data).filter(vinyl =>
            vinyl.styles.includes(style)
        );

        if (this.state.selectedGenre && this.state.selectedGenre !== GENRES.all && style === STYLES_ALL) {
            this.setSelectedGenre(this.state.selectedGenre);
        } else {
            this.setState({ filteredCollection: style === STYLES_ALL ? data : filteredCollection });
        }
    };

    componentDidMount() {
        ReactTooltip.rebuild();
    }

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

        const { filteredCollection, selectedGenre, selectedStyle } = this.state;

        let genres = [];
        let styles = [];

        data.map(release => {
            release.genres && release.genres.map(genre => {
                genres.push(genre);
            });
        });

        (filteredCollection || data).map(release => {
            release.styles && release.styles.map(style => {
                styles.push(style);
            });
        });

        const representedGenres = [...new Set(genres)];
        const representedStyles = [...new Set(styles)];

        const genreDropdownOptions = representedGenres.map(genre =>
            <DropdownItem className={selectedGenre === genre ? 'selected' : ''}
                          onClick={(event) => this.setSelectedGenre(event.target.innerText)}
                          value={genre}>
                {genre}
            </DropdownItem>
        );

        genreDropdownOptions.unshift(<DropdownItem className={selectedGenre === GENRES.all ? 'selected' : ''}
                                                   key={GENRES.all}
                                                   onClick={(event) => this.setSelectedGenre(event.target.innerText)}
                                                   value={GENRES.all}>
            {GENRES.all}
        </DropdownItem>);

        const styleDropdownOptions = representedStyles.map(style =>
            <DropdownItem className={selectedStyle === style ? 'selected' : ''}
                          key={style}
                          onClick={(event) => this.setSelectedStyle(event.target.innerText)}
                          value={style}>
                {style}
            </DropdownItem>
        );

        styleDropdownOptions.unshift(<DropdownItem className={selectedStyle === STYLES_ALL ? 'selected' : ''}
                                                   onClick={(event) => this.setSelectedStyle(event.target.innerText)}
                                                   key={STYLES_ALL}
                                                   value={STYLES_ALL}>
            {STYLES_ALL}
        </DropdownItem>);


        // styleDropdownOptions = selectedGenre && selectedGenre !== GENRES.all
        //     && GENRES[selectedGenre.toLowerCase()].styles.map(style =>
        //         <DropdownItem className={selectedStyle === style ? 'selected' : ''}
        //                       onClick={(event) => this.setSelectedStyle(event.target.innerText)}
        //                       value={style}>
        //             {style}
        //         </DropdownItem>
        // );
        //
        // if (selectedGenre === GENRES.all) {
        //
        // }

        return (
            <div>
                <ReactTooltip id="collection-page-tooltip"/>
                <InputGroup className="search-bar">
                    <InputGroupAddon addonType="prepend">Search</InputGroupAddon>
                    <Input onChange={this.onChange}/>
                </InputGroup>
                <Dropdown isOpen={this.state.isGenreDropdownOpen}
                          toggle={() => this.toggle(GENRE_DROPDOWN)}>
                    <DropdownToggle caret>
                        {selectedGenre || 'Filter by genre'}
                    </DropdownToggle>
                    <DropdownMenu>
                        {genreDropdownOptions}
                    </DropdownMenu>
                </Dropdown>
                <Dropdown isOpen={this.state.isStyleDropdownOpen}
                          toggle={() => this.toggle(STYLE_DROPDOWN)}>
                    <DropdownToggle caret>
                        {selectedStyle || 'Filter by style'}
                    </DropdownToggle>
                    <DropdownMenu>
                        {styleDropdownOptions}
                    </DropdownMenu>
                </Dropdown>
                <div
                    className={`results-container${collectionType === COLLECTION_TYPE_MARKET || collectionType === COLLECTION_TYPE_FOR_SELL ? ' bigger-height' : ''}`}>
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