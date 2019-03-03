import React, {Component, Fragment} from 'react';
import ReactTooltip from 'react-tooltip';

class Users extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        ReactTooltip.rebuild();
    }

    getItemsForSell = user => {
        const forSale = user.vinylCollection.filter(vinyl => {
            return vinyl.forSale;
        });

        return forSale;
    };

    render () {
        const { users, renderUser, requestPending } = this.props;

        return (
            <Fragment>
                <div className="users-wrapper" >
                    {requestPending ?
                        <div className="loader-wrapper">
                            <div className="loading"></div>
                            <span className="loading-text">LOADING...</span>
                        </div>
                        : null
                    }
                    {!requestPending && users && users.map(user => {
                        return (
                            <div className="user" key={user.username} onClick={() => renderUser(user)}>
                                <span className="username">{user.username}</span>
                                <span>Items in collection: {user.vinylCollection.length}</span>
                                <span>Items for sale: {this.getItemsForSell(user) ? this.getItemsForSell(user).length : 0}</span>
                                <span>Items in wishlist: {user.wishlist.length}</span>
                            </div>
                        );
                    })}
                </div>
            </Fragment>
        );
    }
}

export default Users;