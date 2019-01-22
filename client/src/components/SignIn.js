import React, { Component } from "react";
import { Button, FormGroup, Input, Label } from "reactstrap";
import axios from 'axios';
import {RESPONSE_STATUS_SUCCESS} from "../constants";


class SignIn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            email: '',
            password: '',
            serverError: ''
        };
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = event => {
        event.preventDefault();

        const { password, email } = this.state;

        axios.post('/api/controllers/authentication/login', { password, email })
            .then((res) => {
                if (res.status === RESPONSE_STATUS_SUCCESS) {
                    res.data.success ?  this.props.setToken(res.data.token, res.data.userId) : this.setState({serverError: res.data.msg});
                }
            });
    };

    render() {
        const {serverError} = this.state;

        return (
            <div className="sign-in-wrapper authentication-wrapper">
                <form className="sign-in-form" onSubmit={this.handleSubmit}>
                    <FormGroup className="email-form">
                        <Label for="email">Username or Email</Label>
                        <Input
                            type="text"
                            id="email"
                            name="email"
                            onChange={this.handleChange}
                        />
                        <span className="error">{this.state.emailError}</span>
                    </FormGroup>
                    <FormGroup className="password-form">
                        <Label for="password">Password</Label>
                        <Input
                            onChange={this.handleChange}
                            type="password"
                            name="password"
                            id="password"
                        />
                        <span className="error">{this.state.passwordError}</span>
                    </FormGroup>
                    <span className="error">{serverError}</span>
                    <Button
                        block
                        disabled={!this.validateForm()}
                        type="submit"
                    >
                        Login
                    </Button>
                </form>
            </div>
        );
    }
}

export default SignIn;