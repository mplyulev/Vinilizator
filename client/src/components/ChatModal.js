import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, DropdownMenu } from 'reactstrap';
import { FormGroup, Label, Input } from 'reactstrap';
import ReactTooltip from 'react-tooltip';
import { Scrollbars } from 'react-custom-scrollbars';
import { FaWindowMinimize } from 'react-icons/fa';

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
        const { isChatModalOpened, toggleChatModal, messageTo } = this.props;
        const { message } = this.state
        ReactTooltip.rebuild();

        return (
            <div>
                <Modal isOpen={isChatModalOpened} className="chat-modal">
                    <ModalHeader>Message {messageTo}
                        <FaWindowMinimize className="minimize"/>
                    </ModalHeader>

                    <ModalBody>
                        <ReactTooltip id="sell-modal"/>
                        <FormGroup>
                            <Scrollbars autoHeight
                                        autoHeightMax={150}
                                        className="scrollbar"
                                        autoHideTimeout={1000}
                                        autoHideDuration={500}
                                        style={{ width: `100%` }}>
                                <Input value={message} onChange={this.handleChange} type="textarea" name="text" id="notes"/>
                            </Scrollbars>
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