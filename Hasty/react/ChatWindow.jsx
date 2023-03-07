import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row } from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import ChatInput from './ChatInput';
import Message from './Message';
import '../messages.css';
import 'simplebar-react/dist/simplebar.min.css';

export default function ChatWindow(props) {
    const { chats, sendMessage, currentUser } = props;
    const chat = chats.currentChat.map((chatMessage, i) => (
        <Message
            key={`messages_${i}`}
            currentUser={currentUser}
            currentContact={chats.currentContact}
            chatMessage={chatMessage}
        />
    ));

    return (
        <>
            <SimpleBar>
                <Container className="card card-body chat-window pb-5">
                    <Row>{chat}</Row>
                    <Container className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
                        <Row>
                            <ChatInput currentUser={currentUser} chats={chats} sendMessage={sendMessage} />
                        </Row>
                    </Container>
                </Container>
            </SimpleBar>
        </>
    );
}
ChatWindow.propTypes = {
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
};
