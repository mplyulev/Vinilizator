import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FormGroup, Label, Input } from 'reactstrap';
import ReactTooltip from 'react-tooltip';


class ChatModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: ''
        };
    }

    // toggle = () => {
    //     this.setState(prevState => ({
    //         isDropdownOpen: !prevState.isDropdownOpen
    //     }));
    // };

    handleChange = (event) => {
        this.setState({
            message: event.target.value,
        });
    };

    componentDidMount() {
        ReactTooltip.rebuild();
    }

    sendMessage = () => {

    };

    render() {
        const { isChatModalOpened, toggleChatModal } = this.props;
        const { message } = this.state
        ReactTooltip.rebuild();

        return (
            <div>
                <Modal isOpen={isChatModalOpened} className="sell-modal">
                    <ModalHeader>Message </ModalHeader>
                    <ModalBody>
                        <ReactTooltip id="sell-modal"/>
                        <FormGroup>
                            <Label for="exampleText">Text Area</Label>
                            <Input value={message} onChange={this.handleChange} type="textarea" name="text" id="notes"/>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success"
                                onClick={() => this.sendMessage()}>
                            Send message
                        </Button>
                        <Button color="secondary" onClick={toggleChatModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }

}

export default ChatModal;