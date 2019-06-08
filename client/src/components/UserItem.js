import React, {Component} from 'react';


class UserItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isVisible: false
        };

        this.mountTimeout = null;
    }

    componentWillUnmount() {
        clearTimeout(this.mountTimeout);
    }

    componentDidMount() {
        this.mountTimeout = setTimeout(() => {
            this.setState({ isVisible: true });
        },100);
    }

    render () {
        const { user, getSpecificUser, getItemsForSell } = this.props;
        const { isVisible } = this.state;

        return (
            <div className={`user${isVisible ? ' visible' : ''}`}  key={user.username} onClick={() => getSpecificUser(user._id)}>
                <div className="user-info-wrapper">
                    <span className="username">{user.username}</span>
                    {!user.hideCollection &&
                    <span>Items in collection: {user.vinylCollection.length}</span>}
                    <span>Items for sale: {getItemsForSell(user) ? getItemsForSell(user).length : 0}</span>
                    <span>Items in wishlist: {user.wishlist.length}</span>
                </div>
            </div>
        );
    }
}

export default UserItem;