import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import _ from 'lodash';
import { withRouter } from "react-router-dom";
import axios from 'axios';

import {
    Redirect,
    Route,
    Switch
} from 'react-router-dom';

import './styles/App.scss';
import AppNavBar from './components/AppNavBar';
import SearchPage from './components/SearchPage';
import MyCollection from './components/MyCollection';

import {
    DEBOUNCE_TIME,
    DISCOGS_KEY,
    DISCOGS_SECRET,
    DOGS_SEARCH_URL,
    ROUTE_HOME,
    ROUTE_MY_COLLECTION,
    ROUTE_SEARCH,
    ROUTE_SIGN_IN,
    ROUTE_SIGN_UP
} from './constants';
import Authentication from "./components/Authentication";

const AppContext = React.createContext();

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchQuery: '',
            currentQueryResult: [],
            allFilterQueryResult: [],
            filterType: '',
            lastRequestedRoute: '',
            token: localStorage.getItem('token') || '',
            prevProps: props,
            prevPath: props.location.pathname,
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
        this.setState({requestPending: true});
        axios.get(`https://api.discogs.com/database/search?q=${query}&type=${type || 'all'}&key=${DISCOGS_KEY}&secret=${DISCOGS_SECRET}`)
            .then(response => {
                type
                    ? this.setState({ currentQueryResult: response.data, filterType: type})
                    : this.setState({ allFilterQueryResult: response.data, filterType: type});

                this.setState({requestPending: false});
            })
            .catch(error => {
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

    setToken = (token) => {
        this.setState({token});
        localStorage.setItem('token', token);
    };

    logout = () => {
        this.setState({ token: null });
        localStorage.removeItem('token');
    };

    componentDidMount() {
        const {token} = this.state;
        if (!token && this.props.location.pathname !== ROUTE_SIGN_UP && this.props.location.pathname !== ROUTE_SIGN_IN) {
            this.setState({lastRequestedRoute: this.props.location.pathname});
            this.props.history.push(ROUTE_SIGN_IN);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const {token} = prevState;
        const prevPath = prevState.prevProps.location.pathname;
        const nextPath = nextProps.location.pathname;
        if (prevPath !== nextPath && nextPath !== ROUTE_SIGN_UP && nextPath !== ROUTE_SIGN_IN) {
            if (!token) {
                nextProps.history.push(ROUTE_SIGN_IN);
                return {
                    prevProps: nextProps,
                    prevPath: nextProps.location.pathname,
                    lastRequestedRoute: nextProps.location.pathname
                };
            }
        }

        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { searchQuery, token, lastRequestedRoute } = this.state;
        if (prevState.token !== token && lastRequestedRoute !== ROUTE_SIGN_IN) {
            this.props.history.push(lastRequestedRoute || ROUTE_HOME);
        }
        if (prevState.searchQuery !== searchQuery) {
            this.makeSearchRequest(searchQuery);
        }
    }

    render() {
        const {
            currentQueryResult,
            searchQuery,
            requestPending,
            allFilterQueryResult,
            filterType
        } = this.state;
        const { location } = this.props;

        return (
            <AppContext.Provider props={{
                state: this.state,
                searchQuery: this.searchQuery
            }}>
                <div>
                    {location.pathname !== ROUTE_SIGN_UP
                    && location.pathname !== ROUTE_SIGN_IN
                        ? <AppNavBar logout={this.logout} />
                        : null
                    }
                    <div className="router-container">
                        <Switch>
                            <Route exact path="/"
                                   render={() => <Redirect to={ROUTE_SEARCH}/>}/>
                            <Route exact path={ROUTE_SIGN_IN}
                                   render={() => <Authentication setToken={this.setToken} isLoginFormActive={true}/>}/>
                            <Route exact path={ROUTE_SIGN_UP}
                                   render={() => <Authentication setToken={this.setToken} isLoginFormActive={false}/>}/>
                            <Route exact path={ROUTE_SEARCH}
                                   render={() => <SearchPage getNextPageResult={this.getNextPageResult}
                                                             currentQueryResult={currentQueryResult}
                                                             allFilterQueryResult={allFilterQueryResult}
                                                             requestPending={requestPending}
                                                             filterType={filterType}
                                                             makeSearchRequest={this.makeSearchRequest}
                                                             searchQueryString={searchQuery}
                                                             searchQuery={this.searchQuery}/>}/>
                            <Route exact path={ROUTE_MY_COLLECTION}
                                   render={() => <MyCollection />}/>
                            <Route exact path="/404" render={() => null}/>
                            <Redirect to="/404"/>
                        </Switch>
                    </div>
                </div>
            </AppContext.Provider>
        );
    }
}

export default withRouter(App);
