import React, { Component } from 'react';
import {DATA_TYPE_RELEASE, DOGS_SPACE_GIF_URL, TOOLTIP_DELAY_SHOW} from '../constants';

class SearchItem extends Component {
    render () {
        const {release, getSpecificResult, filterType} = this.props;
        const title = release.title;
        console.log(release.label);
        const label = release.label && release.label
            ? release.label.map((label, index) => {
                return (
                    <span key={label}>{label}{index !== release.label.length - 1 ? ', ' : ''}</span>
                )
            })
            : '';
        let labelTooltip = release.label && release.label
            ? release.label.map((label, index) => {
                return (
                    label + (index !== release.label.length - 1 ? ', ' : '')
                );
            })
            : '';

        labelTooltip += ' - ' + release.catno;
        const country = release.country;
        const index = title && title.indexOf("-");
        const artist = title && title.substr(0, index); // Gets the first part
        const itemTitle = title && title.substr(index + 1);
        const coverUrl = release.cover_image === DOGS_SPACE_GIF_URL ? '../assets/no-cover.png' : release.cover_image;

        return (
            <div className="search-item-container" onClick={() => getSpecificResult(release.type, release.id)}>
                <img className="search-item-cover" src={coverUrl} alt="Release cover"/>
                <div className="search-item-info-wrapper">
                    <div className="search-item-title"
                         data-for="search-page"
                         data-delay-show={TOOLTIP_DELAY_SHOW}
                         data-tip={itemTitle}>{itemTitle}</div>
                    <div className="search-item-title"
                         data-for="search-page"
                         data-delay-show={TOOLTIP_DELAY_SHOW}
                         data-tip={artist}>{artist}</div>
                    {filterType === DATA_TYPE_RELEASE && label ?
                        <div className="search-item-info"
                             data-delay-show={TOOLTIP_DELAY_SHOW}
                             data-for="search-page"
                             data-tip={labelTooltip}>{label} - {release.catno}</div> : null}
                    {filterType === DATA_TYPE_RELEASE && country ?
                        <divx className="search-item-info"
                              data-for="search-page"
                              data-delay-show={TOOLTIP_DELAY_SHOW}
                              data-tip={country}>{country}</divx> : null}
                </div>
            </div>
        );
    }
}

export default SearchItem;