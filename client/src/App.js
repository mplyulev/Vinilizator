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
import Collection from './components/Collection';
import ReleaseFull from './components/ReleaseFull';
import Account from './components/Account';
import SellModal from './components/SellModal';
import ArtistFull from './components/ArtistFull';
import Snackbar from './components/common/Snackbar';


import {
    COLLECTION_TYPE_COLLECTION,
    COLLECTION_TYPE_WISHLIST,
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
    ROUTE_RELEASE,
    ROUTE_SEARCH,
    ROUTE_SIGN_IN,
    ROUTE_SIGN_UP,
    ROUTE_WISHLIST,
    ROUTE_ACCOUNT,
    ROUTE_SELL,
    ROUTE_FOR_SELL,
    COLLECTION_TYPE_FOR_SELL,
    ROUTE_MARKET,
    COLLECTION_TYPE_MARKET,
    SNACKBAR_TYPE_SUCCESS, SNACKBAR_TYPE_FAIL
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
            isLightboxOpened: false,
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
            isSellModalOpened: false
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
    addToSellList = (release) => {
        const userId = localStorage.getItem('userId');
        axios.post('/api/controllers/collection/addToSellList', { release, userId })
            .then((res) => {
                if (res.status === RESPONSE_STATUS_SUCCESS) {
                    this.openSnackbar(res.data.success ? SNACKBAR_TYPE_SUCCESS : SNACKBAR_TYPE_FAIL, res.data.msg);
                    this.toggleSellModal();
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

    getNextPageResult = (page, type) => {
        this.setState({requestPending: true});
        const {searchQuery} = this.state;

        axios.get(`${DOGS_SEARCH_URL}?q=${searchQuery}&type=${DATA_TYPE_RELEASE}&format=Vinyl&page=${page}&key=${DISCOGS_KEY}&secret=${DISCOGS_SECRET}`)
            .then(response => {
                console.log('nectPage', response.data);
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
        if (!navbar.contains(event.target)) {
            this.toggleNavBar(true);
        }
    };

    componentDidMount() {
        document.addEventListener('click', this.closeOnOutsideClick);
        const {token} = this.state;
        const { location } = this.props;

        if (!token && location.pathname !== ROUTE_SIGN_UP && location.pathname !== ROUTE_SIGN_IN) {
            this.setState({lastRequestedRoute: this.props.location.pathname});
            this.props.history.push(ROUTE_SIGN_IN);
        }

        if (location.pathname === ROUTE_COLLECTION || location.pathname === ROUTE_WISHLIST || location.pathname === ROUTE_FOR_SELL) {
            let collectionType = '';
            switch (location.pathname) {
                case ROUTE_COLLECTION:
                    collectionType = COLLECTION_TYPE_COLLECTION;
                    break;
                case ROUTE_WISHLIST:
                    collectionType = COLLECTION_TYPE_WISHLIST;
                    break;
                case ROUTE_FOR_SELL:
                    collectionType = COLLECTION_TYPE_FOR_SELL;
                    break;
            }
            this.getCollection(collectionType);
        }

        if (location.pathname === ROUTE_MARKET) {
            this.getMarket();
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

    getMarket = () => {
        axios.get('/api/controllers/collection/getMarket')
            .then((res) => {
                if (res.status === RESPONSE_STATUS_SUCCESS) {
                    this.setState({
                        market: res.data.collection
                    });
                }
            });
    };

    setSpecificResult = (release, collectionType) => {
        this.clearCurrentRelease();
        this.setState({ currentRelease: release }, () => {
            this.releaseAnimationTimeout = setTimeout(() => {
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

    getCollection = (collectionType) => {
        axios.get('/api/controllers/collection/getCollection', {
            params: {
                collectionType,
                userId: localStorage.getItem('userId')
            }
        })
            .then((res) => {
                if (res.status === RESPONSE_STATUS_SUCCESS) {
                    this.setState({
                        vinylCollection: collectionType === COLLECTION_TYPE_COLLECTION ? res.data.collection : [],
                        wishlist: collectionType === COLLECTION_TYPE_WISHLIST ? res.data.collection : [],
                        forSale: collectionType === COLLECTION_TYPE_FOR_SELL ? res.data.collection : [],
                        market: collectionType === COLLECTION_TYPE_MARKET ? res.data.collection : []
                    });
                }
            });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const prevPath = prevProps.location.pathname;
        const nextPath = this.props.location.pathname;
        if ((nextPath === ROUTE_COLLECTION || nextPath === ROUTE_WISHLIST || nextPath === ROUTE_FOR_SELL) && nextPath !== prevPath) {
            let collectionType = '';

            switch (nextPath) {
                case ROUTE_COLLECTION:
                    collectionType = COLLECTION_TYPE_COLLECTION;
                    break;
                case ROUTE_WISHLIST:
                    collectionType = COLLECTION_TYPE_WISHLIST;
                    break;
                case ROUTE_FOR_SELL:
                    collectionType = COLLECTION_TYPE_FOR_SELL;
            }

            this.getCollection(collectionType);
        }

        if (nextPath === ROUTE_MARKET && prevPath !== nextPath) {
            this.getMarket();
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
            forSale,
            market,
            isNavBarOpened,
            isSellModalOpened
        } = this.state;

        const { location, history } = this.props;
        const isOnAuthRoute = location.pathname === ROUTE_SIGN_IN || location.pathname === ROUTE_SIGN_UP;
        return (
            <AppContext.Provider props={{
                state: this.state,
                searchQuery: this.searchQuery
            }}>
                <div className="mega-wrapper">
                    {isSellModalOpened  && <SellModal toggleSellModal={this.toggleSellModal}
                                                      addToSellList={this.addToSellList}
                                                      currentRelease={currentRelease}
                                                      isSellModalOpened={isSellModalOpened}/>}
                    <AppNavBar isNavBarOpened={isNavBarOpened}
                               isVisible={location.pathname !== ROUTE_SIGN_UP && location.pathname !== ROUTE_SIGN_IN}
                               toggleNavBar={this.toggleNavBar}
                               logout={this.logout} />
                    <div className={`router-container${isOnAuthRoute ? ' auth' : ''}${isNavBarOpened ? ' opened-navbar' : ''}`}>
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
                                                              toggleSellModal={this.toggleSellModal}
                                                              history={history}
                                                              release={currentRelease} />}/>
                            <Route exact path={ROUTE_WISHLIST}
                                   render={() => <Collection getSpecificResult={this.getSpecificResult}
                                                          history={history}
                                                          collectionType={COLLECTION_TYPE_WISHLIST}
                                                          currentRelease={currentRelease}
                                                          clearCurrentRelease={this.clearCurrentRelease}
                                                          setSpecificResult={this.setSpecificResult}
                                                          data={wishlist}/>}/>
                            <Route path={`${ROUTE_WISHLIST}${ROUTE_RELEASE}`}
                                   render={() => <ReleaseFull openLightbox={this.openLightbox}
                                                              closeLightbox={this.closeLightbox}
                                                              openSnackbar={this.openSnackbar}
                                                              isInWishlist={true}
                                                              history={history}
                                                              release={currentRelease} />}/>
                            <Route exact path={ROUTE_FOR_SELL}
                                   render={() => <Collection getSpecificResult={this.getSpecificResult}
                                                             history={history}
                                                             collectionType={COLLECTION_TYPE_FOR_SELL}
                                                             currentRelease={currentRelease}
                                                             clearCurrentRelease={this.clearCurrentRelease}
                                                             setSpecificResult={this.setSpecificResult}
                                                             data={forSale}/>}/>
                            <Route path={`${ROUTE_FOR_SELL}${ROUTE_RELEASE}`}
                                   render={() => <ReleaseFull openLightbox={this.openLightbox}
                                                              closeLightbox={this.closeLightbox}
                                                              openSnackbar={this.openSnackbar}
                                                              isForSell={true}
                                                              history={history}
                                                              release={currentRelease} />}/>
                            <Route exact path={ROUTE_MARKET}
                                   render={() => <Collection getSpecificResult={this.getSpecificResult}
                                                             history={history}
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
                                                              release={currentRelease} />}/>
                            <Route path={ROUTE_ACCOUNT}
                                   render={() => <Account openSnackbar={this.openSnackbar}/>}/>
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
