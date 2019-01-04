import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import _ from 'lodash';
import axios from 'axios';

import {
    Redirect,
    Route,
    Switch
} from 'react-router-dom';

import './styles/App.scss';
import AppNavBar from './components/AppNavBar';
import SearchPage from './components/SearchPage';
import SignUp from './components/SignUp';

import {
    DEBOUNCE_TIME,
    DISCOGS_KEY,
    DISCOGS_SECRET, DOGS_SEARCH_URL,
    ROUTE_HOME, ROUTE_LOGIN, ROUTE_MY_COLLECTION,
    ROUTE_SEARCH
} from './constants';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchQuery: '',
            currentQueryResult: [],
            allFilterQueryResult: [],
            filterType: ''
        };

        this.searchQuery = _.debounce(this.searchQuery, DEBOUNCE_TIME);
    }

    searchQuery = (value) => {
        if (value.length > 0) {
            this.setState({ searchQuery: value });
        } else {
            this.setState({ currentQueryResult: {}, searchQuery: '' })
        }
    };

    makeSearchRequest = (query, type) => {
        console.log(type);
        this.setState({requestPending: true});
        axios.get(`https://api.discogs.com/database/search?q=${query}&type=${type || 'all'}&key=${DISCOGS_KEY}&secret=${DISCOGS_SECRET}`)
            .then(response => {
                type
                    ? this.setState({ currentQueryResult: response.data, filterType: type})
                    : this.setState({ allFilterQueryResult: response.data, filterType: type});

                this.setState({requestPending: false});
            })
            .catch(error => {
                console.error(error);
                this.setState({requestPending: false});
            });
    };

    getNextPageResult = (page, type) => {
        this.setState({requestPending: true});
        const {searchQuery} = this.state;
        axios.get(`${DOGS_SEARCH_URL}?q=${searchQuery}&type=${type || 'all'}&page=${page}&key=${DISCOGS_KEY}&secret=${DISCOGS_SECRET}`)
            .then(response => {
                type
                    ? this.setState({ currentQueryResult: response.data, filterType: type})
                    : this.setState({ allFilterQueryResult: response.data, filterType: type});

                this.setState({requestPending: false});
            })
            .catch(error => {
                console.error(error);
                this.setState({requestPending: false});
            });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.searchQuery !== this.state.searchQuery) {
            this.makeSearchRequest(this.state.searchQuery);
        }
    }

    render() {
        const { currentQueryResult, searchQuery, requestPending, allFilterQueryResult, filterType } = this.state;

        return (
            <div>
              <AppNavBar />
                <div className="router-container">
                    <Switch>
                        <Route exact path="/"
                               render={() => <Redirect to={ROUTE_HOME} />} />
                        <Route exact path={ROUTE_LOGIN}
                               render={() => <SignUp />} />
                        <Route exact path={ROUTE_SEARCH}
                               render={() => <SearchPage getNextPageResult={this.getNextPageResult}
                                                         currentQueryResult={currentQueryResult}
                                                         allFilterQueryResult={allFilterQueryResult}
                                                         requestPending={requestPending}
                                                         filterType={filterType}
                                                         makeSearchRequest={this.makeSearchRequest}
                                                         searchQueryString={searchQuery}
                                                         searchQuery={this.searchQuery} />} />
                        <Route exact path={ROUTE_MY_COLLECTION}
                               render={() => <SearchPage currentQueryResult={currentQueryResult} searchQueryString={searchQuery} searchQuery={this.searchQuery} />} />
                        <Route exact path="/404" render={() => null} />
                        <Redirect to="/404" />
                    </Switch>
                </div>
            </div>
        );
    }
}

export default App;
