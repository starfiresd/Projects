import axios from 'axios';
import { onGlobalError, onGlobalSuccess, API_HOST_PREFIX } from './serviceHelpers';

const endpoint = `${API_HOST_PREFIX}/api/messages`;

const getByRecipientId = (id) => {
    const config = {
        method: 'GET',
        url: `${endpoint}/recipient?recipientId=${id}&pageIndex=0&pageSize=5`,
        crossdomain: true,
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getByUserIdRecentConversations = () => {
    const config = {
        method: 'GET',
        url: `${endpoint}/recent`,
        crossdomain: true,
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getBySenderId = (id) => {
    const config = {
        method: 'GET',
        url: `${endpoint}/sender?senderId=${id}&pageIndex=0&pageSize=5`,
        crossdomain: true,
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getByConversation = (recipientId, pageIndex, pageSize) => {
    const config = {
        method: 'GET',
        url: `${endpoint}/conversation?recipientId=${recipientId}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
        crossdomain: true,
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const add = (payload) => {
    const config = {
        method: 'POST',
        url: endpoint,
        data: payload,
        crossdomain: true,
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const update = (id, payload) => {
    const config = {
        method: 'PUT',
        url: `${endpoint}/${id}`,
        data: payload,
        crossdomain: true,
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const updateSentDate = (id) => {
    const config = {
        method: 'PUT',
        url: `${endpoint}/sentdate/${id}`,
        crossdomain: true,
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const messageService = {
    getByRecipientId,
    getByUserIdRecentConversations,
    getBySenderId,
    getByConversation,
    add,
    update,
    updateSentDate,
};
export default messageService;
