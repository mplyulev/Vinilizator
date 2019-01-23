import React, { Component } from "react";
import { Button, FormGroup, Input, Label } from "reactstrap";
import axios from 'axios';
import { RESPONSE_STATUS_SUCCESS, SNACKBAR_TYPE_FAIL, SNACKBAR_TYPE_SUCCESS } from "../constants";

class Account extends Component {
    constructor(props) {
        super(props);

        this.state = {
            oldPassword: '',
            newPassword: '',
            repeatPassword: '',
            oldPasswordError: '',
            repeatPasswordError: '',
            serverError: ''
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
                        ? this.props.openSnackbar(SNACKBAR_TYPE_SUCCESS, res.data.msg)
                        : this.setState({ oldPasswordError: res.data.msg });
                } else {
                    this.setState({ serverError: res.data.msg });
                }
            });
    };

    render() {
        const { oldPasswordError, repeatPasswordError, serverError } = this.state;

        return (
            <div className="sign-up-wrapper change-password-wrapper">
                <form className="sign-up-form" onSubmit={this.handleSubmit}>
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
                        disabled={!this.validateForm()}
                        type="submit"
                    >
                        Change Password
                    </Button>
                </form>
            </div>
        );
    }
}

export default Account;