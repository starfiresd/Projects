import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Button } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import { FaPaperPlane} from 'react-icons/fa';
import toastr from 'toastr';
import '../messages.css';

const defaultMsg = {
    messageText: '',
    subject: '',
    recipientId: '',
    senderId: '',
};

export default function ChatInput(props) {

    const { currentUser, chats, sendMessage } = props;
    const [chatMessage, setChatMessage] = useState(defaultMsg);
    

    const onSubmit = () => {
        const isMessageProvided = chatMessage.messageText && chatMessage.messageText !== '';
        const isSubjectIdProvided = chatMessage.subject && chatMessage.subject !== '';
        const isRecipientIdProvided = chatMessage.recipientId && chatMessage.recipientId !== '';
        const isSenderIdProvided = chatMessage.senderId && chatMessage.senderId !== '';
        if (isMessageProvided && isSubjectIdProvided && isRecipientIdProvided && isSenderIdProvided) {
            setChatMessage(defaultMsg);
            sendMessage(chatMessage);
        } else {
            toastr.info('Please insert a message.');
        }
    };

    const onMessageUpdate = (e) => {
        setChatMessage((prevState) => {
            const msg = { ...prevState };
            msg.messageText = e.target.value;
            msg.subject = 'Chathub';
            msg.recipientId = +chats.currentContact.id;
            msg.senderId = +currentUser.id;
            return msg;
        });
    };

    return (
        <>
            <Container className="chat-input-container rounded">
                <Row>
                    <Formik enableReinitialize={true} initialValues={chatMessage} onSubmit={onSubmit}>
                        <Form>
                            <Field
                                type="text"
                                name="messageText"
                                className="form-control w-75 float-start"
                                placeholder="Enter your message"
                                onChange={onMessageUpdate}
                            />
                            <Button
                                type="submit"
                                variant="secondary"
                                className="float-end"
                                disabled={chats.currentContact.id ? false : true}>
                                <FaPaperPlane />
                            </Button>
                        </Form>
                    </Formik>
                </Row>
            </Container>
        </>
    );
}

ChatInput.propTypes = {
    currentUser: PropTypes.shape({
        avatarUrl: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        isLoggedIn: PropTypes.bool.isRequired,
        lastName: PropTypes.string.isRequired,
        mi: PropTypes.string.isRequired,
        roles: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    }).isRequired,
    chats: PropTypes.shape({
        currentChat: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
        currentContact: PropTypes.shape({
            avatarUrl: PropTypes.string,
            dateCreated: PropTypes.string,
            dateModified: PropTypes.string,
            email: PropTypes.string,
            firstName: PropTypes.string,
            id: PropTypes.number,
            isConfirmed: PropTypes.bool,
            lastName: PropTypes.string,
            mi: PropTypes.string,
            statusId: PropTypes.number,
        }),
    }).isRequired,
    sendMessage: PropTypes.func.isRequired,
};
