import React, { Component } from 'react';
import { DATA_TYPE_RELEASE, DOGS_SPACE_GIF_URL } from '../constants';

class SearchItem extends Component {

    render () {
        const {release, getSpecificResult, filterType} = this.props;
        const title = release.title;
        // const label = release.label[0];

        const index = title.indexOf("-");
        const artist = title.substr(0, index); // Gets the first part
        const itemTitle = title.substr(index + 1);
        const coverUrl = release.cover_image === DOGS_SPACE_GIF_URL ? '../assets/no-cover.png' : release.cover_image;

        return (
            <div className="search-item-container" onClick={() => getSpecificResult(release.type, release.id)} >
                <img className="search-item-cover" src={coverUrl} />
                <p className="search-item-title">{itemTitle}</p>
                <p className="search-item-title">{artist}</p>
                {filterType === DATA_TYPE_RELEASE && <p></p>}
            </div>
        );
    }
}

export default SearchItem;