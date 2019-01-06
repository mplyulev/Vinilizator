import React, {Component, Fragment} from "react";
import { Button, Card } from "reactstrap";

import SignIn from './SignIn';
import SignUp from './SignUp';
import {ROUTE_SIGN_IN, ROUTE_SIGN_UP} from "../constants";
import {withRouter} from "react-router-dom";

class Authentication extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoginFormActive: this.props.isLoginFormActive
        };
    }

    toggleForm = (isLoginFormActive) => {
        this.setState({isLoginFormActive});
        isLoginFormActive ? this.props.history.push(ROUTE_SIGN_IN) : this.props.history.push(ROUTE_SIGN_UP);
    };

    render() {
        const {isLoginFormActive} = this.state;

        return (
            <Fragment>
                <div className="authentication-background-wrapper">
                    <div className="authentication-background"></div>
                </div>
                <Card className={`authentication${isLoginFormActive ? ' login' : ' register'}`}>
                    <h1>Vynilist</h1>
                    <div className="authentication-header">
                        <Button
                            onClick={() => this.toggleForm(true)}>
                            Login
                        </Button>
                        <Button
                            onClick={() => this.toggleForm(false)}>
                            Register
                        </Button>
                    </div>
                    {isLoginFormActive && <SignIn setToken={this.props.setToken}/>}
                    {!isLoginFormActive && <SignUp setToken={this.props.setToken}/>}
                </Card>
            </Fragment>
        );
    }
}

export default withRouter(Authentication);