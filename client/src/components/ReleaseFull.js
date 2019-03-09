import React, { Component, Fragment } from 'react';
import { Button } from 'reactstrap/dist/reactstrap.es'
import axios from 'axios';

import {
    COLLECTION_TYPE_COLLECTION, COLLECTION_TYPE_FOR_SELL,
    CONDITION,
    RESPONSE_STATUS_SUCCESS,
    ROUTE_COLLECTION,
    ROUTE_FOR_SELL,
    ROUTE_WISHLIST,
    SNACKBAR_TYPE_FAIL,
    SNACKBAR_TYPE_SUCCESS,
    TOOLTIP_DELAY_SHOW
} from '../constants';

class ReleaseFull extends Component {
    addToCollection = (release) => {
        const userId = localStorage.getItem('userId');
        axios.post('/api/controllers/collection/addToCollection', { release, userId})
            .then((res) => {
                if (res.status === RESPONSE_STATUS_SUCCESS) {
                    this.props.openSnackbar(res.data.success ? SNACKBAR_TYPE_SUCCESS : SNACKBAR_TYPE_FAIL, res.data.msg);
                }

                axios.post('/api/controllers/collection/removeFromWishlist', {release, userId});
            });
    };

    removeFromCollection = (release) => {
        const userId = localStorage.getItem('userId');
        axios.post('/api/controllers/collection/removeFromCollection', { release, userId })
            .then((res) => {
                if (res.status === RESPONSE_STATUS_SUCCESS) {
                    this.props.history.push(ROUTE_COLLECTION);
                    this.props.openSnackbar(res.data.success ? SNACKBAR_TYPE_SUCCESS : SNACKBAR_TYPE_FAIL, res.data.msg);
                }
            });
    };

    markAsSold = (release) => {
        const userId = localStorage.getItem('userId');
        axios.post('/api/controllers/collection/removeFromCollection', { release, userId }).then(() => {
            this.props.history.push(ROUTE_FOR_SELL);
        });
    };

    addToWishlist = (release) => {
        const userId = localStorage.getItem('userId');
        axios.post('/api/controllers/collection/addToWishlist', { release, userId })
            .then((res) => {
                if (res.status === RESPONSE_STATUS_SUCCESS) {
                    this.props.openSnackbar(res.data.success ? SNACKBAR_TYPE_SUCCESS : SNACKBAR_TYPE_FAIL, res.data.msg);
                }
            });
    };

    removeFromWishlist = (release) => {
        const userId = localStorage.getItem('userId');
        axios.post('/api/controllers/collection/removeFromWishlist', { release, userId })
            .then((res) => {
                if (res.status === RESPONSE_STATUS_SUCCESS) {
                    this.props.history.push(ROUTE_WISHLIST);
                    this.props.openSnackbar(res.data.success ? SNACKBAR_TYPE_SUCCESS : SNACKBAR_TYPE_FAIL, res.data.msg);
                }
            });
    };

    removeFromSell = (release, shouldStayOnSamePage) => {
        const userId = localStorage.getItem('userId');
        axios.post('/api/controllers/collection/removeFromSell', { release, userId })
            .then((res) => {
                if (res.status === RESPONSE_STATUS_SUCCESS) {
                    if (!shouldStayOnSamePage) {
                        this.props.history.push(ROUTE_FOR_SELL);
                    }
                    this.props.getCollection(true, release.id);
                    this.props.openSnackbar(res.data.success ? SNACKBAR_TYPE_SUCCESS : SNACKBAR_TYPE_FAIL, res.data.msg);
                }
            });
    };

    addToCollectionRemoveFromWishlist = (release) => {
        const userId = localStorage.getItem('userId');
        axios.post('/api/controllers/collection/addToCollection', { release, userId })
            .then((res) => {
                if (res.status === RESPONSE_STATUS_SUCCESS) {
                    this.props.openSnackbar(res.data.success ? SNACKBAR_TYPE_SUCCESS : SNACKBAR_TYPE_FAIL, res.data.msg);
                }

                axios.post('/api/controllers/collection/removeFromWishlist', { release, userId })
                    .then((res) => {
                        this.props.history.push(ROUTE_WISHLIST);
                    });
            });
    };

