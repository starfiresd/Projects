import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { format, addMinutes, roundToNearestMinutes } from "date-fns";
import moment from "moment";
import toastr from "toastr";
import AttorneyProfileView from "./AttorneyProfileView";
import appointmentService from "services/appointmentService";
import attorneyService from "services/attorneyService";
import userService from "services/userService";
import { addAppointmentSchema } from "schemas/addAppointmentSchema";
import "react-big-calendar/lib/css/react-big-calendar.css";

const defaultAppts = {
  appointments: [],
  calendarEvents: [],
  current: {},
  currentComponent: {},
};

const defaultPagination = {
  pageIndex: 0,
  pageSize: 1000,
};

const defaultOptions = {
  attorneyProfiles: [],
  attorneyOptions: [],
  filteredOptions: [],
  isFiltered: false,
  appointmentTypesOptions: [],
  clients: [],
  clientOptions: [],
};

const defaultApptTypes = [
  { id: 1, name: "In Person" },
  { id: 2, name: "Phone Consultation" },
  { id: 3, name: "Video" },
  { id: 4, name: "Chat" },
];

const defaultFormData = {
  id: "",
  appointmentType: "",
  clientId: "",
  attorneyProfileId: "",
  notes: "",
  isConfirmed: false,
  appointmentStartDate: format(new Date(), "yyyy-MM-dd"),
  appointmentStartTime: format(
    roundToNearestMinutes(new Date(), { nearestTo: 30 }),
    "HH:mm:ss"
  ),
  statusTypesId: 1,
  query: "",
};

const defaultData = { data: [], i: 0 };

