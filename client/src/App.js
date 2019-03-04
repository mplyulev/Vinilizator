import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import _ from 'lodash';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { Scrollbars } from 'react-custom-scrollbars';

import {
    Redirect,
    Route,
    Switch
} from 'react-router-dom';

import './styles/App.scss';
import AppNavBar from './components/AppNavBar';
import SearchPage from './components/SearchPage';
import Collection from './components/Collection';
import ReleaseFull from './components/ReleaseFull';
import Account from './components/Account';
import SellModal from './components/SellModal';
import Snackbar from './components/common/Snackbar';
import Authentication from "./components/Authentication";
import LightboxWrapper from './components/common/LightboxWrapper';
import Users from "./components/Users";
import User from "./components/User";

import {
    COLLECTION_TYPE_COLLECTION,
    COLLECTION_TYPE_WISHLIST,
    COLLECTION_TYPE_FOR_SELL,
    DATA_TYPE_RELEASE,
    DEBOUNCE_TIME,
    DISCOGS_KEY,
    DISCOGS_SECRET,
    DOGS_GET_ITEM_URL,
    DOGS_SEARCH_URL,
    RESPONSE_STATUS_SUCCESS,
    ROUTE_COLLECTION,
    ROUTE_HOME,
    ROUTE_RELEASE,
    ROUTE_SEARCH,
    ROUTE_SIGN_IN,
    ROUTE_SIGN_UP,
    ROUTE_WISHLIST,
    ROUTE_ACCOUNT,
    ROUTE_FOR_SELL,
    ROUTE_MARKET,
    COLLECTION_TYPE_MARKET,
    SNACKBAR_TYPE_SUCCESS,
    SNACKBAR_TYPE_FAIL,
    ROUTE_USERS, COLLECTION_TYPE_OTHER_USER
} from './constants';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchQuery: '',
            currentQueryResult: [],
            queryResult: {
                pagination: {
                    urls: {}
                }
            },
            lastRequestedRoute: '',
            token: localStorage.getItem('token') || '',
            prevProps: props,
            prevPath: props.location.pathname,
            requestPending: false,
            currentRelease: {},
            isLightboxOpenesetd: false,
            lightboxImages: [],
            snackbarOptions: {
                isOpened: false,
                msg: '',
                type: ''
            },
            vinylCollection: [],
            wishlist: [],
            forSale: [],
            market: [],
            isNavBarOpened: false,
            isSellModalOpened: false,
            currentUser: null
        };

        this.searchQuery = _.debounce(this.searchQuery, DEBOUNCE_TIME);
        this.getSpecificResult = this.getSpecificResult.bind(this);
        this.releaseAnimationTimeout = null
    }

    toggleNavBar = (shouldClose) => {
        if (shouldClose) {
            this.setState({
                isNavBarOpened: false
            });

            return;
        }

        this.setState({
            isNavBarOpened: !this.state.isNavBarOpened
        });
    };

    // TODO move all methods from ReleaseFull in helpers maybe because now it is inconsistent with
    // TODO add to sell list method being here
    addToSellList = (release, sellData , isEditing) => {
        const userId = localStorage.getItem('userId');
        this.toggleSellModal();
        axios.post('/api/controllers/collection/addToCollection', {release, userId});
        axios.post('/api/controllers/collection/removeFromWishlist', {release, userId});
        axios.post('/api/controllers/collection/addToSellList', { release, userId, sellData, isEditing })
            .then((res) => {
                if (res.status === RESPONSE_STATUS_SUCCESS) {
                    this.openSnackbar(res.data.success ? SNACKBAR_TYPE_SUCCESS : SNACKBAR_TYPE_FAIL, res.data.msg);
                    this.getCollection(COLLECTION_TYPE_COLLECTION, true, release.id);
                }
            });
    };

    toggleSellModal = () => {
        this.setState({
            isSellModalOpened: !this.state.isSellModalOpened
        });
    };

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
        axios.get(`${DOGS_SEARCH_URL}?q=${searchQuery}&type=${DATA_TYPE_RELEASE}&format=Vinyl&key=${DISCOGS_KEY}&secret=${DISCOGS_SECRET}`)
            .then(response => {
                this.setState({ queryResult: response.data });
                this.setState({ requestPending: false });
            })
            .catch(error => {
                this.setState({ requestPending: false });
            });
    };

    renderUser = user => {
        this.props.history.push(`${ROUTE_USERS}/${user.username}`);
        this.setState({ currentUser: user })
    };

    getNextPageResult = (page, type) => {
        this.setState({requestPending: true});
        const {searchQuery} = this.state;

        axios.get(`${DOGS_SEARCH_URL}?q=${searchQuery}&type=${DATA_TYPE_RELEASE}&format=Vinyl&page=${page}&key=${DISCOGS_KEY}&secret=${DISCOGS_SECRET}`)
            .then(response => {
                this.setState({ queryResult: response.data });

                this.setState({requestPending: false});
            })
            .catch(error => {
                console.error(error);
                this.setState({requestPending: false});
            });
    };

    setToken = (token, userId) => {
        this.setState({token});
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
    };

    logout = () => {
        this.setState({ token: null });
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    };

    closeOnOutsideClick = (event) => {
        const navbar = document.getElementsByClassName('navbar')[0];
        if (this.state.isNavBarOpened && !navbar.contains(event.target)) {
            this.toggleNavBar(true);
        }
    };

    componentDidMount() {
        document.addEventListener('click', this.closeOnOutsideClick);
        const { token } = this.state;
        const { location } = this.props;

        if (!token && location.pathname !== ROUTE_SIGN_UP && location.pathname !== ROUTE_SIGN_IN) {
            this.setState({ lastRequestedRoute: this.props.location.pathname });
            this.props.history.push(ROUTE_SIGN_IN);
        }

        let pathname = location.pathname;

        if (pathname[pathname.length - 1] === '/') {
            pathname = pathname.substring(0, pathname.length - 1)
        }

        let collectionType = '';
        switch (pathname) {
            case ROUTE_COLLECTION:
                collectionType = COLLECTION_TYPE_COLLECTION;
                this.getCollection(collectionType);
                break;
            case ROUTE_WISHLIST:
                collectionType = COLLECTION_TYPE_WISHLIST;
                this.getCollection(collectionType);
                break;
            case ROUTE_MARKET:
                collectionType = COLLECTION_TYPE_MARKET;
                this.getMarket();
                break;
            case ROUTE_FOR_SELL:
                collectionType = COLLECTION_TYPE_COLLECTION;
                this.getCollection(collectionType);
                break;
            case ROUTE_USERS:
                this.getUsers();
                break;
            case ROUTE_SEARCH:
                this.makeSearchRequest('');
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

    getMarket = () => {
        this.setState({requestPending: true});
        axios.get('/api/controllers/collection/getMarket')
            .then((res) => {
                this.setState({requestPending: false});
                if (res.status === RESPONSE_STATUS_SUCCESS) {
                    this.setState({
                        market: res.data.collection
                    });
                }
            });
    };

    getUsers = () => {
        this.setState({requestPending: true});
        axios.get('/api/controllers/collection/getUsers')
            .then((res) => {
                this.setState({requestPending: false});
                if (res.status === RESPONSE_STATUS_SUCCESS) {
                    this.setState({
                        users: res.data.users
                    });
                }
            });
    };

    setSpecificResult = (release, collectionType, isOtherUserCollection) => {
        this.clearCurrentRelease();

        const { currentUser } = this.state;

        this.setState({ currentRelease: release }, () => {
            this.releaseAnimationTimeout = setTimeout(() => {
                switch (collectionType && !isOtherUserCollection) {
                    case COLLECTION_TYPE_COLLECTION:
                        this.props.history.push(`${ROUTE_COLLECTION}${ROUTE_RELEASE}/${release.id}`);
                        break;
                    case COLLECTION_TYPE_WISHLIST:
                        this.props.history.push(`${ROUTE_WISHLIST}${ROUTE_RELEASE}/${release.id}`);
                        break;
                    case COLLECTION_TYPE_FOR_SELL:
                        this.props.history.push(`${ROUTE_FOR_SELL}${ROUTE_RELEASE}/${release.id}`);
                        break;
                    case COLLECTION_TYPE_MARKET:
                        this.props.history.push(`${ROUTE_MARKET}${ROUTE_RELEASE}/${release.id}`);
                        break;
                    case COLLECTION_TYPE_OTHER_USER:
                        this.props.history.push(`${ROUTE_USERS}/${currentUser && currentUser.username}${ROUTE_RELEASE}/${release.id}`);
                        break;

                }
            }, 600);
        })
    };

    async getSpecificResult(type, id) {
        this.clearCurrentRelease();
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

    resetSpecificResult = (data, currentReleaseId) => {
        data.map(release => {
            if (release.id === currentReleaseId) {
                this.setState({ currentRelease: release });
            }
        });
    };

    getCollection = (collectionType, shouldResetCurrentRelease, currentReleaseId) => {
        this.setState({requestPending: true});
        axios.get('/api/controllers/collection/getCollection', {
            params: {
                collectionType,
                userId: localStorage.getItem('userId')
            }
        })
            .then((res) => {

                if (res.status === RESPONSE_STATUS_SUCCESS) {
                    this.setState({
                        vinylCollection: collectionType === COLLECTION_TYPE_COLLECTION || collectionType === COLLECTION_TYPE_FOR_SELL ? res.data.collection : [],
                        wishlist: collectionType === COLLECTION_TYPE_WISHLIST ? res.data.collection : []
                    });

                    if (shouldResetCurrentRelease) {
                        this.resetSpecificResult(res.data.collection, currentReleaseId)
                    }
                }

                this.setState({ requestPending: false });
            });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const prevPath = prevProps.location.pathname;
        const nextPath = this.props.location.pathname;

        if ((nextPath === ROUTE_COLLECTION
            || nextPath === ROUTE_WISHLIST
            || nextPath === ROUTE_FOR_SELL
            || nextPath === ROUTE_SEARCH
            || nextPath === ROUTE_MARKET
            || nextPath === ROUTE_USERS)
            && nextPath !== prevPath) {
            let collectionType = '';
            this.setState({requestPending: false});
            switch (nextPath) {
                case ROUTE_COLLECTION:
                    collectionType = COLLECTION_TYPE_COLLECTION;
                    this.getCollection(collectionType);
                    break;
                case ROUTE_WISHLIST:
                    collectionType = COLLECTION_TYPE_WISHLIST;
                    this.getCollection(collectionType);
                    break;
                case ROUTE_FOR_SELL:
                    collectionType = COLLECTION_TYPE_COLLECTION;
                    this.getCollection(collectionType);
                    break;
                case ROUTE_MARKET:
                    collectionType = COLLECTION_TYPE_MARKET;
                    this.getMarket();
                    break;
                case ROUTE_USERS:
                    this.getUsers();
                    break;
                case ROUTE_SEARCH:
                    this.makeSearchRequest('');
            }
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

    clearCurrentRelease = () => {
        this.setState({ currentRelease: null });
    };

    render() {
        const {
            currentQueryResult,
            searchQuery,
            requestPending,
            queryResult,
            currentRelease,
            isLightboxOpened,
            lightboxImages,
            snackbarOptions,
            vinylCollection,
            wishlist,
            users,
            market,
            isNavBarOpened,
            isSellModalOpened,
            currentUser
        } = this.state;
        console.log(`${ROUTE_USERS}/${currentUser && currentUser.username}/${ROUTE_RELEASE}`);
        const { location, history } = this.props;
        const isOnAuthRoute = location.pathname === ROUTE_SIGN_IN || location.pathname === ROUTE_SIGN_UP;
        return (
            <div>
                <Scrollbars autoHide
                            className="scrollbar"
                            autoHideTimeout={1000}
                            autoHideDuration={500}
                            style={{width: `100%`, height: `100vh`}}>
                    <div className="mega-wrapper">
                        {isSellModalOpened && <SellModal toggleSellModal={this.toggleSellModal}
                                                         addToSellList={this.addToSellList}
                                                         currentRelease={currentRelease}
                                                         isSellModalOpened={isSellModalOpened}/>}
                        <AppNavBar isNavBarOpened={isNavBarOpened}
                                   isVisible={location.pathname !== ROUTE_SIGN_UP && location.pathname !== ROUTE_SIGN_IN}
                                   toggleNavBar={this.toggleNavBar}
                                   logout={this.logout}/>
                        <div
                            className={`router-container${isOnAuthRoute ? ' auth' : ''}${isNavBarOpened ? ' opened-navbar' : ''}`}>
                            {isLightboxOpened && <LightboxWrapper closeLightbox={this.closeLightbox}
                                                                  isLightboxOpened={isLightboxOpened}
                                                         Collection         images={lightboxImages}/>}
                            <div id="player"></div>
                            <Switch>
                                <Route exact path="/"
                                       render={() => <Redirect to={ROUTE_SEARCH}/>}/>
                                <Route exact path={ROUTE_SIGN_IN}
                                       render={() => <Authentication setToken={this.setToken}
                                                                     isLoginFormActive={true}/>}/>
                                <Route exact path={ROUTE_SIGN_UP}
                                       render={() => <Authentication setToken={this.setToken}
                                                                     isLoginFormActive={false}/>}/>
                                <Route path={ROUTE_RELEASE}
                                       render={() => <ReleaseFull openLightbox={this.openLightbox}
                                                                  closeLightbox={this.closeLightbox}
                                                                  getCollection={this.getCollection}
                                                                  toggleSellModal={this.toggleSellModal}
                                                                  openSnackbar={this.openSnackbar}
                                                                  release={currentRelease}/>}/>
                                <Route exact path={ROUTE_SEARCH}
                                       render={() => <SearchPage getNextPageResult={this.getNextPageResult}
                                                                 currentQueryResult={currentQueryResult}
                                                                 queryResult={queryResult}
                                                                 requestPending={requestPending}
                                                                 getSpecificResult={this.getSpecificResult}
                                                                 currentRelease={currentRelease} x
                                                                 clearCurrentRelease={this.clearCurrentRelease}
                                                                 history={history}
                                                                 makeSearchRequest={this.makeSearchRequest}
                                                                 searchQueryString={searchQuery}
                                                                 searchQuery={this.searchQuery}/>}/>
                                <Route exact path={ROUTE_COLLECTION}
                                       render={() => <Collection getSpecificResult={this.getSpecificResult}
                                                                 history={history}
                                                                 requestPending={requestPending}
                                                                 collectionType={COLLECTION_TYPE_COLLECTION}
                                                                 clearCurrentRelease={this.clearCurrentRelease}
                                                                 currentRelease={currentRelease}
                                                                 setSpecificResult={this.setSpecificResult}
                                                                 data={vinylCollection}/>}/>
                                <Route path={`${ROUTE_COLLECTION}${ROUTE_RELEASE}`}
                                       render={() => <ReleaseFull openLightbox={this.openLightbox}
                                                                  closeLightbox={this.closeLightbox}
                                                                  openSnackbar={this.openSnackbar}
                                                                  isInCollection={true}
                                                                  getCollection={this.getCollection}
                                                                  toggleSellModal={this.toggleSellModal}
                                                                  history={history}
                                                                  release={currentRelease}/>}/>
                                <Route exact path={ROUTE_WISHLIST}
                                       render={() => <Collection getSpecificResult={this.getSpecificResult}
                                                                 history={history}
                                                                 requestPending={requestPending}
                                                                 collectionType={COLLECTION_TYPE_WISHLIST}
                                                                 currentRelease={currentRelease}
                                                                 clearCurrentRelease={this.clearCurrentRelease}
                                                                 setSpecificResult={this.setSpecificResult}
                                                                 data={wishlist}/>}/>
                                <Route path={`${ROUTE_WISHLIST}${ROUTE_RELEASE}`}
                                       render={() => <ReleaseFull openLightbox={this.openLightbox}
                                                                  closeLightbox={this.closeLightbox}
                                                                  getCollection={this.getCollection}
                                                                  openSnackbar={this.openSnackbar}
                                                                  isInWishlist={true}
                                                                  history={history}
                                                                  release={currentRelease}/>}/>
                                <Route exact path={ROUTE_FOR_SELL}
                                       render={() => <Collection getSpecificResult={this.getSpecificResult}
                                                                 history={history}
                                                                 requestPending={requestPending}
                                                                 collectionType={COLLECTION_TYPE_FOR_SELL}
                                                                 currentRelease={currentRelease}
                                                                 clearCurrentRelease={this.clearCurrentRelease}
                                                                 setSpecificResult={this.setSpecificResult}
                                                                 data={vinylCollection.filter(vinyl => {
                                                                     return vinyl.forSale
                                                                 })}/>}/>
                                <Route path={`${ROUTE_FOR_SELL}${ROUTE_RELEASE}`}
                                       render={() => <ReleaseFull openLightbox={this.openLightbox}
                                                                  closeLightbox={this.closeLightbox}
                                                                  openSnackbar={this.openSnackbar}
                                                                  isForSell={true}
                                                                  toggleSellModal={this.toggleSellModal}
                                                                  getCollection={this.getCollection}
                                                                  history={history}
                                                                  release={currentRelease}/>}/>
                                <Route exact path={ROUTE_MARKET}
                                       render={() => <Collection getSpecificResult={this.getSpecificResult}
                                                                 history={history}
                                                                 requestPending={requestPending}
                                                                 collectionType={COLLECTION_TYPE_MARKET}
                                                                 currentRelease={currentRelease}
                                                                 clearCurrentRelease={this.clearCurrentRelease}
                                                                 setSpecificResult={this.setSpecificResult}
                                                                 data={market}/>}/>
                                <Route path={`${ROUTE_MARKET}${ROUTE_RELEASE}`}
                                       render={() => <ReleaseFull openLightbox={this.openLightbox}
                                                                  closeLightbox={this.closeLightbox}
                                                                  openSnackbar={this.openSnackbar}
                                                                  isInMarket={true}
                                                                  history={history}
                                                                  getCollection={this.getCollection}
                                                                  release={currentRelease}/>}/>
                                <Route path={ROUTE_ACCOUNT}
                                       render={() => <Account openSnackbar={this.openSnackbar}/>}/>
                                <Route exact path="/404" render={() => null}/>
                                <Route exact path={`${ROUTE_USERS}`}
                                       render={() => <Users requestPending={requestPending}
                                                            users={users}
                                                            renderUser={this.renderUser}/>}/>
                                <Route exact path={`${ROUTE_USERS}/${currentUser && currentUser.username}`}
                                       render={() => <User  setSpecificResult={this.setSpecificResult} user={currentUser}/>}/>
                                <Route path={`${ROUTE_USERS}/${currentUser && currentUser.username}${ROUTE_RELEASE}`}
                                       render={() => <ReleaseFull openLightbox={this.openLightbox}
                                                                  closeLightbox={this.closeLightbox}
                                                                  openSnackbar={this.openSnackbar}
                                                                  history={history}
                                                                  isOtherUserCollection={true}
                                                                  getCollection={this.getCollection}
                                                                  release={currentRelease}/>}/>
                                <Redirect to="/404"/>
                            </Switch>
                            <Snackbar snackbarOptions={snackbarOptions} closeSnackbar={this.closeSnackbar}/>
                        </div>
                    </div>
                </Scrollbars>
            </div>
        );
    }
}

export default withRouter(App);
