import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FaArrowRight } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import * as userService from '../../../services/userService';

const defaultMappedChat = { senderId: '', name: '', avatarUrl: '', messageText: '', datetimeToNow: '' };

export default function RecentChatCard(props) {
    const { currentUser, recentChat, onRecentChat, errHandler } = props;
    const [mappedChat, setMappedChat] = useState(defaultMappedChat);

    useEffect(() => {
        if (recentChat.senderId === currentUser.id) {
            userService.userById(recentChat.recipientId).then(onUserByIdSuccess).catch(errHandler);
        } else {
            userService.userById(recentChat.senderId).then(onUserByIdSuccess).catch(errHandler);
        }
    }, [recentChat]);

    const onUserByIdSuccess = (response) => {
        setMappedChat((prevState) => {
            const mc = { ...prevState };
            mc.name = response.item.firstName + ' ' + response.item.lastName[0];
            mc.avatarUrl = response.item.avatarUrl;
            mc.messageText = recentChat.messageText;
            mc.datetimeToNow = formatDistanceToNow(new Date(recentChat.dateSent));
            return mc;
        });
    };

    const onClick = () => {
        onRecentChat(recentChat);
    };

    return (
        <>
            <div name="card-formats" className="card-highlighted align-items-start mt-1 p-2" onClick={onClick}>
                <Row>
                    <Col className="col-auto">
                        <a className="block-icon">
                            <Image
                                fluid={true}
                                roundedCircle={true}
                                className="object-fit-cover avatar-sm"
                                src={mappedChat.avatarUrl}
                            />
                            {recentChat.senderId === currentUser.id && (
                                <FaArrowRight className="fa-stack the-wrapper icon-tag" />
                            )}
                        </a>
                    </Col>
                    <Col>
                        <div className="w-100 overflow-hidden">
                            <h6 className="mt-0 mb-0 font-14">
                                <span className="float-end text-muted font-12">{mappedChat.datetimeToNow}</span>
                                {mappedChat.name}
                            </h6>
                            <p className="mt-1 mb-0 text-muted font-14">
                                <span className="w-75">{mappedChat.messageText}</span>
                            </p>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
}

RecentChatCard.propTypes = {
    currentUser: PropTypes.shape({
        id: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        avatarUrl: PropTypes.string.isRequired,
    }).isRequired,
    recentChat: PropTypes.shape({
        dateCreated: PropTypes.string.isRequired,
        dateModified: PropTypes.string.isRequired,
        dateRead: PropTypes.string,
        dateSent: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        messageText: PropTypes.string.isRequired,
        recipientId: PropTypes.number.isRequired,
        senderId: PropTypes.number.isRequired,
        subject: PropTypes.string,
    }).isRequired,
    onRecentChat: PropTypes.func.isRequired,
    errHandler: PropTypes.func.isRequired,
};
