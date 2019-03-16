import React, {Component, Fragment} from 'react';
import ReactTooltip from 'react-tooltip';
import { Input, InputGroup, InputGroupAddon } from 'reactstrap';

class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchQuery: '',
            filteredUsers: []
        }

    }

    componentDidMount() {
        ReactTooltip.rebuild();
    }

    onChange = (event) => {
        const { users } = this.props;

        this.setState({ searchQuery: event.target.value.split(' ').join('')}, () => {
            const { searchQuery } = this.state;


            const filteredUsers = users.filter(user => {
                const username = user.username.toLowerCase();

                if (username.includes(searchQuery)) {
                    return user
                }
            });

            if (filteredUsers.length > 0) {
                this.setState({ filteredUsers });
            }

            if (searchQuery.length === 1) {

            }
        });
    };

    getItemsForSell = user => {
        const forSale = user.vinylCollection.filter(vinyl => {
            return vinyl.forSale;
        });
        return forSale;
    };

    render () {
        const { users, getSpecificUser, requestPending } = this.props;
        const { filteredUsers, searchQuery } = this.state;

        console.log(users);
        return (
            <Fragment>
                <InputGroup className="search-bar users">
                    <InputGroupAddon addonType="prepend">Search</InputGroupAddon>
                    <Input onChange={this.onChange} />
                </InputGroup>
                <div className="users-wrapper" >
                    {requestPending ?
                        <div className="loader-wrapper">
                            <div className="loading"></div>
                            <span className="loading-text">LOADING...</span>
                        </div>
                        : null
                    }
                    {!requestPending && users && (searchQuery && filteredUsers ? filteredUsers : users).map(user => {
                        console.log(user)
                        return (
                            <div className="user" key={user.username} onClick={() => getSpecificUser(user._id)}>
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