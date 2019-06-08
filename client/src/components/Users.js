import React, {Component, Fragment} from 'react';
import ReactTooltip from 'react-tooltip';
import { Input, InputGroup, InputGroupAddon } from 'reactstrap';

import UserItem from './UserItem'

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
                <div className={`users-wrapper${requestPending ? '' : ' visible'}`} >
                    {requestPending ?
                        <div className="loader-wrapper">
                            <div className="loading"></div>
                            <span className="loading-text">LOADING...</span>
                        </div>
                        : null
                    }
                    {users && (searchQuery && !requestPending && filteredUsers ? filteredUsers : users).map(user => {
                        return (
                           <UserItem getItemsForSell={this.getItemsForSell} getSpecificUser={getSpecificUser} user={user}></UserItem>
                        );
                    })}
                </div>
            </Fragment>
        );
    }
}

export default Users;