import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import _ from 'lodash';
import axios from 'axios';

import {
    Redirect,
    Route,
    Switch
} from 'react-router-dom';

import './App.css';
import AppNavBar from './components/AppNavBar';
import SearchBar from './components/SearchBar';
import RecordsList from './components/RecordsList';

import {
    DATA_TYPE_ARTIST,
    DATA_TYPE_LABEL, DATA_TYPE_MASTER, DATA_TYPE_RELEASE,
    DEBOUNCE_TIME,
    DISCOGS_KEY,
    DISCOGS_SECRET,
    ROUTE_HOME,
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

    sortDataByType(data) {

    }

    searchQuery = (value) => {
        if (value.length >=0) {
            this.setState({ searchQuery: value });
        }
    };

    makeSearchRequest = (query) => {
        axios.get(`https://api.discogs.com/database/search?q=${query}&key=${DISCOGS_KEY}&secret=${DISCOGS_SECRET}`)
            .then(response => {
                this.setState({ queryResult: response.data });
            })
            .catch(error => {
                console.log(error);
            });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.searchQuery !== this.state.searchQuery) {
            this.makeSearchRequest(this.state.searchQuery);
        }
    }

    render() {
        const { queryResult } = this.state;
        console.log(queryResult);

        if (!_.isEmpty(queryResult)) {
            const searchResultArtists = queryResult.results.filter(result => {
                return result.type === DATA_TYPE_ARTIST
            });

            const searchResultLabels = queryResult.results.filter(result => {
                return result.type === DATA_TYPE_LABEL
            });

            const searchResultReleases = queryResult.results.filter(result => {
                return result.type === DATA_TYPE_RELEASE
            });

            const searchResultMaster = queryResult.results.filter(result => {
                return result.type === DATA_TYPE_MASTER
            });

            console.log(searchResultArtists, searchResultLabels, searchResultReleases, searchResultMaster);
        }

        return (
            <div>
              <AppNavBar />
                <div className="router-container">
                    <Switch>
                        <Route exact path="/"
                               render={() => <Redirect to={ROUTE_HOME} />} />
                        <Route exact path={ROUTE_SEARCH}
                               render={() => <SearchBar searchQuery={this.searchQuery} />} />
                        <Route exact path={ROUTE_SEARCH}
                               render={() => <SearchBar searchQuery={this.searchQuery} />} />
                        <Route exact path="/404" render={() => null} />
                        <Redirect to="/404" />
                    </Switch>
                </div>
            </div>
        );
    }
}

export default App;
