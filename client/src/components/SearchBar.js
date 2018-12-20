import React, { Component } from 'react';
import axios from 'axios'
import { DISCOGS_KEY, DISCOGS_SECRET, DEBOUNCE_TIME } from '../constants';
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import _ from 'lodash';

class SearchBar extends Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        this.props.searchQuery(event.target.value);
    }

    render () {
        return (
            <div>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">Search</InputGroupAddon>
                    <Input onChange={this.onChange} />
                </InputGroup>
            </div>
        );
    }
}

export default SearchBar;