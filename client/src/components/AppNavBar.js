import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';
import { ROUTE_MY_COLLECTION, ROUTE_SEARCH } from '../constants';

class AppNavBar extends Component {
    state = {
        isOpen: false
    };

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    render() {
        return (
            <div>
                <Navbar color="light"
                        light expand="sm"
                        className="mb-5 navbar">
                    <NavbarBrand href="/">VYNILIZATOR</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavLink to={ROUTE_SEARCH}
                                     activeClassName="selected">
                                SEARCH
                            </NavLink>
                            <NavLink to={ROUTE_MY_COLLECTION}
                                     activeClassName="selected">
                                MY COLLECTION
                            </NavLink>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

export default AppNavBar;