import React, { Component } from 'react';

class MasterFull extends Component {

    render () {
        const {release} = this.props;

        const title = release.title;

        const artists = release.artists.map((artist) => {
            return (
                <span key={artist}>{artist.name}{ artist.join}</span>
            )
        });

        const year = release.year;

        if (release.genres){

        }
        const genres = release.genres
            ? release.genres.map((genre, index) => {
                return (
                    <span key={genre}>{genre}{index !== release.genres.length - 1 ? ', ' : ''}</span>
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

        return (
            <div className="release-data-container">
                <img className="release-cover" src={release.cover_image} />
                <span className="release-title">{artists}</span> - <span className="release-title">{title}</span>
                <p>Genre:  {genres}</p>
                <p>Style:  {styles}</p>
                <p>Year:  {year}</p>
            </div>
        );
    }
}

export default MasterFull;