import React from 'react';
import { NavLink } from 'react-router-dom';

import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav
} from 'reactstrap';
import {
    ROUTE_COLLECTION,
    ROUTE_WISHLIST,
    ROUTE_SEARCH,
    ROUTE_SIGN_IN,
    ROUTE_ACCOUNT,
    ROUTE_FOR_SELL, ROUTE_MARKET
} from '../constants';

function AppNavBar(props) {
    return (
        <div>
            <Navbar color="dark"
                    light expand="sm"
                    className={`mb-5 navbar${props.isVisible ? ' visible' : ''}`}>
                <NavbarBrand href="/">VYNILIZATOR</NavbarBrand>
                <NavbarToggler color="dark" onClick={() => props.toggleNavBar(false)} />
                <Collapse isOpen={props.isNavBarOpened} navbar>
                    <Nav className="ml-auto" navbar>
                        <NavLink to={ROUTE_SEARCH}
                                 activeClassName="selected">
                            SEARCH
                        </NavLink>
                        <NavLink to={ROUTE_COLLECTION}
                                 activeClassName="selected">
                            COLLECTION
                        </NavLink>
                        <NavLink to={ROUTE_WISHLIST}
                                 activeClassName="selected">
                            WISHLIST
                        </NavLink>
                        <NavLink to={ROUTE_FOR_SELL}
                                 activeClassName="selected">
                            FOR SELL
                        </NavLink>
                        <NavLink to={ROUTE_MARKET}
                                 activeClassName="selected">
                            MARKET
                        </NavLink>
                        <NavLink to={ROUTE_ACCOUNT}
                                 activeClassName="selected">
                            ACCOUNT
                        </NavLink>
                        <a href={ROUTE_SIGN_IN} onClick={props.logout}>
                            LOGOUT
                        </a>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
}

export default AppNavBar;