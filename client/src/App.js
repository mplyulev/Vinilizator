import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import _ from 'lodash';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import ReactTooltip from 'react-tooltip'

import {
    Redirect,
    Route,
    Switch
} from 'react-router-dom';

import './styles/App.scss';
import AppNavBar from './components/AppNavBar';
import SearchPage from './components/SearchPage';
import Collection from './components/Collection';
import Wishlist from './components/Wishlist';
import ReleaseFull from './components/ReleaseFull';
import MasterFull from './components/MasterFull';
import LabelFull from './components/LabelFull';
import ArtistFull from './components/ArtistFull';
import Snackbar from './components/common/Snackbar';


import {
    COLLECTION_TYPE_COLLECTION, COLLECTION_TYPE_WISHLIST,
    DATA_TYPE_RELEASE,
    DEBOUNCE_TIME,
    DISCOGS_KEY,
    DISCOGS_SECRET,
    DOGS_GET_ITEM_URL,
    DOGS_SEARCH_URL,
    RESPONSE_STATUS_SUCCESS,
    ROUTE_ARTIST,
    ROUTE_COLLECTION,
    ROUTE_HOME,
    ROUTE_LABEL,
    ROUTE_MASTER,
    ROUTE_RELEASE,
    ROUTE_SEARCH,
    ROUTE_SIGN_IN,
    ROUTE_SIGN_UP,
    ROUTE_WISHLIST
} from './constants';
import Authentication from "./components/Authentication";
import LightboxWrapper from './components/common/LightboxWrapper';

