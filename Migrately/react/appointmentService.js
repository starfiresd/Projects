import axios from "axios";
import {
  onGlobalSuccess,
  onGlobalError,
  API_HOST_PREFIX,
} from "./serviceHelpers";

const endpoint = `${API_HOST_PREFIX}/api/appointments`;

const getByClientId = (payload) => {
  const config = {
    method: "GET",
    url: `${endpoint}/client/paginate/?clientId=${payload.id}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getByAttorneyId = (payload) => {
  const config = {
    method: "GET",
    url: `${endpoint}/attorneyProfile/paginate/?attorneyProfileId=${payload.id}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getByCreatedById = (payload) => {
  const config = {
    method: "GET",
    url: `${endpoint}/attorney/paginate/?createdById=${payload.id}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const addAppointment = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const updateAppointment = (payload) => {
  const config = {
    method: "PUT",
    url: `${endpoint}/${payload.id}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const appointmentService = {
  getByClientId,
  getByAttorneyId,
  getByCreatedById,
  addAppointment,
  updateAppointment,
};

export default appointmentService;
