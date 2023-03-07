// @flow
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Collapse, Navbar as NavBar, Nav, NavDropdown, Container, Button, Image } from 'react-bootstrap';
//import classNames from 'classnames';
import PropTypes from 'prop-types';
import AppMenu from './Menu';
import { getMenuItems } from '../../helpers/menu';
import swal from 'sweetalert2';
import Logo from '../../assets/images/hastylogo.png';
import Avatar from '../../assets/images/generic/generic-avatar.jpg';
import * as userService from '../../services/userService';

const defaultHandlers = { response: [], err: [] };

const Navbar = (props) => {
  const { currentUser } = props;
  const navigate = useNavigate();
  const [handlers, setHandlers] = useState(defaultHandlers);

  const onClick = () => {
    userService.logout().then(onLogoutSuccess).catch(errHandler);
  };

  const onLogoutSuccess = () => {
    currentUser.isLoggedIn = false;
    swal.fire('Hooray!', 'Logout Successful!', 'success', {
      button: 'Ok',
    });
    navigate('/login');
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
      <NavBar collapseOnSelect expand="md" variant="dark" className="hasty-topnav">
        <Container>
          <Collapse in={props.isMenuOpened} className="navbar-collapse" id="topnav-menu-content">
            <div>
              <Link to="/">
                <img src={Logo} alt="hasty-logo-navigate-home" height="40" className="ms-3 me-5" />
              </Link>
              <AppMenu menuItems={getMenuItems()} {...props} />
              <Nav variant="dark" className="ms-auto align-items-center">
                {!currentUser.hasPlan &&
                  (currentUser?.roles?.includes('Admin') || currentUser?.roles?.includes('Proprietor')) &&
                  currentUser.isLoggedIn && (
                    <Link to="/pricing">
                      <Button type="button" variant="warning" className="float-end me-3">
                        Upgrade
                      </Button>
                    </Link>
                  )}
                {currentUser?.isLoggedIn && (
                  <Image
                    variant="top"
                    fluid={true}
                    roundedCircle={true}
                    thumbnail={true}
                    className="navbar-object-fit-cover avatar-sm"
                    src={currentUser.avatarUrl ? currentUser.avatarUrl : Avatar}
                  />
                )}
                {currentUser?.isLoggedIn && (
                  <NavDropdown id="nav-dropdown-public" title={`${currentUser.firstName}`} className="me-2">
                    <NavDropdown.Item href="/dashboard" className="mt-1 mb-0 py-0">
                      Dashboards
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/apps" className="my-0 py-0">
                      Apps
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/profile" className="my-0 py-0">
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/profile" className="my-0 py-0">
                      Settings
                    </NavDropdown.Item>
                    <NavDropdown.Divider className="my-1" />
                    <NavDropdown.Item href="/login">
                      <Link to="/login" type="link" size="small" className="btn btn-secondary me-2" onClick={onClick}>
                        Logout
                      </Link>
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </Nav>
            </div>
          </Collapse>
        </Container>
      </NavBar>
    </>
  );
};
Navbar.propTypes = {
  currentUser: PropTypes.shape({
    isLoggedIn: PropTypes.bool.isRequired,
    avatarUrl: PropTypes.string,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    hasPlan: PropTypes.bool.isRequired,
  }).isRequired,
  isMenuOpened: PropTypes.bool,
};
export default Navbar;