export default function Appointments() {
  const navigate = useNavigate();
  const localizer = momentLocalizer(moment);
  const [currentUser, setCurrentUser] = useState();
  const [isAttorney, setIsAttorney] = useState(false);
  const [clientAppts, setClientAppts] = useState(defaultAppts);
  const [attorneyAppts, setAttorneyAppts] = useState(defaultAppts);
  const [profileAppts, setProfileAppts] = useState(defaultAppts);
  const [pagination] = useState(defaultPagination);
  const [options, setOptions] = useState(defaultOptions);
  const [isAdd, setIsAdd] = useState(true);
  const [data, setData] = useState(defaultData);
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    userService
      .getCurrentUser()
      .then(onGetCurrentUserSuccess)
      .catch(onGetCurrentUserError);
  }, []);

  const onGetCurrentUserSuccess = (response) => {
    userService
      .getUserById(response.data.item.id)
      .then(onGetUserByIdSuccess)
      .catch(onGetUserByIdError);
  };

  const onGetCurrentUserError = () => {
    navigate("/login");
  };

  const onGetUserByIdSuccess = (response) => {
    setCurrentUser((prevState) => {
      const user = { ...prevState, ...response.data.item };
      return user;
    });
  };

  const onGetUserByIdError = (err) => {
    if (data.data.length > 5) {
      data.data.pop();
    }
    setData((prevState) => {
      const data = { ...prevState };
      data.data.push(err);
      return data;
    });
  };

  useEffect(() => {
    attorneyService
      .getAttorneyPaginated(pagination.pageIndex, pagination.pageSize)
      .then(onGetAttorneySuccess)
      .catch(onGetAttorneyError);
  }, []);

  const onGetAttorneySuccess = (response) => {
    setOptions((prevState) => {
      const op = { ...prevState };
      op.attorneyProfiles = response.item.pagedItems;
      op.attorneyOptions = response.item.pagedItems.map(mapOptions);
      op.appointmentTypesOptions = defaultApptTypes.map(mapAppointmentTypes);
      return op;
    });
  };

  const onGetAttorneyError = (err) => {
    if (data.data.length > 5) {
      data.data.pop();
    }
    setData((prevState) => {
      const data = { ...prevState };
      data.data.push(err);
      return data;
    });
  };

  useEffect(() => {
    if (isAttorney) {
      attorneyService
        .getAttorneyByUserId()
        .then(onGetAttorneyByUserIdSuccess)
        .catch(onGetAttorneyByUserIdError);
    }
  }, [currentUser, isAttorney]);

  const onGetAttorneyByUserIdSuccess = (response) => {
    setAttorneyAppts((prevState) => {
      const appt = { ...prevState };
      appt.current = response.item;
      return appt;
    });
    userService
      .getUsersByAttorneyId(response.item.id)
      .then(onGetByAttorneyIdSuccess)
      .catch(onGetByAttorneyIdError);
  };

  const onGetAttorneyByUserIdError = (err) => {
    if (data.data.length > 5) {
      data.data.pop();
    }
    setData((prevState) => {
      const data = { ...prevState };
      data.data.push({ func: "onGetAttorneyByUserIdError", err: err });
      return data;
    });
  };

  const onGetByAttorneyIdSuccess = (response) => {
    setOptions((prevState) => {
      const opt = { ...prevState };
      opt.clients = response.data.items;
      opt.clientOptions = response.data.items.map(mapClients);
      return opt;
    });
  };

  const onGetByAttorneyIdError = (err) => {
    if (data.data.length > 5) {
      data.data.pop();
    }
    setData((prevState) => {
      const data = { ...prevState };
      data.data.push({ func: "onGetByAttorneyIdError", err: err });
      return data;
    });
  };

  const mapClients = (client) => {
    return (
      <option value={client.userId} key={`attorney_${client.userId}`}>
        {client.firstName} {client.lastName}
      </option>
    );
  };

  const mapAppointmentTypes = (apptType) => {
    return (
      <option value={apptType.id} key={`appt_${apptType.id}`}>
        {apptType.name}
      </option>
    );
  };

  const mapOptions = (attorneyProfile) => {
    return (
      <option value={attorneyProfile.id} key={`attorney_${attorneyProfile.id}`}>
        {attorneyProfile.practiceName}
      </option>
    );
  };

  useEffect(() => {
    if (currentUser?.role) {
      const roles = currentUser.role.map(mapRole);
      if (roles.includes("Attorney")) {
        setIsAttorney(true);
      }
    }
  }, [currentUser]);

  const mapRole = (role) => {
    return role.name;
  };

  useEffect(() => {
    if (isAttorney) {
      appointmentService
        .getByCreatedById({
          id: currentUser?.userId,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        })
        .then(onByCreatedByIdSuccess)
        .catch(onByCreatedByIdError);
    } else {
      appointmentService
        .getByClientId({
          id: currentUser?.userId,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        })
        .then(onByClientIdSuccess)
        .catch(onByClientIdError);
    }
  }, [isAttorney, formData, profileAppts]);

  const onByCreatedByIdSuccess = (response) => {
    setAttorneyAppts((prevState) => {
      const appt = { ...prevState };
      appt.appointments = response.item.pagedItems;
      appt.calendarEvents = response.item.pagedItems.map(mapCalendarEvent);
      return appt;
    });
  };

  const onByCreatedByIdError = (err) => {
    if (data.data.length > 5) {
      data.data.pop();
    }
    setData((prevState) => {
      const data = { ...prevState };
      data.data.push({ func: "onByCreatedByIdError", err: err });
      return data;
    });
  };

  const onByClientIdSuccess = (response) => {
    setClientAppts((prevState) => {
      const appt = { ...prevState };
      appt.appointments = response.item.pagedItems;
      appt.calendarEvents = response.item.pagedItems.map(mapCalendarEvent);
      return appt;
    });
  };

  const onByClientIdError = (err) => {
    if (data.data.length > 5) {
      data.data.pop();
    }
    setData((prevState) => {
      const data = { ...prevState };
      data.data.push({ func: "onByClientIdError", err: err });
      return data;
    });
  };

  const mapCalendarEvent = (appointment) => {
    let event = {};
    event.id = appointment.id;
    if (isAttorney) {
      event.title =
        appointment.client.firstName + " " + appointment.client.lastName;
    } else {
      event.title = appointment.attorneyProfile.practiceName;
    }

    event.start = new Date(appointment.appointmentStart);
    event.end = new Date(appointment.appointmentEnd);
    event.resourceId = appointment.id;
    event.appointment = appointment;
    return event;
  };

  const onSelectEvent = (values) => {
    setIsAdd(false);
    setFormData((prevState) => {
      const fd = { ...prevState };
      fd.id = values.appointment.id;
      fd.appointmentType = values.appointment.appointmentType.id;
      fd.clientId = values.appointment.client.userId;
      fd.attorneyProfileId = values.appointment.attorneyProfile.id;
      fd.notes = values.appointment.notes;
      fd.appointmentStartDate = format(new Date(values.start), "yyyy-MM-dd");
      fd.appointmentStartTime = format(new Date(values.start), "HH:mm:ss");
      return fd;
    });
  };

  const onSelectSlot = (values) => {
    setIsAdd(true);
    setFormData((prevState) => {
      const fd = { ...prevState, ...defaultFormData };
      fd.appointmentStartDate = format(new Date(values.start), "yyyy-MM-dd");
      if (format(new Date(values.start), "HH:mm:ss") === "00:00:00") {
        fd.appointmentStartTime = "08:00:00";
      } else {
        fd.appointmentStartTime = format(new Date(values.start), "HH:mm:ss");
      }
      return fd;
    });
  };

  useEffect(() => {
    appointmentService
      .getByAttorneyId({
        id: formData.attorneyProfileId,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      })
      .then(onGetByAttorneySuccess)
      .catch(onGetByAttorneyError);
  }, [formData.attorneyProfileId]);

  const handleChange = (id) => {
    setProfileAppts((prevState) => {
      const appt = { ...prevState };
      appt.current = options.attorneyProfiles.find((profile) => {
        return +profile.id === +id;
      });
      return appt;
    });
    appointmentService
      .getByAttorneyId({
        id: id,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      })
      .then(onGetByAttorneySuccess)
      .catch(onGetByAttorneyError);
  };

  const onGetByAttorneySuccess = (response) => {
    setProfileAppts((prevState) => {
      const appt = { ...prevState };
      appt.calendarEvents = response.item.pagedItems.map(mapCalendarEvent);
      return appt;
    });
  };

  const onGetByAttorneyError = () => {
    setProfileAppts((prevState) => {
      const appt = { ...prevState };
      appt.calendarEvents = [];
      return appt;
    });
  };

  const onSearch = (query) => {
    attorneyService
      .getAttorneyBySpecialty(query.trim())
      .then(onGetBySpecialtySuccess)
      .catch(onGetBySpecialtyError);
  };

  const onGetBySpecialtySuccess = (response) => {
    setOptions((prevState) => {
      const fa = { ...prevState };
      fa.filteredOptions = response.items.map(mapSpecialtyResults);
      fa.isFiltered = true;
      return fa;
    });
  };

  const mapSpecialtyResults = (attorneyProfile) => {
    return (
      <option
        value={attorneyProfile.id}
        key={`attorney_specialty_${attorneyProfile.id}`}
      >
        {attorneyProfile.practiceName}
      </option>
    );
  };

  const onGetBySpecialtyError = () => {
    setOptions((prevState) => {
      const fa = { ...prevState };
      fa.isFiltered = false;
      return fa;
    });
  };

  const handleClick = () => {
    navigate("/videochat");
  };

  const onClose = () => {
    setIsAdd(true);
    setFormData((prevState) => {
      const fd = { ...prevState, ...defaultFormData };
      return fd;
    });
  };

  const onSubmit = (values) => {
    if (!isAttorney && values.id !== "") {
      updateAppointment(values);
    } else if (!isAttorney && values.id === "") {
      addAppointment(values);
    } else if (isAttorney && values.id !== "") {
      updateAppointmentAtt(values);
    } else if (isAttorney && values.id === "") {
      addAppointmentAtt(values);
    }
  };

  const addAppointment = (values) => {
    const datetimeStart = addMinutes(
      new Date(`${values.appointmentStartDate}T${values.appointmentStartTime}`),
      -480
    );
    const datetimeEnd = addMinutes(new Date(datetimeStart), 60);
    const payload = {
      appointmentTypeId: parseInt(values.appointmentType),
      clientId: +currentUser.userId,
      attorneyProfileId: parseInt(values.attorneyProfileId),
      notes: values.notes,
      isConfirmed: values.isConfirmed,
      appointmentStart: datetimeStart,
      appointmentEnd: datetimeEnd,
      statusTypesId: parseInt(values.statusTypesId),
    };
    appointmentService
      .addAppointment(payload)
      .then(onAddSuccess)
      .catch(onAddError);
  };

  const onAddSuccess = () => {
    toastr.success("Appointment successfully added", "Schedule Appointment");
    setIsAdd(true);
    setFormData((prevState) => {
      const fd = { ...prevState, ...defaultFormData };
      return fd;
    });
  };

  const onAddError = () => {
    toastr.error("Unable to add appointment.", "Appointment Failure");
  };

  const addAppointmentAtt = (values) => {
    const datetimeStart = addMinutes(
      new Date(`${values.appointmentStartDate}T${values.appointmentStartTime}`),
      -480
    );
    const datetimeEnd = addMinutes(new Date(datetimeStart), 60);
    const payload = {
      appointmentTypeId: +values.appointmentType,
      clientId: +values.clientId,
      attorneyProfileId: +attorneyAppts.current.id,
      notes: values.notes,
      isConfirmed: values.isConfirmed,
      appointmentStart: datetimeStart,
      appointmentEnd: datetimeEnd,
      statusTypesId: +values.statusTypesId,
    };
    appointmentService
      .addAppointment(payload)
      .then(onAddSuccess)
      .catch(onAddError);
  };

  const updateAppointment = (values) => {
    const datetimeStart = addMinutes(
      new Date(`${values.appointmentStartDate}T${values.appointmentStartTime}`),
      -480
    );
    const datetimeEnd = addMinutes(new Date(datetimeStart), 60);
    const payload = {
      id: values.id,
      appointmentTypeId: parseInt(values.appointmentType),
      clientId: parseInt(currentUser.userId),
      attorneyProfileId: parseInt(values.attorneyProfileId),
      notes: values.notes,
      isConfirmed: values.isConfirmed,
      appointmentStart: datetimeStart,
      appointmentEnd: datetimeEnd,
      statusTypesId: parseInt(values.statusTypesId),
    };
    appointmentService
      .updateAppointment(payload)
      .then(onUpdateSuccess)
      .catch(onUpdateError);
  };

  const updateAppointmentAtt = (values) => {
    const datetimeStart = addMinutes(
      new Date(`${values.appointmentStartDate}T${values.appointmentStartTime}`),
      -480
    );
    const datetimeEnd = addMinutes(new Date(datetimeStart), 60);
    const payload = {
      id: values.id,
      appointmentTypeId: parseInt(values.appointmentType),
      clientId: parseInt(values.clientId),
      attorneyProfileId: +attorneyAppts.current.id,
      notes: values.notes,
      isConfirmed: values.isConfirmed,
      appointmentStart: datetimeStart,
      appointmentEnd: datetimeEnd,
      statusTypesId: parseInt(values.statusTypesId),
    };
    appointmentService
      .updateAppointment(payload)
      .then(onUpdateSuccess)
      .catch(onUpdateError);
  };

  const onUpdateSuccess = () => {
    toastr.success("Appointment successfully modified.", "Modify Appointment");
    setIsAdd(true);
    setFormData((prevState) => {
      const fd = { ...prevState, ...defaultFormData };
      return fd;
    });
  };

  const onUpdateError = () => {
    toastr.error("Unable to modify appointment.", "Modify Failure");
  };

  return (
    <>
      <Container className="card card-body">
        <Row>
          <Col className="col-9">
            <Calendar
              localizer={localizer}
              selectable
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              views={["month", "week", "day"]}
              events={
                isAttorney
                  ? attorneyAppts.calendarEvents
                  : clientAppts.calendarEvents
              }
              eventPropGetter={(event) => {
                const backgroundColor = event.allday ? "#20143c" : "#20143c";
                return { style: { backgroundColor } };
              }}
              onSelectEvent={onSelectEvent}
              onSelectSlot={onSelectSlot}
              backgroundEvents={
                profileAppts.calendarEvents && profileAppts.calendarEvents
              }
            />
          </Col>
          <Col className="col-3">
            <Container>
              <Row>
                <h3 className="mx-0 px-0">Get Started</h3>
                <Formik
                  enableReinitialize={true}
                  initialValues={formData}
                  validationSchema={addAppointmentSchema}
                  onSubmit={onSubmit}
                >
                  {(props) => (
                    <Form className="mx-0 px-0">
                      {isAdd && !isAttorney && (
                        <Field
                          type="text"
                          name="query"
                          className="form-control mb-2"
                          placeholder="Enter a Specialty"
                          onChange={(e) => {
                            props.handleChange(e);
                            if (e.currentTarget.value !== "") {
                              onSearch(e.currentTarget.value);
                            } else {
                              onSearch("");
                            }
                          }}
                        ></Field>
                      )}
                      <Field
                        component="select"
                        name={isAttorney ? "clientId" : "attorneyProfileId"}
                        className="form-select mb-2"
                        onChange={(e) => {
                          props.handleChange(e);
                          if (e.currentTarget.value !== "") {
                            handleChange(e.currentTarget.value);
                          } else {
                            handleChange("");
                          }
                        }}
                      >
                        <option value="">
                          Select {isAttorney ? "a Client" : "a Law Firm"}
                        </option>
                        {isAttorney
                          ? options.clientOptions
                          : options.isFiltered
                          ? options.filteredOptions
                          : options.attorneyOptions}
                      </Field>
                      <Field
                        component="select"
                        name="appointmentType"
                        className="form-select mb-2"
                      >
                        <option value="">Select A Way To Meet</option>
                        {options.appointmentTypesOptions}
                      </Field>
                      <Field
                        type="date"
                        name="appointmentStartDate"
                        className="form-control mb-2"
                      ></Field>
                      <Field
                        type="time"
                        name="appointmentStartTime"
                        className="form-control"
                      ></Field>
                      <label htmlFor="notes">Notes</label>
                      <Field
                        component="textarea"
                        name="notes"
                        className="form-control mb-3"
                        rows={4}
                      ></Field>
                      <ErrorMessage
                        name="notes"
                        component="div"
                        className="has-error appt-error-message mb-2"
                      />
                      <Button
                        type="submit"
                        variant="dark"
                        size="sm"
                        className="w-100 mb-3"
                      >
                        {isAdd
                          ? "+ Schedule Appointment"
                          : "Modify Appointment"}
                      </Button>
                      {!isAdd && (
                        <Button
                          type="button"
                          variant="dark"
                          size="sm"
                          onClick={handleClick}
                          className="w-100 mb-3"
                          disabled={
                            formData.appointmentType === 3 ? false : true
                          }
                        >
                          Start Video
                        </Button>
                      )}
                      {!isAdd && (
                        <Button
                          type="button"
                          variant="dark"
                          size="sm"
                          onClick={onClose}
                          className="w-100"
                        >
                          Back
                        </Button>
                      )}
                    </Form>
                  )}
                </Formik>
              </Row>
            </Container>
          </Col>
        </Row>
        <Row>
          {!isAttorney && profileAppts?.current?.practiceName && (
            <AttorneyProfileView attorneyProfile={profileAppts.current} />
          )}
        </Row>
      </Container>
    </>
  );
}

Appointments.propTypes = {
  currentUser: PropTypes.shape({
    avatarUrl: PropTypes.string,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    middleInitial: PropTypes.string,
    userId: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    role: PropTypes.arrayOf(PropTypes.string.isRequired),
  }),
  handleChange: PropTypes.func.isRequired,
};
