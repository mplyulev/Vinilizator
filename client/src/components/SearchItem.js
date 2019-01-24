import React, { Component } from 'react';
import {DOGS_SPACE_GIF_URL, TOOLTIP_DELAY_SHOW} from '../constants';
import NoImagePlaceholder from '../assets/no-cover.png';
import HalfVinyl from '../assets/half-vinyl.png';

class SearchItem extends Component {
    constructor(props) {
        super(props);

        this.item = null;
        this.getRelease = this.getRelease.bind(this);
        this.timeout = null
    }

    async getRelease (type, id){
        const {collectionType} = this.props;
        this.item.classList.add('opened');
        if (!collectionType) {
            await this.props.getSpecificResult(type, id);
            } else {
            this.timeout = setTimeout(() => {
                this.props.setSpecificResult(this.props.release, collectionType);
            }, 300);
        }
    };

    componentDidMount() {
        if (this.props.currentRelease && this.props.currentRelease.id === this.props.release.id) {
            this.item.classList.add('opened');
            this.timeout = setTimeout(() => {
                this.item.classList.remove('opened');
                this.props.clearCurrentRelease();
            }, 300);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    render () {
        const {release, collectionType} = this.props;
        const title = release.title;
        let label = release.label ? <span key={release.label[0] + Math.random()}>{release.label[0] +  ' - ' + release.catno}</span> : null;

        let labelTooltip = release.label ? release.label[0] + ' - ' + release.catno : '';

        if (!label) {
            label = release.labels ? release.labels[0].name + ' - ' + release.labels[0].catno : '';
            labelTooltip = label;
        }
        const country = release.country;
        const index = title && title.indexOf("-");
        let artist = title && title.substr(0, index); // Gets the first part
        if (collectionType) {
            artist = release.artists && release.artists.map((artist) => {
                return (
                    <span key={artist.name}>{artist.name} {artist.join} </span>
                )
            });
        }

        const itemTitle = title && title.substr(index + 1);
        const collectionReleaseImage = release.images && release.images.length > 0 ? release.images[0].uri : ''
        let coverUrl = release.cover_image === DOGS_SPACE_GIF_URL ? NoImagePlaceholder : release.cover_image || collectionReleaseImage;
        if (!release.cover_image && !collectionReleaseImage) {
            coverUrl = NoImagePlaceholder;
        }

        return (
            <div className="search-item-container"
                 ref={node => this.item = node}
                 onClick={() => this.getRelease(release.type, release.id)}>
                <div className="cover-wrapper">
                    <div className="cover-fix-wrapper"><img className="search-item-cover" src={coverUrl} alt="Release cover"/></div>
                    <img className="half-vinyl" src={HalfVinyl} alt="Release cover"/>
                </div>
                <div className="search-item-info-wrapper">
                    <div className="search-item-title"
                         data-for="search-page"
                         data-delay-show={TOOLTIP_DELAY_SHOW}
                         data-tip={itemTitle}>{itemTitle}</div>
                    <div className="search-item-title"
                         data-for="search-page"
                         data-delay-show={TOOLTIP_DELAY_SHOW}
                         data-tip={artist}>{artist}</div>
                    {label ?
                        <div className="search-item-info"
                             data-delay-show={TOOLTIP_DELAY_SHOW}
                             data-for="search-page"
                             data-tip={labelTooltip}>{label}</div> : null}
                    {country ?
                        <div className="search-item-info"
                              data-for="search-page"
                              data-delay-show={TOOLTIP_DELAY_SHOW}
                              data-tip={country}>{country}</div> : null}
                </div>
            </div>
        );
    }
}

export default SearchItem;