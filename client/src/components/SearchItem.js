import React, { Component } from 'react';

class SearchItem extends Component {

    render () {
        const {release} = this.props;
        const title = release.title;

        const index = title.indexOf("-");
        const artist = title.substr(0, index); // Gets the first part
        const itemTitle = title.substr(index + 1);

        return (
            <div className="search-item-container" onClick={() => this.props.history.push(`${release.type}?id=${release.id}`)} >
                <img className="search-item-cover" src={release.cover_image} />
                <p className="search-item-title">{itemTitle}</p>
                <p className="search-item-title">{artist}</p>
            </div>
        );
    }
}

export default SearchItem;