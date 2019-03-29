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
            collectionType: '',
            forSale: [],
            market: [],
            isNavBarOpened: false,
            isSellModalOpened: false,
            currentUser: null,
            isSearchItemInCollection: false,
            isSearchItemInWishlist: false,
            isSearchItemForSale: false,
            userInfo: null,
            genre: '',
            style: ''
        };

        this.getCollection = this.getCollection.bind(this);
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
        axios.post('/api/controllers/collection/addToCollection', {release, userId}).then(() => {
            axios.post('/api/controllers/collection/addToSellList', { release, userId, sellData, isEditing })
                .then((res) => {
                    if (res.status === RESPONSE_STATUS_SUCCESS) {

                        axios.post('/api/controllers/collection/removeFromWishlist', {release, userId});
                        this.getCollection(this.props.location.pathname === `${ROUTE_RELEASE}/${release.id}` ? true : false, true, release.id).then(() => {
                            this.openSnackbar(res.data.success ? SNACKBAR_TYPE_SUCCESS : SNACKBAR_TYPE_FAIL, res.data.msg);
                        });
                    }
                });
        });
    };

    toggleSellModal = () => {
        this.setState({
            isSellModalOpened: !this.state.isSellModalOpened
        });
    };

    searchQuery = (value, genre, style) => {
        if (value.length > 0) {
            this.setState({
                searchQuery: value,
                genre,
                style
            });
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

    makeSearchRequest = (searchQuery, genre, style) => {
        console.log('asd', style, genre)
        this.setState({requestPending: true});
        axios.get(`${DOGS_SEARCH_URL}?q=${searchQuery}&type=${DATA_TYPE_RELEASE}${genre && `&genre=${genre}`}${style ? `&style=${style}` : ''}&format=Vinyl&key=${DISCOGS_KEY}&secret=${DISCOGS_SECRET}`)
            .then(response => {
                this.setState({ queryResult: response.data });
                this.setState({ requestPending: false });
            })
            .catch(error => {
                this.setState({ requestPending: false });
            });
    };

    getNextPageResult = (page, genre, style) => {
        this.setState({requestPending: true});
        const {searchQuery} = this.state;

        axios.get(`${DOGS_SEARCH_URL}?q=${searchQuery}&type=${DATA_TYPE_RELEASE}${genre && `&genre=${genre}`}${style && `&style=${style}`}&format=Vinyl&page=${page}&key=${DISCOGS_KEY}&secret=${DISCOGS_SECRET}`)
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
        if (token) {
            this.getCollection();
        }

        let pathname = location.pathname;

        if (pathname[pathname.length - 1] === '/') {
            pathname = pathname.substring(0, pathname.length - 1)
        }

        switch (pathname) {
            case ROUTE_COLLECTION || ROUTE_WISHLIST || ROUTE_FOR_SELL:
                this.getCollection();
                break;
            case ROUTE_MARKET:
                this.getMarket();
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

    getSpecificUser = (userId) => {
        console.log('asd', userId);
        this.setState({requestPending: true});
        axios.get('/api/controllers/collection/getUser',  {params: {
            userId
        }}).then((res) => {
                this.setState({requestPending: false});
                if (res.status === RESPONSE_STATUS_SUCCESS) {
                    this.setState({
                        currentUser: res.data.user
                    }, () => {
                        this.props.history.push(`${ROUTE_USERS}/${this.state.currentUser.username}`);
                    });
                }
            });
    };

    setSpecificResult = (release, collectionType, isOtherUserCollection) => {
        this.clearCurrentRelease();

        const { currentUser } = this.state;

        this.setState({ currentRelease: release }, () => {
            this.releaseAnimationTimeout = setTimeout(() => {
                if (isOtherUserCollection) {
                    this.props.history.push(`${ROUTE_USERS}/${currentUser && currentUser.username}${ROUTE_COLLECTION}${ROUTE_RELEASE}/${release.id}`);
                    return
                }
                this.setState({collectionType: collectionType});
                switch (collectionType) {
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

    setReleaseStatus = (release, vinylCollection, wishlist) => {
        this.setState({
            isSearchItemInCollection: false,
            isSearchItemForSale: false,
            isSearchItemInWishlist: false
        });
        console.log('settigns')
        vinylCollection.map(vinyl => {
            if (vinyl.id === release.id) {
                this.setState({isSearchItemInCollection: true});

                if (vinyl.forSale) {
                    this.setState({isSearchItemForSale: true});
                }
            }
        });


        wishlist.map(vinyl => {
            if (vinyl.id === release.id) {
                this.setState({isSearchItemInWishlist: true})
            }
        });
    };

    async getSpecificResult(type, id) {
        this.clearCurrentRelease();
        clearTimeout(this.releaseAnimationTimeout);
        axios.get(`${DOGS_GET_ITEM_URL[type]}/${id}?key=${DISCOGS_KEY}&secret=${DISCOGS_SECRET}`)
            .then(response => {
                this.setState({currentRelease: response.data}, () => {
                    this.releaseAnimationTimeout = setTimeout(() => {
                        console.log('asd', response.data, this.state.vinylCollection)
                        this.setReleaseStatus(response.data, this.state.vinylCollection, this.state.wishlist);
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

    async getCollection (shouldResetReleaseStatus, shouldResetCurrentRelease, currentReleaseId) {
        this.setState({requestPending: true});
        axios.get('/api/controllers/collection/getCollection', {
            params: {
                userId: localStorage.getItem('userId')
            }
        }).then((res) => {
            if (res.status === RESPONSE_STATUS_SUCCESS) {
                this.setState({
                    vinylCollection: res.data.collection.vinylCollection || [],
                    wishlist: res.data.collection.wishlist || []
                }, () => {
                    if (shouldResetReleaseStatus) {
                        this.setReleaseStatus(this.state.currentRelease, this.state.vinylCollection, this.state.wishlist);
                    }
                });

                if (shouldResetCurrentRelease) {
                    this.resetSpecificResult(res.data.collection.vinylCollection, currentReleaseId);
                }
            }

            this.setState({ requestPending: false });
        });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const prevPath = prevProps.location.pathname;
        const nextPath = this.props.location.pathname;

        if (nextPath !== prevPath) {
            if (nextPath === ROUTE_SEARCH && prevPath !== ROUTE_RELEASE) {
                this.setState({searchQuery: ''});
            }

            if (nextPath === ROUTE_COLLECTION
                || nextPath === ROUTE_WISHLIST
                || nextPath === ROUTE_FOR_SELL
                || nextPath === ROUTE_SEARCH
                || nextPath === ROUTE_MARKET
                || nextPath === ROUTE_USERS) {
                this.setState({requestPending: false});
                switch (nextPath) {
                    case ROUTE_COLLECTION || ROUTE_FOR_SELL || ROUTE_WISHLIST:
                        this.getCollection();
                        break;
                    case ROUTE_MARKET:
                        this.getMarket();
                        break;
                    case ROUTE_USERS:
                        this.getUsers();
                        break;
                    case ROUTE_SEARCH:
                        this.makeSearchRequest(this.state.searchQuery || '');
                }
            }
        }

        const { searchQuery, token, lastRequestedRoute, genre } = this.state;
        if (prevState.token !== token && lastRequestedRoute !== ROUTE_SIGN_IN) {
            this.props.history.push(lastRequestedRoute || ROUTE_HOME);
            this.getCollection();
        }

        if (prevState.searchQuery !== searchQuery) {
            this.makeSearchRequest(searchQuery, this.state.genre, this.state.style);
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
            currentUser,
            collectionType,
            isSearchItemInCollection,
            isSearchItemForSale,
            isSearchItemInWishlist
        } = this.state;

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
                                                                  isSearchItemInCollection={isSearchItemInCollection}
                                                                  isSearchItemForSale={isSearchItemForSale}
                                                                  isSearchItemInWishlist={isSearchItemInWishlist}
                                                                  release={currentRelease}/>}/>
                                <Route exact path={ROUTE_SEARCH}
                                       render={() => <SearchPage getNextPageResult={this.getNextPageResult}
                                                                 currentQueryResult={currentQueryResult}
                                                                 queryResult={queryResult}
                                                                 requestPending={requestPending}
                                                                 getSpecificResult={this.getSpecificResult}
                                                                 currentRelease={currentRelease}
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
                                                                 getSpecificUser={this.getSpecificUser}
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
                                                                 getSpecificUser={this.getSpecificUser}
                                                                 clearCurrentRelease={this.clearCurrentRelease}
                                                                 setSpecificResult={this.setSpecificResult}
                                                                 data={market}/>}/>
                                <Route path={`${ROUTE_MARKET}${ROUTE_RELEASE}`}
                                       render={() => <ReleaseFull openLightbox={this.openLightbox}
                                                                  closeLightbox={this.closeLightbox}
                                                                  openSnackbar={this.openSnackbar}
                                                                  isInMarket={true}
                                                                  getSpecificUser={this.getSpecificUser}
                                                                  history={history}
                                                                  getCollection={this.getCollection}
                                                                  release={currentRelease}/>}/>
                                <Route path={ROUTE_ACCOUNT}
                                       render={() => <Account openSnackbar={this.openSnackbar}/>}/>
                                <Route exact path="/404" render={() => null}/>
                                <Route exact path={`${ROUTE_USERS}`}
                                       render={() => <Users requestPending={requestPending}
                                                            getSpecificUser={this.getSpecificUser}
                                                            users={users} />}/>
                                <Route exact path={`${ROUTE_USERS}/${currentUser && currentUser.username}`}
                                       render={() => <User  setSpecificResult={this.setSpecificResult} user={currentUser}/>}/>
                                <Route path={`${ROUTE_USERS}/${currentUser && currentUser.username}${ROUTE_COLLECTION}${ROUTE_RELEASE}`}
                                       render={() => <ReleaseFull openLightbox={this.openLightbox}
                                                                  closeLightbox={this.closeLightbox}
                                                                  openSnackbar={this.openSnackbar}
                                                                  history={history}
                                                                  collectionType={collectionType}
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
