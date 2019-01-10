import React, { Component } from 'react';

class ArtistFull extends Component {

    render () {
        const {release} = this.props;

        const title = release.title;


        const year = release.year;
        const artist = release.name;
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
                <span className="release-title">{artist}</span>
                {genres && <p>Genre:  {genres}</p>}
                {styles && <p>Style:  {styles}</p>}
                {year && <p>Year:  {year}</p>}
            </div>
        );
    }
}

export default ArtistFull;