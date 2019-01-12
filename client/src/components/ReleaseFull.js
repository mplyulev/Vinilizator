import React, { Component, Fragment } from 'react';
import { Button } from 'reactstrap/dist/reactstrap.es'
import axios from 'axios';
import { RESPONSE_STATUS_SUCCESS, SNACKBAR_TYPE_FAIL, SNACKBAR_TYPE_SUCCESS } from '../constants';

class ReleaseFull extends Component {

    addToCollection = (release) => {
        axios.post('/api/controllers/collection/addToCollection', { release })
            .then((res) => {
                if (res.status === RESPONSE_STATUS_SUCCESS) {
                    this.props.openSnackbar(res.data.success ? SNACKBAR_TYPE_SUCCESS : SNACKBAR_TYPE_FAIL, res.data.msg);
                }
            });
    };

    addToWishlist = (release) => {
        axios.post('/api/controllers/collection/addToWishlist', { release })
            .then((res) => {
                if (res.status === RESPONSE_STATUS_SUCCESS) {
                    this.props.openSnackbar(res.data.success ? SNACKBAR_TYPE_SUCCESS : SNACKBAR_TYPE_FAIL, res.data.msg);
                }
            });
    };

    render () {
        const {release, openLightbox} = this.props;
        const { title, year, country, released, formats, num_for_sale, lowest_price, tracklist } = release;
        const artists = release.artists && release.artists.map((artist) => {
            return (
                <span key={artist.name}>{artist.name}{ artist.join}</span>
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
                <div key={track.title} className="track">
                    <span>{track.position}</span>
                    <span>{track.title}</span>
                    <span>{track.duration}</span>
                </div>
            );
        });

        return (
            <Fragment>
                <div className="release-data-container">
                    <Button color="success" className="add-button add-to-collection" onClick={() => this.addToCollection(release)}>Add to collection</Button>
                    {images &&<img className="release-cover" onClick={() => openLightbox(images)} src={images[0]} />}
                    <div className="info-wrapper">
                        <span className="artists">{artists}</span> - <span className="release-title">{title}</span>
                        {labels && <p>Label: {labels}<span> - {release.labels[0].catno}</span></p>}
                        {formats.length && formats[0] &&
                        <p>Format: {formats[0].qty > 1 ? formats[0].qty + ' x' : ''} <span>{formats[0].name}</span> {formatDescription} </p>}
                        {country && <p>Country: <span>{country}</span></p>}
                        {genres && <p>Genre: {genres}</p>}
                        {styles && <p>Style: <span>{styles}</span></p>}
                            {released && year ? <p>Released: <span>{released}</span></p> : null}
                        {year && !released ? <p>Year: <span>{year}</span></p> : null}
                        {num_for_sale ? <p>{num_for_sale} <span>for sale on Discogs</span></p> : null}
                        {lowest_price ? <p>Lowest Price on Discogs: <span>{lowest_price} &euro;</span></p> : null}
                    </div>
                    <div className="tracklist-wrapper">
                        <h3 className="title">Tracklist</h3>
                        {tracklistTemplate}
                        <Button color="success" className="add-button add-to-wishlist" onClick={() => this.addToWishlist(release)}>Add to wishlist</Button>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default ReleaseFull;