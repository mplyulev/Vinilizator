import React, { Component } from "react";
import { Button, FormGroup, Input, Label } from "reactstrap";
import axios from 'axios';
import {RESPONSE_STATUS_SUCCESS} from "../constants";

class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            email: '',
            password: '',
            emailError: '',
            passwordError: '',
            usernameError: ''
        };
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0 && this.state.username.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = event => {
        event.preventDefault();

        const { username, password, email } = this.state;

        axios.post('/api/controllers/authentication/register', { username, password, email })
            .then((res) => {
                if (res.status === RESPONSE_STATUS_SUCCESS) {
                    res.data.usernameError ? this.setState({usernameError: res.data.msg}) : this.setState({usernameError: ''});
                    res.data.emailError ? this.setState({emailError: res.data.msg}) : this.setState({emailError: ''});

                    if (res.data.success) {
                        this.props.setToken(res.data.token);
                    }
                }
            });
    };

    render() {
        return (
            <div className="sign-up-wrapper authentication-wrapper">
                <form className="sign-up-form" onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Input
                            autoFocus
                            type="text"
                            id="username"
                            name="username"
                            onChange={this.handleChange}
                        />
                        <span className="error">{this.state.usernameError}</span>
                    </FormGroup>
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            onChange={this.handleChange}
                        />
                        <span className="error">{this.state.emailError}</span>
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input
                            onChange={this.handleChange}
                            type="password"
                            name="password"
                            id="password"
                        />
                        <span className="error">{this.state.passwordError}</span>
                    </FormGroup>
                    <Button
                        block
                        disabled={!this.validateForm()}
                        type="submit"
                    >
                        Register
                    </Button>
                </form>
            </div>
        );
    }
}

export default SignUp;