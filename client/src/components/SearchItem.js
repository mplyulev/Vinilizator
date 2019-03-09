import React, {Component, Fragment} from 'react';
import {
    COLLECTION_TYPE_FOR_SELL,
    COLLECTION_TYPE_MARKET, COLLECTION_TYPE_OTHER_USER,
    CONDITION,
    DOGS_SPACE_GIF_URL,
    TOOLTIP_DELAY_SHOW
} from '../constants';
import NoImagePlaceholder from '../assets/no-cover.png';
import HalfVinyl from '../assets/half-vinyl.png';
import ReactTooltip from 'react-tooltip';
import { FaInfoCircle } from 'react-icons/fa';

class SearchItem extends Component {
    constructor(props) {
        super(props);

        this.item = null;
        this.getRelease = this.getRelease.bind(this);
        this.timeout = null
    }

    async getRelease (type, id){
        const { isOtherUserCollection } = this.props;
        let { collectionType } = this.props;
        document.querySelectorAll('.search-item-container').forEach(container => {
            container.classList.remove('opened');
        });
        console.log('getRelease', collectionType)
        this.item.classList.add('opened');
        if (!collectionType) {
            await this.props.getSpecificResult(type, id);
            } else {
            this.timeout = setTimeout(() => {
                this.props.setSpecificResult(this.props.release, collectionType, isOtherUserCollection);
            }, 300);
        }
    };

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    componentDidMount() {
        ReactTooltip.rebuild();
    }

    render () {
        ReactTooltip.rebuild();
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
        let artistTooltip = '';
        if (collectionType) {
            artist = release.artists && release.artists.map((artist) => {
                artistTooltip = artist.name + artist.join;
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
            <Fragment>
                <div className="search-item-container"
                     ref={node => this.item = node}
                     onClick={() => this.getRelease(release.type, release.id)}>
                    {collectionType === COLLECTION_TYPE_MARKET || collectionType === COLLECTION_TYPE_FOR_SELL
                        ? <div className="selling-info">
                            { collectionType !== COLLECTION_TYPE_FOR_SELL && <span className="seller">Sold by: {release.soldBy.username}</span>}
                            <span>Price: {release.price} BGN</span>
                            <p className="condition"
                                  data-for="collection-page-tooltip"
                                  data-delay-show={TOOLTIP_DELAY_SHOW}
                                  data-tip={release.condition && CONDITION.tooltips[release.condition.type]}>
                                Condition: {release.condition && release.condition.abr}
                                {(collectionType === COLLECTION_TYPE_MARKET || collectionType === COLLECTION_TYPE_FOR_SELL) && release.notes
                                ? <FaInfoCircle className="info-icon"
                                                data-for="collection-page-tooltip"
                                                data-delay-show={TOOLTIP_DELAY_SHOW}
                                                data-tip={release.notes}></FaInfoCircle>
                                : null}
                            </p>
                        </div>
                        : null}
                    <div className="cover-wrapper">
                        <div className="cover-fix-wrapper"><img className="search-item-cover" src={coverUrl}
                                                                alt="Release cover"/></div>
                        <img className="half-vinyl" src={HalfVinyl} alt="Release cover"/>
                    </div>
                    <div className="search-item-info-wrapper">
                        <div className="search-item-title"
                             data-for={!collectionType ? 'search-page-tooltip' : 'collection-page-tooltip'}
                             data-delay-show={TOOLTIP_DELAY_SHOW}
                             data-tip={itemTitle}>{itemTitle}</div>
                        <div className="search-item-title"
                             data-for={!collectionType ? 'search-page-tooltip' : 'collection-page-tooltip'}
                             data-delay-show={TOOLTIP_DELAY_SHOW}
                             data-tip={!collectionType ? artist : artistTooltip}>{artist}</div>
                        {label ?
                            <div className="search-item-info"
                                 data-delay-show={TOOLTIP_DELAY_SHOW}
                                 data-for={!collectionType ? 'search-page-tooltip' : 'collection-page-tooltip'}
                                 data-tip={labelTooltip}>{label}</div> : null}
                        {country ?
                            <div className="search-item-info"
                                 data-for={!collectionType ? 'search-page-tooltip' : 'collection-page-tooltip'}
                                 data-delay-show={TOOLTIP_DELAY_SHOW}
                                 data-tip={country}>{country}</div> : null}
                    </div>
                    <hr className='divider'/>
                </div>
            </Fragment>
        );
    }
}

export default SearchItem;