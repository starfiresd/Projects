import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";

export default function Navigation(props) {
  const { firstName, isLoggedIn, avatarUrl } = props;

  const onLoginClicked = () => {
    props.onLogin();
  };

  return (
    <>
      <Navbar className="navbar navbar-expand-md fixed-top colors-theme">
        <Container>
          <Navbar.Collapse>
            <a className="" href="/">
              <img
                src="https://wallpaperaccess.com/full/3023972.jpg"
                width="50"
                height="44.44"
                alt="logo"
              />
            </a>
            <Nav>
              <ul className="navbar-nav ms-auto mb-2 mb-md-0 centered-element">
                <li>
                  <Link
                    to="/events"
                    className="nav-link text-white link-button"
                  >
                    Events
                  </Link>
                </li>
                <li>
                  <Link to="/bands" className="nav-link text-white link-button">
                    Bands
                  </Link>
                </li>
                <li>
                  <Link
                    to="/connections"
                    className="nav-link text-white link-button"
                  >
                    Artists
                  </Link>
                </li>
                <li>
                  <Link
                    to="/venues"
                    className="nav-link text-white link-button"
                  >
                    Venues
                  </Link>
                </li>
              </ul>
            </Nav>
          </Navbar.Collapse>
          <Formik>
            <Form className="d-flex navbar-search-form" role="search">
              <input
                id="searchInput"
                name="query"
                className="form-control me-2"
                style={{ width: "300px" }}
                type="text"
                placeholder="Search myBands"
                aria-label="Search"
                //value={query.query}
                // onChange={onFormFieldChange}
              />
              <button
                id="btnSearch"
                className="btn btn-outline-light me-2"
                type="button"
                //onClick={onSearchButtonClick}
              >
                Search
              </button>
            </Form>
          </Formik>
          {!isLoggedIn && (
            <button
              id="btnLogin"
              className="btn btn-outline-light me-2"
              type="button"
              onClick={onLoginClicked}
            >
              Sign in
            </button>
          )}
          {!isLoggedIn && (
            <button
              id="btnSearch"
              className="btn btn-info"
              type="button"
              //onClick={onSearchButtonClick}
            >
              Join us
            </button>
          )}
          {isLoggedIn && (
            <img
              src={avatarUrl}
              height="40px"
              width="40px"
              alt="avatar"
              className="ms-3 text-white text-decoration-none avartar-circle"
            ></img>
          )}
          {isLoggedIn && (
            <a
              href="/"
              className="ms-2 text-white text-decoration-none fw-bold"
            >
              {firstName}
            </a>
          )}
        </Container>
      </Navbar>
      <br />
      <br />
      <br />
    </>
  );
}
