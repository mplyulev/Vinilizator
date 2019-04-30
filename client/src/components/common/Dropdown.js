import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';

class DropdownComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,

        };
    }

    toggle = () => {
        this.setState(prevState => ({
            isOpen: !prevState.isOpen
        }));
    };

    render() {
        const { isOpen } = this.state;
        const { selected, dropdownTitle, items, showSelected } = this.props;

        return (
            <Dropdown isOpen={isOpen} toggle={() => this.toggle()}>
                <DropdownToggle caret>
                    {selected && showSelected ? selected : dropdownTitle}
                </DropdownToggle>
                <DropdownMenu className="styles-dropdown">
                    <Scrollbars autoHeight
                                autoHeightMax={300}
                                className="scrollbar"
                                autoHideTimeout={1000}
                                autoHideDuration={500}
                                style={{ width: `100%` }}>
                        {items}
                    </Scrollbars>
                </DropdownMenu>
            </Dropdown>
        )
    }
}

export default DropdownComponent;