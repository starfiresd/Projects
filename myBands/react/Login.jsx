import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import { useNavigate, Link } from "react-router-dom";
import toastr from "toastr";
import {
  login,
  getCurrentUser,
  getUserById,
} from "../../services/usersService";

const defaultFormData = {
  email: "",
  password: "",
  tenantId: "U048PHG1VM4",
};

export default function Login(props) {
  const { show } = props;
  const navigate = useNavigate();
  const [formData] = useState(defaultFormData);

  const handleClose = () => {
    props.handleClose();
  };

  const handleSubmit = () => {
    login(formData).then(onLoginSuccess).catch(onLoginError);
  };

  const onLoginError = (response) => {
    toastr.error("Please complete all fields correctly", "Login Failed");
    console.error("onAddUserError", response);
  };

  const onLoginSuccess = () => {
    getCurrentUser().then(onGetCurrentUserSuccess).catch(onGetCurrentUserError);
  };

  const onGetCurrentUserError = (response) => {
    console.error(response);
  };

  const onGetCurrentUserSuccess = (response) => {
    console.log(response, "response logger here");
    let id = response.data.item.id;
    getUserById(id).then(onGetUserByIdSuccess).catch(onGetUserByIdError);
  };

  const onGetUserByIdError = (response) => {
    console.error(response);
  };

  const onGetUserByIdSuccess = (response) => {
    toastr.success("You have signed in successfully", "Login Success");
    let user = response.data.item;
    let payload = {
      id: user.id,
      firstName: user.firstName,
      avatarUrl: user.avatarUrl,
      isLoggedIn: true,
      role: "client",
    };
    const stateForTransport = { type: "LOGIN_VIEW", payload: payload };
    handleClose();
    navigate("/", { state: stateForTransport });
  };
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="modal-style text-white">
          <Modal.Title>
            <div className="container d-inline-block float-left">
              <img
                src="https://wallpaperaccess.com/full/3023972.jpg"
                width="50"
                height="44.44"
                alt="logo"
                className=""
              />
              MySpaceRevamped
            </div>
          </Modal.Title>
          <button
            type="button"
            className="btn-close btn-close-white float-right me-2"
            aria-label="Close"
            onClick={handleClose}
          ></button>
        </Modal.Header>
        <Modal.Body className="modal-style text-white">
          <Formik
            enableReinitialize={true}
            initialValues={formData}
            onSubmit={handleSubmit}
          >
            <Form>
              <div className="container">
                <div className="form-group mb-3">
                  <label htmlFor="email">Email</label>
                  <Field
                    type="text"
                    name="email"
                    className="form-control"
                  ></Field>
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Field
                    type="password"
                    name="password"
                    className="form-control"
                  ></Field>
                </div>
                <br />
                <Button
                  variant="outline-light"
                  onClick={handleSubmit}
                  className="btn-right"
                >
                  Sign In
                </Button>
                <Link
                  to="/register"
                  className="btn-link-theme no-padding style-theme"
                >
                  I forgot my password
                </Link>
                <br />
                <Link
                  to="/register"
                  className="btn-link-theme no-padding style-theme"
                >
                  Register an account
                </Link>
              </div>
            </Form>
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}
