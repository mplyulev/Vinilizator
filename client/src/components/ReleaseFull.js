import React, { Component, Fragment } from 'react';
import { Button } from 'reactstrap/dist/reactstrap.es'
import axios from 'axios';
import YouTube from 'react-youtube';

import {
    CONDITION,
    RESPONSE_STATUS_SUCCESS,
    ROUTE_COLLECTION,
    ROUTE_FOR_SELL, ROUTE_RELEASE,
    ROUTE_WISHLIST,
    SNACKBAR_TYPE_FAIL,
    SNACKBAR_TYPE_SUCCESS,
    TOOLTIP_DELAY_SHOW
} from '../constants';
import {withRouter} from "react-router-dom";
import YouTubeApi from 'simple-youtube-api';
const youtube = new YouTubeApi('AIzaSyCclzAC_wEB6H41XMpsFQuqPwG7JqQzAck');

class ReleaseFull extends Component {
    constructor(props) {
        super(props);

        this.state = {
            videoId: ''
        }
    }

    componentDidMount() {
        const { release } = this.props

        const track = release && release.tracklist[0];
        const trackTitle = `${track && track.artists ? track.artists[0].name : release.artists[0].name} - ${track.title}`;
        const query = `${track && track.artists ? track.artists[0].name : release && release.artists[0].name}+${track.title}`;

        youtube.searchVideos(query, 1)
            .then(results => {
                results[0] ? this.setState({
                    videoId: results[0].id,
                    playerTitle: trackTitle,
                    playerRelease: release
                }) : this.setState({ videoId: '' })
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { release } = prevProps;
        const newRelease = this.props.release;
        const track = release.tracklist[0];
        const newTrack = newRelease.tracklist[0];
        const query = `${track && track.artists ? track.artists[0].name : release && release.artists[0].name}+${track.title}`;
        const newQuery =  `${newTrack && newTrack.artists ? newTrack.artists[0].name : newRelease && newRelease.artists[0].name}+${newTrack.title}`;

        if (query !== newQuery) {
            youtube.searchVideos(newQuery, 1)
                .then(results => {
                    results[0] ? this.setState({
                        videoId: results[0].id,
                    }) : this.setState({ videoId: '' })
                })
        }
    }

    addToCollection = (release, shouldResetReleaseStatus) => {
        const userId = localStorage.getItem('userId');
        axios.post('/api/controllers/collection/addToCollection', { release, userId})
            .then((res) => {
                if (res.status === RESPONSE_STATUS_SUCCESS) {
                    axios.post('/api/controllers/collection/removeFromWishlist', {release, userId});
                    this.props.getCollection(shouldResetReleaseStatus).then(() => {
                        this.props.openSnackbar(res.data.success ? SNACKBAR_TYPE_SUCCESS : SNACKBAR_TYPE_FAIL, res.data.msg);
                    });
                }
            });
    };

    removeFromCollection = (release, shouldStayOnSamePage) => {
        const userId = localStorage.getItem('userId');
        axios.post('/api/controllers/collection/removeFromCollection', { release, userId })
            .then((res) => {
                if (res.status === RESPONSE_STATUS_SUCCESS) {
                    if (!shouldStayOnSamePage) {
                        this.props.history.push(ROUTE_COLLECTION);
                        this.props.getCollection();
                    } else {
                        this.props.getCollection(true);
                    }

                    this.props.openSnackbar(res.data.success ? SNACKBAR_TYPE_SUCCESS : SNACKBAR_TYPE_FAIL, res.data.msg);
                }
            });
    };

    markAsSold = (release) => {
        const userId = localStorage.getItem('userId');
        axios.post('/api/controllers/collection/removeFromCollection', { release, userId }).then((res) => {
            this.props.getCollection().then(() => {
                const msg = res.data.success ? `${res.data.release} successfully marked as sold` : 'A problem occurred. Please try again!';
                this.props.openSnackbar(res.data.success ? SNACKBAR_TYPE_SUCCESS : SNACKBAR_TYPE_FAIL, msg);
                this.props.history.push(ROUTE_FOR_SELL);
            });
        });
    };

    addToWishlist = (release) => {
        const userId = localStorage.getItem('userId');
        axios.post('/api/controllers/collection/addToWishlist', { release, userId })
            .then((res) => {
                if (res.status === RESPONSE_STATUS_SUCCESS) {
                    this.props.openSnackbar(res.data.success ? SNACKBAR_TYPE_SUCCESS : SNACKBAR_TYPE_FAIL, res.data.msg);
                }

                this.props.getCollection(true, true, release);
            });
    };

    removeFromWishlist = (release, shouldStayOnSamePage) => {
        const userId = localStorage.getItem('userId');
        axios.post('/api/controllers/collection/removeFromWishlist', { release, userId })
            .then((res) => {
                if (res.status === RESPONSE_STATUS_SUCCESS) {
                    if (!shouldStayOnSamePage) {
                        this.props.history.push(ROUTE_WISHLIST);
                    }

                    this.props.getCollection(true, true, release.id).then(() => {
                        this.props.openSnackbar(res.data.success ? SNACKBAR_TYPE_SUCCESS : SNACKBAR_TYPE_FAIL, res.data.msg);
                    });
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

                    this.props.getCollection(this.props.location.pathname === `${ROUTE_RELEASE}/${release.id}` ? true : false, true, release.id).then(() => {
                        this.props.openSnackbar(res.data.success ? SNACKBAR_TYPE_SUCCESS : SNACKBAR_TYPE_FAIL, res.data.msg);
                    });
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
                        if (res.status === RESPONSE_STATUS_SUCCESS) {
                            this.props.getCollection().then(() => {
                                this.props.history.push(ROUTE_WISHLIST);
                            });
                        }
                    });
            });
    };

    playTrack = (release, track) => {
        const trackTitle = `${track && track.artists ? track.artists[0].name : release.artists[0].name} - ${track.title}`;
        const query = `${track && track.artists ? track.artists[0].name : release && release.artists[0].name}+${track.title}`;

        youtube.searchVideos(query, 1)
            .then(results => {
                results[0] ? this.setState({
                    videoId: results[0].id,
                    playerTitle: trackTitle,
                    playerRelease: release
                }) : this.setState({ videoId: '' })
            })
    };

    render () {
        const { youtubeSrc } = this.state;

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
            isSearchItemInWishlist,
            getSpecificUser,
            toggleChatModal
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

            return (
                <div key={track.title} className="track" onClick={() => this.playTrack(release, track)}>
                    <span>{track.position}.</span>
                    {track.artists && <Fragment><span>{track.artists[0].name}</span>
                        <span>-</span></Fragment>}
                    <span>{track.title}</span>
                    <span>{track.duration}</span>
                </div>
            );
        });

