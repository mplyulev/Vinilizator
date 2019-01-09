import React, { Component } from 'react';

class ReleaseFull extends Component {

    render () {
        const {release} = this.props;

        const title = release.title;

        const index = title.indexOf("-");
        const artist = title.substr(0, index);
        const itemTitle = title.substr(index + 1);
        const year = release.year;

        const genres = release.genre.map((genre, index) => {
            return (
                <span>{genre}{index !== release.genre.length - 1 ? ', ' : ''}</span>
            )
        });

        const styles = release.styles.map((style, index) => {
            return (
                <span>{style}{index !== release.style.length - 1 ? ', ' : ''}</span>
            )
        });


        return (
            <div className="release-data-container">
                <img className="release-cover" src={release.cover_image} />
                <span className="release-title">{artist}</span> - <span className="release-title">{title}</span>
                <p>Genre:  {genres}</p>
                <p>Style:  {styles}</p>
                <p>Year:  {year}</p>
            </div>
        );
    }
}

export default ReleaseFull;