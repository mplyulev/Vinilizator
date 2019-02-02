import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Dropdown, DropdownToggle, FormGroup, Label, Input, DropdownMenu, DropdownItem } from 'reactstrap';
import ReactTooltip from 'react-tooltip';

import { CONDITION } from '../constants';

class SellModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isDropdownOpen: false,
            selectedItem : null,
            condition: null,
            price: null,
            notes: ''
        };
    }

    toggle = () => {
        this.setState(prevState => ({
            isDropdownOpen: !prevState.isDropdownOpen
        }));
    };

    setSelected = (event) => {
        this.setState({ condition: event.currentTarget.innerText, dropdownError: '' });
    };

    validateAndAdd = (currentRelease) => {
        const { condition, price, notes } = this.state;
        console.log(price);
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

            this.props.addToSellList(currentRelease, sellData);
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

    render() {
        const { isSellModalOpened, toggleSellModal, currentRelease } = this.props;
        const { condition, dropdownError, priceError } = this.state;
        ReactTooltip.rebuild();

        return (
            <div>
                <ReactTooltip id="sell-modal" />
                <Modal isOpen={isSellModalOpened} className="sell-modal">
                    <ModalHeader>Sell Information</ModalHeader>
                    <ModalBody>
                        Vinyl Condition
                        <Dropdown isOpen={this.state.isDropdownOpen} toggle={this.toggle}>
                            <DropdownToggle caret>
                                {condition || 'Choose condition'}
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu">

                                <DropdownItem data-for="sell-modal"
                                              data-tip={CONDITION.mTooltip}
                                              onClick={(event) => this.setSelected(event)}> <span data-for="sell-modal"
                                                                                                   data-tip={CONDITION.mTooltip}>{CONDITION.mint}</span></DropdownItem>
                                <DropdownItem data-for="sell-modal"
                                              data-tip={CONDITION.vgPlusTooltip}
                                              onClick={(event) => this.setSelected(event)}>{CONDITION.vgPlus}</DropdownItem>
                                <DropdownItem data-for="sell-modal"
                                              data-tip={CONDITION.vgTooltip}
                                              onClick={(event) => this.setSelected(event)}>{CONDITION.vg}</DropdownItem>
                                <DropdownItem data-for="sell-modal"
                                              data-tip={CONDITION.gPlusTooltip}
                                              onClick={(event) => this.setSelected(event)}>{CONDITION.good_gplus}</DropdownItem>
                                <DropdownItem data-for="sell-modal"
                                              data-tip={CONDITION.poorTooltip}
                                              onClick={(event) => this.setSelected(event)}>{CONDITION.poor}</DropdownItem>
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
                                onChange={this.handleChange}
                            /> BGN
                        </FormGroup>
                        {priceError ? <span className="error">{priceError}</span> : null}
                        <FormGroup>
                            <Label for="exampleText">Text Area</Label>
                            <Input onChange={this.handleChange} type="textarea" name="text" id="notes" />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={() => this.validateAndAdd(currentRelease)}>Add</Button>{' '}
                        <Button color="secondary" onClick={toggleSellModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }

}

export default SellModal;