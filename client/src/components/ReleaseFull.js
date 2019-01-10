import React, { Component, Fragment } from 'react';

class ReleaseFull extends Component {

    render () {
        const {release, openLightbox} = this.props;
        const { title, year, country, released, formats, num_for_sale, lowest_price, tracklist } = release;
        const artists = release.artists.map((artist) => {
            return (
                <span key={artist}>{artist.name}{ artist.join}</span>
            )
        });

        const images = release.images.map(img => {
            return img.resource_url;
        });

        const genres = release.genres
            ? release.genres.map((genre, index) => {
                return (
                    <span key={genre}>{genre}{index !== release.genres.length - 1 ? ', ' : ''}</span>
                )
            })
            : '';

        const labels = release.labels
            ? release.labels.map((label, index) => {
                return (
                    <span key={label.name}>{label.name}{index !== release.labels.length - 1 ? ', ' : ''}</span>
                )
            })
            : '';
        console.log('asd',release.formats);
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
                    <span key={style}>{style}{index > release.styles.length - 1 ? ', ' : ''}</span>
                )
            })
            : '';

        const tracklistTemplate = tracklist.map(track => {
            return (
                <div className="track">
                    <span>{track.position}</span>
                    <span>{track.title}</span>
                    <span>{track.duration}</span>
                </div>
            );
        })

        return (
            <Fragment>
                <div className="release-data-container">
                    <img className="release-cover" onClick={() => openLightbox(images)} src={images[0]} />
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
                </div>
                <div className="tracklist-wrapper">
                    <h3 className="title">Tracklist</h3>
                    {tracklistTemplate}
                </div>
            </Fragment>
        );
    }
}

export default ReleaseFull;