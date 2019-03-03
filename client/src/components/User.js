import React, {Component, Fragment} from 'react';
import ReactTooltip from 'react-tooltip';
import Collection from './Collection';
import { COLLECTION_TYPE_COLLECTION, COLLECTION_TYPE_FOR_SELL, COLLECTION_TYPE_WISHLIST } from '../constants';


class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.user.vinylCollection
        }

    }

    renderCollection = (collectionType) => {
        const { user } = this.props;
        this.setState({ data: collectionType === COLLECTION_TYPE_WISHLIST ? user.wishlist : user.vinylCollection })
    };

    render () {
        const { user, setSpecificResult } = this.props;
        const { data } = this.state;

        return (
            <Fragment>
                <div className="user-wrapper">
                    <span className="username">USER - {user.username}</span>
                    <div className="user-navigation-bar">
                        <span onClick={() => this.renderCollection(COLLECTION_TYPE_COLLECTION)}>COLLECTION</span>
                        <span onClick={() => this.renderCollection(COLLECTION_TYPE_WISHLIST)}>WISHLIST</span>
                        <span onClick={() => this.renderCollection(COLLECTION_TYPE_FOR_SELL)}>FOR SALE</span>
                    </div>
                    <Collection isOtherUserCollection={true}
                                data={data}
                                setSpecificResult={setSpecificResult}
                                collectionType={COLLECTION_TYPE_COLLECTION} />
                </div>
            </Fragment>
        );
    }
}

export default User;