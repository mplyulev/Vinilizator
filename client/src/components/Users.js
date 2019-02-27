import React, {Component, Fragment} from 'react';
import {
    COLLECTION_TYPE_FOR_SELL,
    COLLECTION_TYPE_MARKET,
    CONDITION,
    DOGS_SPACE_GIF_URL,
    TOOLTIP_DELAY_SHOW
} from '../constants';
import ReactTooltip from 'react-tooltip';

class Users extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        ReactTooltip.rebuild();
    }

    renderUsers = (users) => {
        users.map(user => {
            return (
                <div className="user">{user.username}</div>
            );
        })
    };

    itemsForSell = (user) => {
        user.vinylCollection.filter(vinyl => {
            return vinyl.forSale;
        })
    };

    render () {
        const { users } = this.props;

        return (
            <Fragment>
                <div className="users-wrapper">
                    {users && users.map(user => {
                        return (
                            <div className="user">
                                <span>{user.username}</span>
                                <span>Items in collection: {user.vinylCollection.length}</span>
                                <span>Items for sell: {this.itemsForSell(user).length}</span>
                            </div>
                        );
                    })}
                </div>
            </Fragment>
        );
    }
}

export default Users;