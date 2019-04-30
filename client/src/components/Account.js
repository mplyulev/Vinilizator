import React, { Component } from "react";
import { Button, DropdownItem, FormGroup, Input, Label } from "reactstrap";
import axios from 'axios';
import DropdownComponent from '../components/common/Dropdown';

import {
    GENRES,
    RESPONSE_STATUS_SUCCESS,
    SNACKBAR_TYPE_SUCCESS,
} from "../constants";

class Account extends Component {
    constructor(props) {
        super(props);

        this.state = {
            oldPassword: '',
            newPassword: '',
            repeatPassword: '',
            oldPasswordError: '',
            repeatPasswordError: '',
            serverError: '',
            isFormOpened: false,
            favoriteStyles: [],
            userTracks: null,
            youtubeSrc: ''
        };

        this.timeout = null;
        this.favoritesWrapper = React.createRef();
    }

    componentDidMount() {
        axios.get('/api/controllers/accountSettings/getFavoriteStyles', {
        params: {
            userId: localStorage.getItem('userId')}
        }).then((res) => {
            this.setState({ favoriteStyles: res.data.favoriteStyles}, () => {
                const childNodesArray = Array.from(this.favoritesWrapper.current.childNodes);
                childNodesArray.map(child => child.classList.add('visible'));
            });
        });

        this.props.vinylCollection.map(vinyl => console.log(vinyl.tracklist));

        // const youtubeSrc = `https://www.youtube.com/embed?listType=search&list=${release.tracklist[0] && release.tracklist[0].artists ? release.tracklist[0].artists[0].name : release.artists[0].name}+${release.tracklist[0].title}`

        window.addEventListener('beforeunload', this.saveFavorites);
    }

    validateForm() {
        return this.state.oldPassword.length > 0 && this.state.newPassword.length > 0 && this.state.repeatPassword.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value,
            [`${event.target.id}Error`]: ''
        });
    };

    onSuccess = (msg) => {
        this.props.openSnackbar(SNACKBAR_TYPE_SUCCESS, msg);
        this.setState({isFormOpened: false});
    };

    handleSubmit = event => {
        event.preventDefault();

        const { oldPassword, newPassword, repeatPassword } = this.state;

        if (newPassword !== repeatPassword) {
            console.log(newPassword, repeatPassword);
            this.setState({ repeatPasswordError: "The passwords don't match" });
            return;
        }

        axios.post('/api/controllers/authentication/changePassword', { oldPassword, newPassword, repeatPassword, userId: localStorage.getItem('userId') })
            .then((res) => {
                if (res.status === RESPONSE_STATUS_SUCCESS) {

                    res.data.success
                        ? this.onSuccess(res.data.msg)
                        : this.setState({oldPasswordError: res.data.msg});
                } else {
                    this.setState({ serverError: res.data.msg });
                }
            });
    };

    componentWillUnmount() {
        this.saveFavorites();
        window.removeEventListener('beforeunload', this.saveFavorites); // remove the event handler for normal unmounting
    }


    saveFavorites = () => {
        const { favoriteStyles } = this.state;
        axios.post('/api/controllers/accountSettings/saveFavorites', {
            favoriteStyles,
            userId: localStorage.getItem('userId')
        });
    };


    toggleStyle = (style, isRemoving, event) => {

        let favoriteStyles = [...this.state.favoriteStyles];
        clearTimeout(this.timeout);
        if (isRemoving) {
            const styleIndex = favoriteStyles.indexOf(style);
            event.target.classList.remove("visible", "selected");
            this.favoritesWrapper.current.childNodes[styleIndex].classList.remove('visible');

            this.timeout = setTimeout(() => {
                favoriteStyles.splice(styleIndex, 1);
                this.setState({ favoriteStyles });
            },100);
        } else {
            favoriteStyles.push(style);

            this.setState({ favoriteStyles } );
            this.timeout = setTimeout(() => {
                this.lastStyle && this.lastStyle.classList.add('visible')
            }, 0)
        }
    };



    render() {
        let allStyles = [];
        Object.values(GENRES).forEach(genre => {
            if (genre.styles) {
                allStyles = allStyles.concat(genre.styles);
            }
        });
        console.log(this.state.favoriteStyles);

        const dedupedStyles = [...new Set(allStyles)].sort();

        const styleDropdownOptions = dedupedStyles.map(style =>
            <DropdownItem onClick={(event) => this.toggleStyle(style, this.state.favoriteStyles.includes(style) ? true : false, event)}
                          className={this.state.favoriteStyles.includes(style) ? 'selected' : ''}
                          key={style}
                          toggle={false}
                          value={style}>
                {style}
            </DropdownItem>
        );

        const { oldPasswordError, repeatPasswordError, serverError, isFormOpened, favoriteStyles } = this.state;

        return (
            <div className={'account-wrapper'}>
                <div className={`sign-up-wrapper change-password-wrapper${isFormOpened ? ' opened' : ''}`}>
                    <form className={`sign-up-form${isFormOpened ? ' opened' : ''}`}>
                        <FormGroup className="change-password-form">
                            <Label for="oldPassword">Old Password</Label>
                            <Input
                                autoFocus
                                type="password"
                                id="oldPassword"
                                name="oldPassword"
                                onChange={this.handleChange}
                            />
                            <span className="error">{oldPasswordError}</span>
                        </FormGroup>
                        <div class="pretty p-default">
                            <input type="checkbox" />
                            <div class="state">
                                <label>Check</label>
                            </div>
                        </div>
                        <FormGroup className="new-password-form">
                            <Label for="newPassword">New Password</Label>
                            <Input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup className="repeat-password-form">
                            <Label for="repeatPassword">Repeat New Password</Label>
                            <Input
                                onChange={this.handleChange}
                                type="password"
                                name="repeatPassword"
                                id="repeatPassword"
                            />
                            <span className="error">{repeatPasswordError}</span>
                        </FormGroup>
                        <span className="error">{serverError}</span>
                        <Button
                            block
                            onClick={() => this.setState({ isFormOpened: false })}
                        >
                            Cancel
                        </Button>
                    </form>
                    <Button
                        block
                        disabled={isFormOpened ? !this.validateForm() : false}
                        onClick={isFormOpened ? this.handleSubmit : () => this.setState({ isFormOpened: true })}
                    >
                        Change Password
                    </Button>
                </div>
                <DropdownComponent items={styleDropdownOptions}
                                   dropdownTitle='Choose favorite styles'
                                   showSelected={false}
                                   selected={favoriteStyles} />
                <div className={`favorite-styles-wrapper ${favoriteStyles.length > 0 ? 'visible' : ''}`}
                     ref={this.favoritesWrapper}>
                    {favoriteStyles.map((style, index) => <span
                        ref={index === favoriteStyles.length - 1 ? (node) => this.lastStyle = node : null}
                        key={style}
                        onClick={(event) => this.toggleStyle(style, true, event)}>{style}</span>)}
                </div>
                <div className="checkbox-wrapper">
                    <div className="pretty  p-round p-fill  checkbox">
                        <input type="checkbox" />
                        <div className="state  p-success">
                            <label>Don't show releases marked for sale in my collection</label>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default Account;