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

        this.background = null;
        this.form = null;
        this.backgroundTimeout = null;
        this.formTimeout = null;
    }

    componentDidMount() {
        this.timeout = setTimeout(() => {
            this.background.classList.add('mounted');
        }, 1000);

        this.formTimeout = setTimeout(() => {
            this.form.classList.add('mounted');
        }, 0)
    }

    componentWillUnmount() {
        clearTimeout(this.backgroundTimeout);
        clearTimeout(this.formTimeout);
    }

    toggleForm = (isLoginFormActive) => {
        this.setState({isLoginFormActive});
        isLoginFormActive ? this.props.history.push(ROUTE_SIGN_IN) : this.props.history.push(ROUTE_SIGN_UP);
    };

    render() {
        const {isLoginFormActive} = this.state;
        console.log('rendering');
        return (
            <Fragment>
                <div className="authentication-background-wrapper">
                    <div className="authentication-background" ref={node => this.background = node}></div>
                </div>
                <div className="authentication-form-wrapper" ref={node => this.form = node}>
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
                        {isLoginFormActive && <SignIn setToken={this.props.setToken} />}
                        {!isLoginFormActive && <SignUp setToken={this.props.setToken} />}
                    </Card>
                </div>
            </Fragment>
        );
    }
}

export default withRouter(Authentication);