export const DISCOGS_KEY = 'cfOBbgcDnKsgBpZNTKcJ';
export const DISCOGS_SECRET = 'hGaihMdEjmpHyshTjxGssDtnwFiYCXEo';

export const DEBOUNCE_TIME = 1000;
export const DATA_TYPE_RELEASE = 'release';
export const DATA_TYPE_MASTER = 'master';
export const DATA_TYPE_LABEL = 'label';
export const DATA_TYPE_ARTIST = 'artist';

export const COLLECTION_TYPE_COLLECTION = 'vinylCollection';
export const COLLECTION_TYPE_WISHLIST = 'wishlist';
export const COLLECTION_TYPE_FOR_SELL = 'forSale';
export const COLLECTION_TYPE_MARKET = 'market';

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
export const ROUTE_ACCOUNT = '/account';
export const ROUTE_FOR_SELL = '/sell';
export const ROUTE_MARKET = '/market';

//COMMON
export const PAGINATION_WIDTH = 215;
export const PAGINATION_PAGES_PER_SLIDE = 4;

//SNACKBAR TYPES
export const SNACKBAR_TYPE_SUCCESS = 'success';
export const SNACKBAR_TYPE_FAIL = 'fail';
export const SNACKBAR_CLOSE_TIMEOUT = 5000;
export const TOOLTIP_DELAY_SHOW = 700;

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

//VINYL CONDITION - MEDIA
export const condition = {
    mint: 'Mint (M)',
    mTooltip: `Absolutely perfect in every way. Certainly never been played, possibly even still sealed. 
                    Should be used sparingly as a grade, if at all.`,
    nearMind: 'Near Mint (NM or M-)',
    nmTooltip: `A nearly perfect record. A NM- record has more than likely never been played,
                 and the vinyl will play perfectly, with no imperfections during playback. 
                 Many dealers won't give a grade higher than this implying (perhaps correctly) that no record is ever truly perfect.
                  The record should show no obvious signs of wear. A 45 RPM or EP sleeve should have no more than the most minor defects,
                   such as any sign of slight handling. An LP cover should have no creases, folds, seam splits, cut-out holes,
                    or other noticeable similar defects. The same should be true of any other inserts, such as posters, 
                    lyric sleeves, etc.`,
    vgPlus: 'Very Good Plus (VG+)',
    vgPlusTooltip: `A nearly perfect record. A NM- record has more than likely never been played, and the vinyl will play
                 perfectly, with no imperfections during playback. Many dealers won't give a grade higher than this implying (perhaps correctly) 
                 that no record is ever truly perfect. The record should show no obvious signs of wear. A 45 RPM or EP sleeve should have no more than the most
                  minor defects, such as any sign of slight handling. An LP cover should have no creases,
                 folds, seam splits, cut-out holes, or other noticeable similar defects. The same should be true of any other inserts, 
                 such as posters, lyric sleeves, etc.  `

//TO DO finish this
};

//GENRES
export const GENRES = {
    blues: 'Blues',
    brass_military: 'Brass & Military',
    children: "Children's",
    classical: 'Classical',
    electronic: 'Electronic',
    funl_country_world: 'Folk, World, & Country',
    funk_soul: 'Funk / Soul',
    hip_hop: 'Hip-Hop',
    jazz: 'Jazz',
    latin: 'Latin',
    non_music: 'Non-Music',
    pop: 'Pop',
    reggae: 'Reggae',
    rock: 'Rock',
    stage: 'Stage & Screen'
};
