import React, { Component } from "react";
import { Button, FormGroup, Input, Label } from "reactstrap";
import axios from 'axios';
import {RESPONSE_STATUS_SUCCESS} from "../constants";

class Account extends Component {
    constructor(props) {
        super(props);

        this.state = {
            oldPassword: '',
            newPassword: '',
            repeatPassword: '',
            oldPasswordError: '',
            newPasswordError: '',
            repeatPasswordError: ''
        };
    }

    // validateForm() {
    //     return this.state.oldPassword.length > 0 && this.state.newPassword.length > 0 && this.state.repeatPassword.length > 0;
    // }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = event => {
        event.preventDefault();

        const { oldPassword, newPassword, repeatPassword } = this.state;

        axios.post('/api/controllers/authentication/changePassword', { oldPassword, newPassword, repeatPassword })
            .then((res) => {
                // if (res.status === RESPONSE_STATUS_SUCCESS) {
                //     res.data.usernameError ? this.setState({usernameError: res.data.msg}) : this.setState({usernameError: ''});
                //     res.data.emailError ? this.setState({emailError: res.data.msg}) : this.setState({emailError: ''});

                //     if (res.data.success) {
                //         this.props.setToken(res.data.token);
                //     }
                // }
            });
    };

    render() {
        return (
            <div className="sign-up-wrapper authentication-wrapper">
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
                        <span className="error">{this.state.usernameError}</span>
                    </FormGroup>
                    <FormGroup className="new-password-form">
                        <Label for="newPassword">New Password</Label>
                        <Input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            onChange={this.handleChange}
                        />
                        <span className="error">{this.state.emailError}</span>
                    </FormGroup>
                    <FormGroup className="repeat-password-form">
                        <Label for="repeatPassword">Password</Label>
                        <Input
                            onChange={this.handleChange}
                            type="password"
                            name="repeatPassword"
                            id="repeatPassword"
                        />
                        <span className="error">{this.state.passwordError}</span>
                    </FormGroup>
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