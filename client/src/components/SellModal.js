import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Dropdown, DropdownToggle, FormGroup, Label, Input, DropdownMenu, DropdownItem } from 'reactstrap';
import ReactTooltip from 'react-tooltip';

import { CONDITION } from '../constants';

class SellModal extends React.Component {
    constructor(props) {
        super(props);
        const { currentRelease } = this.props;

        this.state = {
            isDropdownOpen: false,
            selectedItem : null,
            condition: currentRelease.forSale && currentRelease.condition ? currentRelease.condition : null,
            price: currentRelease.forSale ? currentRelease.price : null,
            notes: currentRelease.forSale ? currentRelease.notes : ''
        };
    }

    toggle = () => {
        this.setState(prevState => ({
            isDropdownOpen: !prevState.isDropdownOpen
        }));
    };

    setSelected = (condition) => {
        this.setState({ condition: condition, dropdownError: '' });
    };

    validateAndAdd = (currentRelease, isEditing) => {
        const { condition, price, notes } = this.state;
        if (condition === null || price === null) {
            !condition && !price
                ? this.setState({ dropdownError: 'Please enter vinyl condition', priceError: 'Please enter a price' })
                : !condition
                    ? this.setState({dropdownError: 'Please enter vinyl condition'})
                    : this.setState({priceError: 'Please enter a price'})
        } else {
            const sellData = {
                price,
                notes,
                condition
            };

            this.props.addToSellList(currentRelease, sellData, isEditing);
        }
    };

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value,
            [`${event.target.id}Error`]: ''
        });
    };

    componentDidMount() {
        ReactTooltip.rebuild();
    }

    renderDropdownItem = (condition) => {
        return (
            <DropdownItem data-for="sell-modal"
                          className={this.state.condition && this.state.condition.type === condition.type ? 'selected' : ''}
                          onClick={() => this.setSelected(condition)}>{condition.full}</DropdownItem>
        );
    };

    render() {
        const { isSellModalOpened, toggleSellModal, currentRelease } = this.props;
        const { condition, dropdownError, priceError, price, notes } = this.state;
        ReactTooltip.rebuild();

        return (
            <div>
                <Modal isOpen={isSellModalOpened} className="sell-modal">
                    <ModalHeader>Sell Information</ModalHeader>
                    <ModalBody>
                        <ReactTooltip id="sell-modal"/>
                        Vinyl Condition
                        <Dropdown isOpen={this.state.isDropdownOpen} toggle={this.toggle}>
                            <DropdownToggle caret>
                                {condition ? condition.full : 'Choose condition'}
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu sell-dropdown">
                                {this.renderDropdownItem(CONDITION.mint)}
                                {this.renderDropdownItem(CONDITION.vgPlus)}
                                {this.renderDropdownItem(CONDITION.vg)}
                                {this.renderDropdownItem(CONDITION.good_gplus)}
                                {this.renderDropdownItem(CONDITION.poor)}
                            </DropdownMenu>
                        </Dropdown>
                        {dropdownError ? <span className="error">{dropdownError}</span> : null}
                        <FormGroup className="change-password-form">
                            <Label for="oldPassword">Price</Label>
                            <Input
                                autoFocus
                                type="number"
                                id="price"
                                name="price"
                                value={price || null}
                                onChange={this.handleChange}
                            /> BGN
                        </FormGroup>
                        {priceError ? <span className="error">{priceError}</span> : null}
                        <FormGroup>
                            <Label for="exampleText">Text Area</Label>
                            <Input value={notes} onChange={this.handleChange} type="textarea" name="text" id="notes"/>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success"
                                onClick={() => this.validateAndAdd(currentRelease, currentRelease.forSale ? true : false)}>
                            {currentRelease.forSale ? 'Edit' : 'Add'}
                        </Button>
                        <Button color="secondary" onClick={toggleSellModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }

}

export default SellModal;