    render () {
        const {
            release,
            openLightbox,
            isInCollection,
            toggleSellModal,
            isInWishlist,
            isInMarket,
            isForSell,
            isOtherUserCollection,
            isSearchItemInCollection,
            isSearchItemForSale,
            isSearchItemInWishlist
        } = this.props;

        const {
            title,
            year,
            country,
            released,
            formats,
            tracklist
        } = release;

        const artists = release.artists && release.artists.map((artist) => {
            return (
                <span key={artist.name}>{` ${artist.name}  ${artist.join}`}</span>
            )
        });

        const images = release.images && release.images.map(img => {
            return img.resource_url;
        });

        const genres = release.genres && release.genres
            ? release.genres.map((genre, index) => {
                return (
                    <span key={genre}>{genre}{index !== release.genres.length - 1 ? ', ' : ''}</span>
                )
            })
            : '';

        const labels = release.labels && release.labels
            ? release.labels.map((label, index) => {
                return (
                    <span key={label.name}>{label.name}{index !== release.labels.length - 1 ? ', ' : ''}</span>
                )
            })
            : '';

        const formatDescription = formats[0] && formats[0].descriptions
            ? formats[0].descriptions.map((description) => {
                return (
                    <span key={description}>,{description}</span>
                )
            })
            : '';

        const styles = release.styles ?
            release.styles.map((style, index) => {
                return (
                    <span key={style}>{style}{index !== release.styles.length - 1 ? ', ' : ''}</span>
                )
            })
            : '';

        const tracklistTemplate = tracklist.map(track => {
            console.log(track);
            return (
                <div key={track.title} className="track">
                    <span>{track.position}.</span>
                    {track.artists && <Fragment><span>{track.artists[0].name}</span>
                        <span>-</span></Fragment>}
                    <span>{track.title}</span>
                    <span>{track.duration}</span>
                </div>
            );
        });
        console.log('test', this.props, isSearchItemInCollection)
        return (
            <Fragment>
                <div className="release-data-container">
                    {isInMarket || isForSell || (isOtherUserCollection && release.forSale) ?
                        <div className="selling-info">
                            <span className="sold-by">Sold by: </span><span
                            className="seller"> {release.soldBy.username}</span>
                            <span>Price: {release.price} BGN</span>
                            <p className="condition"
                               data-for="collection-page-tooltip"
                               data-delay-show={TOOLTIP_DELAY_SHOW}
                               data-tip={release.condition && CONDITION.tooltips[release.condition.type]}>
                                Condition: {release.condition && release.condition.abr}
                                {(isForSell || isInMarket) && release.notes
                                    ? <span>Item info: {release.notes}</span>
                                    : null}
                            </p>
                        </div>
                        : null}
                    {images && <img className="release-cover" onClick={() => openLightbox(images)} src={images[0]}/>}
                    <div className="info-wrapper">
                        <span className="artists">{artists}</span> - <span className="release-title">{title}</span>
                        {labels &&
                        <p>Label: {labels}<span>{release.labels[0].catno ? '-' : ''}{release.labels[0].catno}</span>
                        </p>}
                        {formats.length && formats[0] &&
                        <p>Format: {formats[0].qty > 1 ? formats[0].qty + ' x ' : ''}
                            <span>{formats[0].name}</span> {formatDescription} </p>}
                        {country && <p>Country: <span>{country}</span></p>}
                        {genres && <p>Genre: {genres}</p>}
                        {styles && <p>Style: <span>{styles}</span></p>}
                        {released && year ? <p>Released: <span>{released}</span></p> : null}
                        {year && !released ? <p>Year: <span>{year}</span></p> : null}
                    </div>
                    <div className="tracklist-youtube-wrapper">
                        <div className="tracklist-wrapper">
                            <h3 className="title">Tracklist</h3>
                            {tracklistTemplate}
                        </div>
                        <iframe id="ytplayer" type="text/html" width="640" height="360"
                                src={`https://www.youtube.com/embed?listType=search&list=${release.tracklist[0] && release.tracklist[0].artists ? release.tracklist[0].artists[0].name : release.artists[0].name}${release.tracklist[0].title}`}
                                frameBorder="0">
                        </iframe>
                        {/*when my site has an url add ?origin=http://mywebsite.com to src so i and remake it on component
                               did mount and check respone to see if anything is loaded if not hide iframe */}
                    </div>
                    <div className="buttons-wrapper">
                        {!isInCollection && !isInMarket && !isInWishlist && !isForSell && !isOtherUserCollection
                            ? <Fragment>
                                {!isSearchItemInCollection
                                    ? <Button color="success" className="add-button"
                                              onClick={() => this.addToCollection(release)}>
                                        Add to collection
                                    </Button>
                                    : <Button color="success" className="add-button"
                                              onClick={() => this.removeFromCollection(release)}>
                                        Remove from collection
                                    </Button>}
                                <Button color="success" className="add-button"
                                        onClick={() => this.addToWishlist(release)}>
                                    Add to wishlist
                                </Button>
                                <Button color="success" className="add-button"
                                        onClick={() => toggleSellModal(release)}>
                                    Add to selling
                                </Button>
                            </Fragment>
                            : null
                        }
                        {isInCollection && !isInWishlist && !isOtherUserCollection ?
                            <Fragment>
                                <Button color="success" className="add-button"
                                        onClick={() => this.removeFromCollection(release)}>
                                    Remove from collection
                                </Button>
                                {!release.forSale
                                    ? <Button color="success" className="add-button"
                                              onClick={() => toggleSellModal(release)}>
                                        Add to selling
                                    </Button>
                                    :
                                    <Fragment>
                                        <Button color="success" className="add-button"
                                                onClick={() => this.removeFromSell(release, true)}>
                                            Remove from sell
                                        </Button>
                                        <Button color="success" className="add-button"
                                                onClick={() => toggleSellModal(release)}>
                                            Edit sell info
                                        </Button>
                                    </Fragment>}
                            </Fragment>
                            : null
                        }
                        {isInWishlist && !isOtherUserCollection ?
                            <Fragment>
                                <Button color="success" className="add-button"
                                        onClick={() => this.removeFromWishlist(release)}>
                                    Remove from wishlist
                                </Button>
                                <Button color="success" className="add-button"
                                        onClick={() => this.addToCollectionRemoveFromWishlist(release)}>
                                    Add to collection
                                </Button>
                            </Fragment>
                            : null
                        }
                        {isForSell && !isOtherUserCollection ?
                            <Fragment>
                                <Button color="success" className="add-button"
                                        onClick={() => this.removeFromSell(release)}>
                                    Remove from sell
                                </Button>
                                <Button color="success" className="add-button"
                                        onClick={() => this.markAsSold(release)}>
                                    Mark as sold
                                </Button>
                                <Button color="success" className="add-button"
                                        onClick={() => toggleSellModal(release)}>
                                    Edit sell info
                                </Button>
                            </Fragment>
                            : null
                        }
                        {isInMarket || isOtherUserCollection ?
                            <Fragment>
                                <Button color="success" className="add-button"
                                        onClick={() => console.log('asd')}>
                                    Message {release.soldBy.username}
                                </Button>
                            </Fragment>
                            : null
                        }
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default ReleaseFull;