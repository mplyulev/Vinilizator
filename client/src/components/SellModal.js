import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Dropdown, DropdownToggle, FormGroup, Label, Input, DropdownMenu, DropdownItem } from 'reactstrap';

class SellModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isDropdownOpen: false,
            selectedItem : null,
            mediaCondition: {
                mTooltip: `Absolutely perfect in every way. Certainly never been played, possibly even still sealed. 
                    Should be used sparingly as a grade, if at all.`,
                nmTooltip: `A nearly perfect record. A NM- record has more than likely never been played,
                 and the vinyl will play perfectly, with no imperfections during playback. 
                 Many dealers won't give a grade higher than this implying (perhaps correctly) that no record is ever truly perfect.
                  The record should show no obvious signs of wear. A 45 RPM or EP sleeve should have no more than the most minor defects,
                   such as any sign of slight handling. An LP cover should have no creases, folds, seam splits, cut-out holes,
                    or other noticeable similar defects. The same should be true of any other inserts, such as posters, 
                    lyric sleeves, etc.`,
                vgPlusTooltip: `A nearly perfect record. A NM- record has more than likely never been played, and the vinyl will play
                 perfectly, with no imperfections during playback. Many dealers won't give a grade higher than this implying (perhaps correctly) 
                 that no record is ever truly perfect. The record should show no obvious signs of wear. A 45 RPM or EP sleeve should have no more than the most
                  minor defects, such as any sign of slight handling. An LP cover should have no creases,
                 folds, seam splits, cut-out holes, or other noticeable similar defects. The same should be true of any other inserts, 
                 such as posters, lyric sleeves, etc.  `
            },
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
        this.setState({ condition: event.currentTarget.innerText });
    };

    validateAndAdd = (currentRelease) => {
        const { condition, price, notes } = this.state;
        console.log(condition);
        if (condition === null || price === null) {
            !condition && !price
                ? this.setState({ dropdownError: 'Please enter vinyl condition', priceError: 'Please enter a price' })
                : condition
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

    render() {
        const { isSellModalOpened, toggleSellModal, currentRelease } = this.props;
        const { condition, dropdownError, priceError } = this.state;

        return (
            <div>
                <Modal isOpen={isSellModalOpened} className="sell-modal">
                    <ModalHeader>Sell Information</ModalHeader>
                    <ModalBody>
                        Vinyl Condition
                        <Dropdown isOpen={this.state.isDropdownOpen} toggle={this.toggle}>
                            <DropdownToggle caret>
                                {condition || 'Choose condition'}
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu">
                                <DropdownItem className="dropdown-item"  onClick={(event) => this.setSelected(event)}>Mint (M)</DropdownItem>
                                <DropdownItem onClick={this.setSelected}>Near Mint (NM or M-)</DropdownItem>
                                <DropdownItem onClick={this.setSelected}>Very Good Plus (VG+)</DropdownItem>
                                <DropdownItem onClick={this.setSelected}>Very Good (VG)</DropdownItem>
                                <DropdownItem onClick={this.setSelected}>Good (G)/Good Plus (G+)</DropdownItem>
                                <DropdownItem onClick={this.setSelected}>Poor (P)/Fair (F)</DropdownItem>
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