        const opts = {
            height: '220',
            width: '220',
            videoId: this.props.videoId,
            videoEmbeddable: true,
            playerVars: {
                controls: true,
                autoplay: this.state.isPlayerPlaying ? 1 : 0,
                videoEmbeddable: true
            }
        };

        return (
            <Fragment>
                <div className="release-data-container">
                    {isInMarket || isForSell || (isOtherUserCollection && release.forSale) ?
                        <div className="selling-info">
                            {isInMarket && <Fragment>
                                <span className="sold-by">Sold by: </span>
                                <span className="seller" onClick={() => getSpecificUser(release.soldBy.userId)}> {release.soldBy.username}</span>
                            </Fragment>}
                            <span>Price: {release.price} BGN</span>
                            <p className="condition"
                               data-for="collection-page-tooltip"
                               data-delay-show={TOOLTIP_DELAY_SHOW}
                               data-tip={release.condition && CONDITION.tooltips[release.condition.type]}>
                                Condition: {release.condition && release.condition.full}
                                {(isForSell || isInMarket) && release.notes
                                    ? <span>Item info: {release.notes}</span>
                                    : null}
                            </p>
                        </div>
                        : null}
                    {images && <img className="release-cover" onClick={() => openLightbox(images)} src={images[0]} />}
                    <div className="info-wrapper">
                        <span className="artists">{artists}</span> - <span className="release-title">{title}</span>
                        {labels &&
                        <p>Label: {labels}<span>{release.labels[0].catno ? '-' : ''}{release.labels[0].catno}</span>
                        </p>}
                        {formats.length && formats[0] &&
                        <p>Format: {formats[0].qty > 1 ? formats[0].qty + ' x ' : ''}
                            <span> {formats[0].name}</span> {formatDescription} </p>}
                        {country && <p>Country: <span>{country}</span></p>}
                        {genres && <p>Genre: {genres}</p>}
                        {styles && <p>Style: <span>{styles}</span></p>}
                        {released && year ? <p>Released: <span>{released}</span></p> : null}
                        {year && !released ? <p>Year: <span>{year}</span></p> : null}
                        {release.lowest_price && <p>Lowest price on Discogs: {release.lowest_price}$</p>}
                    </div>
                    <div className="tracklist-youtube-wrapper">
                        <div className="tracklist-wrapper">
                            <h3 className="title">Tracklist</h3>
                            {tracklistTemplate}
                        </div>
                        {/*<iframe id="ytplayer" type="text/html" width="640" height="360"*/}
                        {/*        src={youtubeSrc}*/}
                        {/*        controls*/}
                        {/*        frameBorder="0">*/}
                        {/*</iframe>*/}
                        <YouTube
                            className="ytplayer"
                            videoId={this.state.videoId}
                            opts={opts}
                        />
                    </div>
                    <div className="buttons-wrapper">
                        {!isInCollection && !isInMarket && !isInWishlist && !isForSell && !isOtherUserCollection
                            ? <Fragment>
                                <Button color="success" className="add-button"
                                        onClick={
                                            () => !isSearchItemInCollection
                                                ? this.addToCollection(release, true)
                                                : this.removeFromCollection(release, true)}>
                                    {!isSearchItemInCollection ? 'Add to collection' : 'Remove from collection'}
                                </Button>
                                {!isSearchItemInCollection && <Button color="success" className="add-button"
                                                                      onClick={() => !isSearchItemInWishlist
                                                                          ? this.addToWishlist(release)
                                                                          : this.removeFromWishlist(release, true)}>
                                    {!isSearchItemInWishlist ? 'Add to wishlist' : 'Remove from wishlist'}
                                </Button>}
                                <Button color="success" className="add-button"
                                        onClick={() => !isSearchItemForSale
                                            ? toggleSellModal(release)
                                            : this.removeFromSell(release, true)}>
                                    {!isSearchItemForSale ? 'Add to selling' : 'Remove from selling'}
                                </Button>
                                {isSearchItemForSale && <Button color="success" className="add-button"
                                                                onClick={() => toggleSellModal(release)}>
                                    Edit sell info
                                </Button>}
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
                                        onClick={() => toggleChatModal(release.soldBy.username)}>
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

export default withRouter(ReleaseFull);