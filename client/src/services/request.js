import axios from 'axios';

import {
    API_URL,
    REDIRECT_DEFAULT_ROUTE,
    ERROR_CODES_THAT_REQUIRE_LOGIN,
    ERROR_SUBCODE_TOO_MANY_USERS
} from '../constants/constants';
import {
    AUTH_DELETE_TOKEN,
    REDIRECT_TO_TOO_MANY_USERS,
    USER_REMOVE_DETAILS,
    VIDEO_RESET
} from '../constants/action-types';
import {
    getTokenObject,
    deleteTokenObject,
    hasSpecificServerError,
    hasTokenObject,
    setTokenObject,
    deleteOrderObject
} from './helpers';

/**
 * Create an axios 'client' with default
 * 'baseUrl' and 'token' properties.
 * The client is imported in index.js where
 * after the store is created the 'dispatch' method
 * is referenced on the 'client' as client.__dispatch.
 * This gives the option to dispatch actions on
 * specific responses like specific errors.
 */
export const client = axios.create({ baseURL: API_URL });

/**
 * Success handler.
 * @param response {Object}
 * @returns {Promise<any>}
 */
const onSuccess = response => {
    if (hasTokenObject(response)) {
        setTokenObject(response.data.data);
    }

    return Promise.resolve(response.data);
};

/**
 * Error handler.
 * Can dispatch actions on specific error codes.
 * @param error {Object}
 * @returns {Promise<any>}
 */
const onError = error => {
    let payload = error;

    if (hasSpecificServerError(error)) {
        payload = error.response.data;
        const { subcode } = payload;
        // Here an action is triggered for the different
        // groups of errors that require specific behaviour
        // that influences the app on a global level.
        // For the local usages (showing a specific error in a form)
        // the error gets propagated and returned as promise
        // here and later in the action creator, providing in such
        // manner the possibility to 'await' it locally in the
        // component that has triggered the action in first place.
        if (ERROR_CODES_THAT_REQUIRE_LOGIN.includes(subcode)) {
            deleteTokenObject();
            deleteOrderObject();
            // The deletion of the token will automatically
            // trigger the 'protect' guard (see 'protect.jsx')
            // and a redirect to '/login' if the user is
            // currently on a protected route.
            client.__dispatch({
                type: AUTH_DELETE_TOKEN,
                payload: {
                    // depending on the errors a specific
                    // redirect route can be set.
                    redirect: REDIRECT_DEFAULT_ROUTE
                }
            });
            // Reset the current video to
            // to its initial state.
            client.__dispatch({
                type: VIDEO_RESET,
                payload: null
            });

            // Reset user details
            // to its initial state.
            client.__dispatch({
                type: USER_REMOVE_DETAILS,
                payload: {}
            });
        } else if (subcode === ERROR_SUBCODE_TOO_MANY_USERS) {
            // Send a new object in order to
            // update reference instead of using flags.
            // The redirect will happen in the App component
            // When the corresponding reference changes.
            client.__dispatch({
                type: REDIRECT_TO_TOO_MANY_USERS,
                payload: {}
            });
        }
    }

    return Promise.reject(payload);
};

/**
 * Request wrapper with default success/error handlers.
 * @param options {Object} - defines the method, the url, the data etc.
 */
export default options => {
    // Dynamically set the token from the local storage.
    let token = '';
    const tokenObjectFromLocalStorage = getTokenObject();
    if (tokenObjectFromLocalStorage && tokenObjectFromLocalStorage.access_token) {
        token = tokenObjectFromLocalStorage.access_token;
    }
    // Merge with existing headers if provided or set them
    // if not provided.
    if (options.headers) {
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`
        }
    } else {
        options.headers = {
            Authorization: `Bearer ${token}`
        }
    }

    return client(options)
        .then(onSuccess)
        .catch(onError);
};