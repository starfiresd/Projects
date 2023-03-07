import React, { useState, useEffect, useRef } from 'react';
import {useLocation} from 'react-router-dom';
import PropTypes from 'prop-types';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Container, Row, Col } from 'react-bootstrap';
import toastr from 'toastr';
import Header from '../../elements/Header';
import ChatLog from '../chatsidebars/ChatLog';
import ContactCard from '../chatsidebars/ContactCard';
import ChatWindow from './ChatWindow';
import RecentChatCard from '../chatsidebars/RecentChatCard';
import messageService from '../../../services/messageService';
import * as userService from '../../../services/userService';
import { API_HOST_PREFIX } from '../../../services/serviceHelpers';

const defaultChats = {
    currentChat: [],
    currentContact: {},
    recentChats: [],
    previewMessageCards: [],
};

const defaultHandlers = { response: [], err: [] };
const crumbs = [
    { name: 'Apps', path: '/apps' },
    { name: 'Chat', path: '/apps/chat' },
];

export default function Chat(props) {
    const {state} = useLocation();
    const { currentUser } = props;
    const [connection, setConnection] = useState(null);
    const [chats, setChats] = useState(defaultChats);
    const [handlers, setHandlers] = useState(defaultHandlers);
    const latestChat = useRef(null);

    latestChat.current = chats.currentChat;

    useEffect(()=>{
        if (state?.type === "LANDLORD_DATA" && state?.payload) {
            let currentContact = {...state.payload};
            setChats((prevState)=>{
                return ({...prevState, currentContact:{...currentContact}})
            })
        }
    },[state])

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl(`${API_HOST_PREFIX}/hubs/chat`)
            .withAutomaticReconnect()
            .build();
        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start().then(onStartSuccess).catch(onStartError);
        }
    }, [connection]);

    const onStartSuccess = () => {
        connection.on('ReceiveMessage', (message) => {
            if (message.recipientId === currentUser.id || message.senderId === currentUser.id) {
                const updatedChat = [...latestChat.current];
                updatedChat.push(message);
                setChats((prevState) => {
                    const chat = { ...prevState };
                    chat.currentChat = updatedChat;
                    return chat;
                });
            }
        });
    };

    const onStartError = () => {
        toastr.error('Connection failed: ');
    };

    useEffect(() => {
        if (currentUser.id !== '') {
            messageService.getByUserIdRecentConversations().then(onGetByConversationSuccess).catch(errHandler);
        }
    }, [chats.currentContact, currentUser]);

    const onGetByConversationSuccess = (response) => {
        if (response?.items) {
            const reducedChats = response.items.reduce((chats, chat) => {
                let id = chat.recipientId === currentUser.id ? chat.senderId : chat.recipientId;
                if (chats[id]) {
                    chats[id].push(chat);
                } else {
                    chats[id] = [chat];
                }
                return chats;
            }, {});
            const objectChats = Object.entries(reducedChats);
            const mappedObjChats = objectChats.map(mapObjectChat);
            setChats((prevState) => {
                const chat = { ...prevState };
                chat.recentChats = objectChats;
                chat.previewMessageCards = mappedObjChats.map(mapRecentChat);
                return chat;
            });
        }
    };

    const mapObjectChat = (chat) => {
        return chat[1];
    };

    const mapRecentChat = (recentChats, i) => {
        return (
            <RecentChatCard
                key={`RecentChat_${i}`}
                currentUser={currentUser}
                recentChat={recentChats[recentChats.length - 1]}
                onRecentChat={onRecentChat}
                errHandler={errHandler}
            />
        );
    };

    useEffect(() => {
        if (chats.currentContact.id !== '' && chats.recentChats.length !== 0) {
            const filteredContactChats = chats.recentChats.filter((chat) => +chat[0] === +chats.currentContact.id);
            const contactChatsArray = filteredContactChats[0];
            const contactChats = contactChatsArray[1];
            const updatedChat = [...latestChat.current];
            contactChats.map((message) => updatedChat.push(message));
            setChats((prevState) => {
                const chat = { ...prevState };
                chat.currentChat = updatedChat;
                return chat;
            });
        }
    }, [chats.currentContact]);

    const sendMessage = async (chatMessage) => {
        if (connection._connectionStarted) {
            try {
                await connection.send('SendMessage', chatMessage);
                messageService.add(chatMessage).then(onAddSuccess).catch(onAddError);
            } catch (error) {
                errHandler(error);
            }
        } else {
            toastr.error('No connection to server yet.');
        }
    };

    const onAddSuccess = (response) => {
        messageService
            .updateSentDate(+response.item)
            .then(successHandler)
            .catch(errHandler);
    };

    const onAddError = () => {
        toastr.error('Message failed to send to user.', 'Message Error');
    };

    const onRecentChat = (recentChat) => {
        setChats((prevState) => {
            const chat = { ...prevState };
            chat.currentChat = [];
            return chat;
        });
        if (recentChat.senderId === currentUser.id) {
            userService.userById(recentChat.recipientId).then(onUserByIdSuccess).catch(errHandler);
        } else {
            userService.userById(recentChat.senderId).then(onUserByIdSuccess).catch(errHandler);
        }
    };

    const onUserByIdSuccess = (response) => {
        setChats((prevState) => {
            const chat = { ...prevState };
            chat.currentContact = response.item;
            return chat;
        });
    };

    const onEmail = () => {
        window.location = `mailto:${chats.currentContact.email}`;
    };

    const successHandler = (response) => {
        if (handlers.response.length > 5) {
            handlers.response.pop();
        }
        setHandlers((prevState) => {
            const resp = { ...prevState };
            resp.response.push(response);
            return resp;
        });
    };

    const errHandler = (error) => {
        if (handlers.err.length > 5) {
            handlers.err.pop();
        }
        setHandlers((prevState) => {
            const err = { ...prevState };
            err.err.push(error);
            return err;
        });
    };

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <Header title="Chat" crumbs={crumbs} />
                    </Col>
                </Row>
                <Row>
                    <Col className="col-4">
                        <ChatLog
                            currentUser={currentUser}
                            recentCards={chats.previewMessageCards}
                            errHandler={errHandler}
                        />
                    </Col>
                    <Col className="col-5">
                        <Row>
                            <ChatWindow chats={chats} sendMessage={sendMessage} currentUser={currentUser} />
                        </Row>
                    </Col>
                    <Col className="col-3">
                        <ContactCard currentContact={chats.currentContact} onEmail={onEmail} />
                    </Col>
                </Row>
            </Container>
        </>
    );
}

Chat.propTypes = {
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
