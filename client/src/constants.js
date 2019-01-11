export const DISCOGS_KEY = 'cfOBbgcDnKsgBpZNTKcJ';
export const DISCOGS_SECRET = 'hGaihMdEjmpHyshTjxGssDtnwFiYCXEo';

export const DEBOUNCE_TIME = 1000;
export const DATA_TYPE_RELEASE = 'release';
export const DATA_TYPE_MASTER = 'master';
export const DATA_TYPE_LABEL = 'label';
export const DATA_TYPE_ARTIST = 'artist';

export const COLLECTION_TYPE_COLLECTION = 'collection';
export const COLLECTION_TYPE_WISHLIST = 'wishlist';

//ROUTES

export const ROUTE_HOME = '/';
export const ROUTE_SIGN_UP = '/register';
export const ROUTE_SIGN_IN = '/login';
export const ROUTE_SEARCH = '/search';
export const ROUTE_COLLECTION = '/collection';
export const ROUTE_WISHLIST = '/wishlist';
export const ROUTE_RELEASE = '/release';
export const ROUTE_MASTER = '/master';
export const ROUTE_LABEL = '/label';
export const ROUTE_ARTIST = '/artist';

//COMMON
export const PAGINATION_WIDTH = 324;
export const PAGINATION_PAGES_PER_SLIDE = 6;

//SNACKBAR TYPES
export const SNACKBAR_TYPE_SUCCESS = 'success';
export const SNACKBAR_TYPE_FAIL = 'fail';
export const SNACKBAR_CLOSE_TIMEOUT = 5000;

//URLS
export const DOGS_SEARCH_URL = 'https://api.discogs.com/database/search';
export const DOGS_SPACE_GIF_URL = 'https://img.discogs.com/images/spacer.gif';
export const DOGS_BASE_URL = 'https://api.discogs.com/';
export const DOGS_GET_ITEM_URL = {
    release: `${DOGS_BASE_URL}releases/`,
    master: `${DOGS_BASE_URL}masters/`,
    label: `${DOGS_BASE_URL}labels/`,
    artist: `${DOGS_BASE_URL}artists/`
};

// RESPONSE CODES
export const RESPONSE_STATUS_SUCCESS = 200;