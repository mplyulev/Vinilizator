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

import {
    DEBOUNCE_TIME,
    DISCOGS_KEY,
    DISCOGS_SECRET, DOGS_SEARCH_URL,
    ROUTE_HOME, ROUTE_MY_COLLECTION,
    ROUTE_SEARCH
} from './constants';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchQuery: '',
            queryResult: {}
        };

        this.searchQuery = _.debounce(this.searchQuery, DEBOUNCE_TIME);
    }

    searchQuery = (value) => {
        if (value.length > 0) {
            this.setState({ searchQuery: value });
        } else {
            this.setState({ queryResult: {}, searchQuery: '' })
        }
    };

    makeSearchRequest = (query, type) => {
        this.setState({requestPending: true});
        axios.get(`https://api.discogs.com/database/search?q=${query}&type=${type || 'all'}&key=${DISCOGS_KEY}&secret=${DISCOGS_SECRET}`)
            .then(response => {
                this.setState({ queryResult: response.data, requestPending: false });
            })
            .catch(error => {
                console.error(error);
                this.setState({requestPending: false});
            });
    };

    getNextPageResult = (page) => {
        const {searchQuery} = this.state;
        axios.get(`${DOGS_SEARCH_URL}?q=${searchQuery}&page=${page}&key=${DISCOGS_KEY}&secret=${DISCOGS_SECRET}`)
            .then(response => {
                this.setState({ queryResult: response.data });
            })
            .catch(error => {
                console.error(error);
            });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.searchQuery !== this.state.searchQuery) {
            this.makeSearchRequest(this.state.searchQuery);
        }
    }

    render() {
        const { queryResult, searchQuery } = this.state;

        return (
            <div>
              <AppNavBar />
                <div className="router-container">
                    <Switch>
                        <Route exact path="/"
                               render={() => <Redirect to={ROUTE_HOME} />} />
                        <Route exact path={ROUTE_SEARCH}
                               render={() => <SearchPage getNextPageResult={this.getNextPageResult}
                                                         queryResult={queryResult}
                                                         makeSearchRequest={this.makeSearchRequest}
                                                         searchQueryString={searchQuery} searchQuery={this.searchQuery} />} />
                        <Route exact path={ROUTE_MY_COLLECTION}
                               render={() => <SearchPage queryResult={queryResult} searchQueryString={searchQuery} searchQuery={this.searchQuery} />} />
                        <Route exact path="/404" render={() => null} />
                        <Redirect to="/404" />
                    </Switch>
                </div>
            </div>
        );
    }
}

export default App;