const AppContext = React.createContext();

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchQuery: '',
            currentQueryResult: [],
            allFilterQueryResult: {
                pagination: {
                    urls: {}
                }
            },
            filterType: '',
            lastRequestedRoute: '',
            token: localStorage.getItem('token') || '',
            prevProps: props,
            prevPath: props.location.pathname,
            requestPending: false,
            currentRelease: {},
            isLightboxOpened: false,
            lightboxImages: [],
            snackbarOptions: {
                isOpened: false,
                msg: '',
                type: ''
            },
            vinylCollection: [],
            wishlist: []
        };

        this.searchQuery = _.debounce(this.searchQuery, DEBOUNCE_TIME);
        this.getSpecificResult = this.getSpecificResult.bind(this);
        this.releaseAnimationTimeout = null
    }

    searchQuery = (value) => {
        if (value.length > 0) {
            this.setState({ searchQuery: value });
        } else {
            this.setState({ currentQueryResult: {}, searchQuery: '' })
        }
    };

    openSnackbar = (type, msg) => {
        if (this.state.snackbarOptions.isOpened) {
            this.closeSnackbar();
        }

        this.setState({
            snackbarOptions: {
                isOpened: true,
                msg,
                type
            }
        });
    };

    closeSnackbar = () => {
        this.setState(prevState => ({
            snackbarOptions: {
                ...prevState.snackbarOptions,
                isOpened: false
            }
        }));
    };

    makeSearchRequest = (searchQuery, type) => {
        this.setState({requestPending: true});
        axios.get(`${DOGS_SEARCH_URL}?q=${searchQuery}&type=${type || 'all'}${type === DATA_TYPE_RELEASE ? '&format=Vinyl' : ''}&key=${DISCOGS_KEY}&secret=${DISCOGS_SECRET}`)
            .then(response => {
                type
                    ? this.setState({ currentQueryResult: response.data, filterType: type })
                    : this.setState({ allFilterQueryResult: response.data, filterType: type });

                this.setState({ requestPending: false });
            })
            .catch(error => {
                this.setState({ requestPending: false });
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

        this.makeSearchRequest('');
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

    navigateToCollectionItem  = release => {
        this.setState({currentRelease: release}, () => {
            this.props.history.push(`${DATA_TYPE_RELEASE}/${release.id}`);
        });
    }

    async getSpecificResult(type, id) {
        clearTimeout(this.releaseAnimationTimeout);
        axios.get(`${DOGS_GET_ITEM_URL[type]}/${id}?key=${DISCOGS_KEY}&secret=${DISCOGS_SECRET}`)
            .then(response => {
                this.setState({currentRelease: response.data}, () => {
                    this.releaseAnimationTimeout = setTimeout(() => {
                        this.props.history.push(`${type}/${id}`);
                    }, 600);
                });
            })
            .catch(error => {
                console.error(error);
            });
    };



    componentDidUpdate(prevProps, prevState, snapshot) {
        const prevPath = prevProps.location.pathname;
        const nextPath = this.props.location.pathname;
        if ((nextPath === ROUTE_COLLECTION || nextPath === ROUTE_WISHLIST) && nextPath !== prevPath) {
            const collectionType = nextPath === ROUTE_COLLECTION ? COLLECTION_TYPE_COLLECTION : COLLECTION_TYPE_WISHLIST
            console.log(collectionType);
            axios.get('/api/controllers/collection/getCollection', {
                params: {
                    collectionType
                }
            })
                .then((res) => {
                    if (res.status === RESPONSE_STATUS_SUCCESS) {
                        console.log('asdasd', res);
                        console.log('bb', res.data.collection);
                        console.log(collectionType === COLLECTION_TYPE_COLLECTION);
                        this.setState({
                            vinylCollection: collectionType === COLLECTION_TYPE_COLLECTION ? res.data.collection : [],
                            wishlist: collectionType === COLLECTION_TYPE_WISHLIST ? res.data.collection : [],
                        });
                    }
                });
        }
        const { searchQuery, token, lastRequestedRoute } = this.state;
        if (prevState.token !== token && lastRequestedRoute !== ROUTE_SIGN_IN) {
            this.props.history.push(lastRequestedRoute || ROUTE_HOME);
        }

        if (prevState.searchQuery !== searchQuery) {
            this.makeSearchRequest(searchQuery);
        }
    }

    openLightbox = images => {
        this.setState({ isLightboxOpened: true, lightboxImages: images });
    };

    closeLightbox = () => {
        this.setState({ isLightboxOpened: false, lightboxImages: [] });
    };

    render() {
        const {
            currentQueryResult,
            searchQuery,
            requestPending,
            allFilterQueryResult,
            filterType,
            currentRelease,
            isLightboxOpened,
            lightboxImages,
            snackbarOptions,
            vinylCollection,
            wishlist
        } = this.state;

        const { location, history } = this.props;
        const isOnAuthRoute = location.pathname === ROUTE_SIGN_IN || location.pathname === ROUTE_SIGN_UP;
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
                    <div className={`router-container${isOnAuthRoute ? ' auth' : ''}`}>
                        {isLightboxOpened && <LightboxWrapper closeLightbox={this.closeLightbox}
                                                              isLightboxOpened={isLightboxOpened}
                                                              images={lightboxImages} />}
                        <Switch>
                            <Route exact path="/"
                                   render={() => <Redirect to={ROUTE_SEARCH}/>}/>
                            <Route exact path={ROUTE_SIGN_IN}
                                   render={() => <Authentication setToken={this.setToken} isLoginFormActive={true}/>}/>
                            <Route exact path={ROUTE_SIGN_UP}
                                   render={() => <Authentication setToken={this.setToken} isLoginFormActive={false}/>}/>
                            <Route path={ROUTE_RELEASE}
                                   render={() => <ReleaseFull openLightbox={this.openLightbox}
                                                              closeLightbox={this.closeLightbox}
                                                              openSnackbar={this.openSnackbar}
                                                              release={currentRelease} />}/>
                            <Route path={ROUTE_MASTER}
                                   render={() => <MasterFull release={currentRelease} />}/>
                            <Route path={ROUTE_ARTIST}
                                   render={() => <ArtistFull release={currentRelease} />}/>
                            <Route path={ROUTE_LABEL}
                                   render={() => <LabelFull release={currentRelease} />}/>
                            <Route exact path={ROUTE_SEARCH}
                                   render={() => <SearchPage getNextPageResult={this.getNextPageResult}
                                                             currentQueryResult={currentQueryResult}
                                                             allFilterQueryResult={allFilterQueryResult}
                                                             requestPending={requestPending}
                                                             getSpecificResult={this.getSpecificResult}
                                                             filterType={filterType}
                                                             history={history}
                                                             makeSearchRequest={this.makeSearchRequest}
                                                             searchQueryString={searchQuery}
                                                             searchQuery={this.searchQuery}/>}/>
                            <Route exact path={ROUTE_COLLECTION}
                                   render={() => <Collection getSpecificResult={this.getSpecificResult}
                                                             history={history}
                                                             data={vinylCollection}/>}/>
                            <Route exact path={ROUTE_WISHLIST}
                                   render={() => <Wishlist data={wishlist}/>}/>
                            <Route exact path="/404" render={() => null}/>
                            <Redirect to="/404"/>
                        </Switch>
                        <Snackbar snackbarOptions={snackbarOptions} closeSnackbar={this.closeSnackbar}/>
                    </div>
                </div>
            </AppContext.Provider>
        );
    }
}

export default withRouter(App);
