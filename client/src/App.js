import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import _ from 'lodash';
import axios from 'axios';

import {
    Redirect,
    Route,
    Switch,
    withRouter
} from 'react-router-dom';

import './App.css';
import AppNavBar from './components/AppNavBar';
import SearchBar from './components/SearchBar';
import RecordsList from './components/RecordsList';

import { DEBOUNCE_TIME, DISCOGS_KEY, DISCOGS_SECRET } from './constants';

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

    makeSearchRequest = query => {
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

    return (
        <div>
          <AppNavBar />
          <SearchBar searchQuery={this.searchQuery} />
            <RecordsList queryResult={queryResult} />
        </div>
    );
  }
}

export default App;
