import React, { Component } from 'react';
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';

class RecordsList extends Component {

    render () {
        console.log(this.props.queryResult);

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

export default RecordsList;