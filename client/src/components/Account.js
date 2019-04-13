import React, { Component } from "react";
import { Button, DropdownItem, FormGroup, Input, Label } from "reactstrap";
import axios from 'axios';
import DropdownComponent from '../components/common/Dropdown';

import {
    GENRES,
    RESPONSE_STATUS_SUCCESS,
    SNACKBAR_TYPE_FAIL,
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
            favoriteStyles: []
        };
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


    setSelectedStyle = (style) => {
        console.log(style, this.state.favoriteStyles);
        this.setState({ favoriteStyles: [] });

    };

    render() {
        let allStyles = [];
        Object.values(GENRES).forEach(genre => {
            if (genre.styles) {
                allStyles = allStyles.concat(genre.styles);
            }
        });

        let styleDropdownOptions = null;
        const dedupedStyles = [...new Set(allStyles)].sort();

        styleDropdownOptions = dedupedStyles.map(style =>
            <DropdownItem onClick={() => this.setSelectedStyle(style)}
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
                            <Label for="repeatPassword">Password</Label>
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
                                selected={favoriteStyles}/>
            </div>
        );
    }
}

export default Account;