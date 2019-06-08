import React, {Component, Fragment} from 'react';
import Collection from './Collection';
import { COLLECTION_TYPE_COLLECTION, COLLECTION_TYPE_FOR_SELL, COLLECTION_TYPE_WISHLIST } from '../constants';


class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.user.vinylCollection,
            collectionType: COLLECTION_TYPE_COLLECTION
        }

    }


    renderCollection = (event, collectionType) => {
        const navElements = Array.from(document.getElementsByClassName('user-navigation-item'));
        navElements.map(element => {
            element.classList.remove('selected');
        });

        event.target.classList.add('selected');

        let data = [];
        const { user } = this.props;

        switch (collectionType) {
            case COLLECTION_TYPE_COLLECTION:
                data = user.vinylCollection;
                break;
            case COLLECTION_TYPE_WISHLIST:
                data = user.wishlist;
                break;
            case COLLECTION_TYPE_FOR_SELL:
                data = user.vinylCollection.filter(vinyl => {
                   return vinyl.forSale;
                });
        }

        this.setState({ data: data, collectionType: collectionType })
    };

    render () {
        const { user, setSpecificResult } = this.props;
        const { data, collectionType } = this.state;

        return (
            <Fragment>
                <div className="user-wrapper">
                    {/*<span className="user">User - </span>*/}
                    <span className="username">{user.username}'s</span>
                    <div className="user-navigation-bar">
                        <span className="user-navigation-item selected" onClick={(event) => this.renderCollection(event, COLLECTION_TYPE_COLLECTION)}>COLLECTION</span>
                        <span className="user-navigation-item" onClick={(event) => this.renderCollection(event, COLLECTION_TYPE_WISHLIST)}>WISHLIST</span>
                        <span className="user-navigation-item" onClick={(event) => this.renderCollection(event, COLLECTION_TYPE_FOR_SELL)}>FOR SALE</span>
                    </div>
                    <Collection isOtherUserCollection={true}
                                data={data}
                                hideCollection={user.hideCollection}
                                setSpecificResult={setSpecificResult}
                                collectionType={collectionType} />
                </div>
            </Fragment>
        );
    }
}

export default User;