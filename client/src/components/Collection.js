import React, { Component, Fragment } from 'react';
import _ from 'lodash';
import SearchItem from "./SearchItem";
import {
    COLLECTION_TYPE_COLLECTION,
    COLLECTION_TYPE_FOR_SELL,
    COLLECTION_TYPE_MARKET,
    COLLECTION_TYPE_WISHLIST,
    DATA_TYPE_RELEASE,
    GENRE_DROPDOWN,
    GENRES_ALL,
    ROUTE_SEARCH,
    STYLE_DROPDOWN,
    STYLES_ALL,
    SORT_TYPE_PRICE,
    SORT_TYPE_ALPHABET, SORT_DROPDOWN, SORT_BY_AVERAGE_SALE_PRICE, SORT_BY_COLLECTION_NUMBER, SORT_TYPE_SOLDBY_ALPHABET
} from '../constants';
import ReactTooltip from 'react-tooltip';
import {
    InputGroup,
    InputGroupAddon,
    Input,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Button
} from 'reactstrap';

class Collection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchQuery: '',
            filteredCollection: null,
            isGenreDropdownOpen: false,
            isSortDropdownOpen: false,
            isStyleDropdownOpen: false,
            filteredByGenre: null,
            selectedGenre: '',
            selectedStyle: '',
            selectedSortType: ''
        };
    }

    onChange = (event) => {
        const { data } = this.props;
        const { filteredCollection, searchQuery, selectedGenre, selectedStyle } = this.state;
        this.setState({ searchQuery: event.target.value.split(' ').join('')});
        const searchTerm = event.target.value;
        const dataForFiltering = filteredCollection || data;
        const newFiltered = dataForFiltering.filter(vinyl => {
            const artistName = vinyl.artists[0].name.toLowerCase().split(' ').join('');
            const title = vinyl.title.toLowerCase().split(' ').join('');

            if (artistName.includes(searchTerm) || title.includes(searchTerm)) {
                return vinyl
            }
        });


        if (newFiltered.length > 0) {
            this.setState({ filteredCollection : newFiltered });
        }

        if (searchTerm.length === 0  && (selectedGenre || selectedStyle)) {
            selectedGenre ? this.setSelectedGenre(selectedGenre) : this.setSelectedStyle(selectedStyle);
            if (selectedGenre && selectedStyle) {
                this.setSelectedStyle(selectedGenre);
                this.setSelectedStyle(selectedStyle);
            }
        } else if (searchTerm.length === 0) {
            this.setState({ filteredCollection : data });
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

        if (type === SORT_DROPDOWN) {
            this.setState(prevState => ({
                isStyleDropdownOpen: false,
                isGenreDropdownOpen: false,
                isSortDropdownOpen: !prevState.isSortDropdownOpen
            }));
        }
    };

    setSelectedGenre = (genre) => {
        const { data } = this.props;
        this.setState({ selectedGenre: genre });
        const filteredCollection = data.filter(vinyl =>
            vinyl.genres.includes(genre)
        );

        this.setState({
            filteredCollection: genre === GENRES_ALL ? data : filteredCollection,
            filteredByGenre: genre === GENRES_ALL ? data : filteredCollection,
            selectedStyle: ''
        });
    };

    setSelectedStyle = (style) => {
        const { data } = this.props;
        const { selectedGenre, filteredByGenre } = this.state;

        this.setState({ selectedStyle: style });
        const filteredCollection =  (filteredByGenre && filteredByGenre.length > 0 ? filteredByGenre : data).filter(vinyl =>
            vinyl.styles && vinyl.styles.includes(style)
        );

        if (selectedGenre && selectedGenre !== GENRES_ALL && style === STYLES_ALL) {
            this.setSelectedGenre(selectedGenre);
        } else {
            this.setState({ filteredCollection: style === STYLES_ALL ? data : filteredCollection });
        }
    };


    sortCollection = (sortType) => {
        console.log(sortType);
        const { filteredCollection } = this.state;
        const { data, collectionType } = this.props;
        console.log(data);
        const dataForFiltering = filteredCollection || data;
        this.setState({ selectedSortType: sortType });
        switch(sortType) {
            case SORT_TYPE_PRICE:
                console.log(dataForFiltering);
                dataForFiltering.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                console.log(dataForFiltering);
                this.setState({ filteredCollection: dataForFiltering });
            case SORT_TYPE_ALPHABET:
                dataForFiltering.sort((a, b) => {
                    var artistA = a.artists_sort.toUpperCase();
                    var artistB = b.artists_sort.toUpperCase();
                    return (artistA < artistB) ? -1 : (artistA > artistB) ? 1 : 0;
                });
                this.setState({ filteredCollection: dataForFiltering });
            case SORT_TYPE_SOLDBY_ALPHABET:
                dataForFiltering.sort((a, b) => {
                    var soldByA = a.soldBy.username.toUpperCase();
                    var soldByB = b.soldBy.username.toUpperCase();
                    return (soldByA < soldByB) ? -1 : (soldByA > soldByB) ? 1 : 0;
                });
                this.setState({ filteredCollection: dataForFiltering });
        }
    };

    componentDidMount() {
        ReactTooltip.rebuild();
        console.log('mounting');
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.collectionType !== this.props.collectionType) {
            this.setSelectedGenre('');
            this.setState({ filteredCollection: null });

        }
    }

    render () {
        ReactTooltip.rebuild();
        const {
            history,
            getSpecificResult,
            setSpecificResult,
            currentRelease,
            data,
            clearCurrentRelease,
            collectionType,
            requestPending,
            getSpecificUser,
            isOtherUserCollection,
            hideCollection,
        } = this.props;

        const {
            filteredCollection,
            selectedGenre,
            selectedStyle,
            selectedSortType,
            filteredByGenre,
            isStyleDropdownOpen
        } = this.state;

        let genres = [];
        let styles = [];

        const sellingSortTypes = [SORT_TYPE_ALPHABET, SORT_TYPE_PRICE, SORT_TYPE_SOLDBY_ALPHABET];
        const userSortTypes = [SORT_BY_AVERAGE_SALE_PRICE, SORT_TYPE_ALPHABET, SORT_BY_COLLECTION_NUMBER]

        data.map(release => {
            release.genres && release.genres.map(genre => {
                genres.push(genre);
            });
        });

        (filteredByGenre && filteredByGenre.length > 0 ? filteredByGenre : data).map(release => {
            release.styles && release.styles.map(style => {
                styles.push(style);
            });
        });

        const representedGenres = [...new Set(genres)];
        const representedStyles = [...new Set(styles)];

        const genreDropdownOptions = representedGenres.map(genre =>
            <DropdownItem className={selectedGenre === genre ? 'selected' : ''}
                          key={genre}
                          onClick={(event) => this.setSelectedGenre(event.target.innerText)}
                          value={genre}>
                {genre}
            </DropdownItem>
        );

        genreDropdownOptions.unshift(<DropdownItem className={selectedGenre === <GENRES_ALL></GENRES_ALL> ? 'selected' : ''}
                                                   key={GENRES_ALL}
                                                   onClick={(event) => this.setSelectedGenre(event.target.innerText)}
                                                   value={GENRES_ALL}>
            {GENRES_ALL}
        </DropdownItem>);

        const styleDropdownOptions = representedStyles.map(style =>
            <DropdownItem className={selectedStyle === style ? 'selected' : ''}
                          key={style}
                          onClick={(event) => this.setSelectedStyle(event.target.innerText)}
                          value={style}>
                {style}
            </DropdownItem>
        );

        const sortDropDownOptions = sellingSortTypes.map(sortType =>
            <DropdownItem className={selectedSortType === sortType ? 'selected' : ''}
                          key={sortType}
                          onClick={() => this.sortCollection(sortType)}
                          value={selectedSortType}>
                {sortType}
            </DropdownItem>
        );

        console.log(!_.isEmpty(data) && !requestPending && (!hideCollection || collectionType !== COLLECTION_TYPE_COLLECTION));

        styleDropdownOptions.unshift(<DropdownItem className={selectedStyle === STYLES_ALL ? 'selected' : ''}
                                                   onClick={(event) => this.setSelectedStyle(event.target.innerText)}
                                                   key={STYLES_ALL}
                                                   value={STYLES_ALL}>
            {STYLES_ALL}
        </DropdownItem>);
        return (
            <div>
                <div>
                    <ReactTooltip id="collection-page-tooltip" />
                    <InputGroup className="search-bar">
                        <InputGroupAddon addonType="prepend">Search</InputGroupAddon>
                        <Input onChange={this.onChange} />
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
                    <Dropdown isOpen={this.state.isSortDropdownOpen}
                              toggle={() => this.toggle(SORT_DROPDOWN)}>
                        <DropdownToggle caret>
                            {`Sort by: ${selectedSortType}` || 'Sort by:'}
                        </DropdownToggle>
                        <DropdownMenu>
                            {sortDropDownOptions}
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div
                    className={`results-container collection${collectionType === COLLECTION_TYPE_MARKET || collectionType === COLLECTION_TYPE_FOR_SELL ? ' bigger-height' : ''}`}>
                    {requestPending
                        ?
                        <div className="loader-wrapper">
                            <div className="loading"></div>
                            <span className="loading-text">LOADING...</span>
                        </div>
                        : null}
                         {<Fragment>
                            {!_.isEmpty(data) &&  !requestPending && (!hideCollection || collectionType !== COLLECTION_TYPE_COLLECTION)
                                ? (filteredCollection || data).map(result => {
                                    return (
                                        <SearchItem history={history}
                                                    isOtherUserCollection={isOtherUserCollection}
                                                    release={result}
                                                    currentRelease={currentRelease}
                                                    requestPending={requestPending}
                                                    clearCurrentRelease={clearCurrentRelease}
                                                    collectionType={collectionType}
                                                    filterType={DATA_TYPE_RELEASE}
                                                    getSpecificUser={getSpecificUser}
                                                    getSpecificResult={getSpecificResult}
                                                    setSpecificResult={setSpecificResult}
                                                    key={result.id + new Date()}>
                                        </SearchItem>
                                    );
                                })
                                :
                                !requestPending && <div className="no-results">
                                    {collectionType === COLLECTION_TYPE_WISHLIST
                                        ? !isOtherUserCollection
                                            ? <p>YOU HAVE NO RECORDS IN YOU WISHLIST</p>
                                            : <p>USER HAS NO RECORDS IN HIS WISHLIST</p>
                                        : null}
                                    {collectionType === COLLECTION_TYPE_COLLECTION && !hideCollection
                                        ? !isOtherUserCollection
                                            ? <p>YOU HAVE NO RECORDS IN YOUR COLLECTION</p>
                                            : <p>USER HAS NO RECORDS IN HIS COLLECTION</p>
                                        : null}
                                    {collectionType === COLLECTION_TYPE_COLLECTION && hideCollection

                                        ? <p>THIS USER'S COLLECTION IS HIDDEN</p>
                                        : null
                                    }
                                    {collectionType === COLLECTION_TYPE_FOR_SELL
                                        ? !isOtherUserCollection
                                            ? <p>YOU HAVE NO RECORDS FOR SALE</p>
                                            : <p>USER HAS NO RECORDS FOR SALE</p>
                                        : null}
                                    {collectionType === COLLECTION_TYPE_MARKET ? <p>THE MARKET IS EMPTY</p> : null}
                                    {!isOtherUserCollection && collectionType ? <Button color="success"
                                                                                        onClick={() => this.props.history.push(ROUTE_SEARCH)}>
                                        SEARCH FOR RECORDS
                                    </Button> : null}
                                </div>
                            }
                        </Fragment>
                    }
                </div>
            </div>
        );
    }
}

export default Collection;