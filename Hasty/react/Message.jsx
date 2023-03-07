import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import '../messages.css';

const defaultSender = {
    avatarUrl: '',
    name: '',
    isCurrentUser: true,
};

export default function Message(props) {
    const { currentUser, currentContact, chatMessage } = props;
    const [sender, setSender] = useState(defaultSender);

    useEffect(() => {
        if (+chatMessage.senderId === +currentUser.id) {
            setSender((prevState) => {
                const newSender = { ...prevState };
                newSender.avatarUrl = currentUser.avatarUrl;
                newSender.name = currentUser.firstName + ' ' + currentUser.lastName[0];
                newSender.isCurrentUser = true;
                return newSender;
            });
        } else {
            setSender((prevState) => {
                const newSender = { ...prevState };
                newSender.avatarUrl = currentContact.avatarUrl;
                newSender.name = currentContact.firstName + ' ' + currentContact.lastName[0];
                newSender.isCurrentUser = false;
                return newSender;
            });
        }
    }, []);

    return (
        <>
            {sender.isCurrentUser && (
                <Container className="message mb-1">
                    <Row>
                        <Col className="col-2">
                            <img
                                src={sender.avatarUrl}
                                alt="avatar"
                                className="rounded-circle d-inline object-fit-cover"
                            />
                        </Col>
                        <Col className="message-text rounded col-auto px-2 pb-0">
                            <div className="message-text d-block pb-0">
                                <h6 className="d-inline">{sender.name}</h6>
                                <p className="d-block">{chatMessage.messageText}</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            )}
            {!sender.isCurrentUser && (
                <Container className="message mb-1">
                    <Row className="float-end">
                        <Col className="message-text-response rounded col-auto px-2 pb-0">
                            <div className="message-text-response d-block pb-0">
                                <h6 className="d-inline">{sender.name}</h6>
                                <p className="d-block">{chatMessage.messageText}</p>
                            </div>
                        </Col>
                        <Col className="col-2">
                            <img
                                src={sender.avatarUrl}
                                alt="avatar"
                                className="rounded-circle d-inline object-fit-cover"
                            />
                        </Col>
                    </Row>
                </Container>
            )}
        </>
    );
}

Message.propTypes = {
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
    chatMessage: PropTypes.shape({
        messageText: PropTypes.string.isRequired,
        subject: PropTypes.string.isRequired,
        senderId: PropTypes.number.isRequired,
        recipientId: PropTypes.number.isRequired,
    }).isRequired,
};
