import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Header from '../../components/elements/Header';
import { SlGraph } from 'react-icons/sl';
import { RiAdminFill } from 'react-icons/ri';
import { BsFillHouseDoorFill, BsFillPersonFill } from 'react-icons/bs';
import { MdMilitaryTech } from 'react-icons/md';
import { AiFillAppstore } from 'react-icons/ai';
import './apps/apps.css';

const defaultDashboards = {
  isAdmin: false,
  isLandlord: false,
  isActiveDuty: false,
  isVeteran: false,
  isCivilian: false,
};

export default function Dashboard(props) {
  const { currentUser } = props;
  const [dashboards, setDashboards] = useState(defaultDashboards);
  const crumbs = [{ name: 'Dashboard', path: '/dashboard' }];

  useEffect(() => {
    setDashboards((prevState) => {
      const dash = { prevState };
      dash.isAdmin = currentUser?.roles?.includes('Admin');
      dash.isLandlord = currentUser?.roles?.includes('Proprietor');
      dash.isActiveDuty = currentUser?.roles?.includes('Active Duty');
      dash.isVeteran = currentUser?.roles?.includes('Veteran');
      dash.isCivilian = currentUser?.roles?.includes('Civilian');
      return dash;
    });
  }, [currentUser]);

  return (
    <>
      <Container>
        <Row>
          <Col>
            <Header title="Dashboards" crumbs={crumbs} />
          </Col>
        </Row>
        <Row>
          <Col>
            {dashboards.isAdmin && (
              <Link to="/dashboard/analytics">
                <Card className="card-highlighted apps-card">
                  <Card.Body>
                    <Card.Title>
                      <SlGraph />
                      {` Analytics`}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Analytics Dashboard</Card.Subtitle>
                    <Card.Text>View site analytics and performance metrics.</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            )}
            {dashboards.isAdmin && (
              <Link to="/dashboard/admin">
                <Card className="card-highlighted apps-card">
                  <Card.Body>
                    <Card.Title>
                      <RiAdminFill />
                      {` Admins`}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Admin Dashboard</Card.Subtitle>
                    <Card.Text>
                      View newsletter subscriptions, user permissions, and more on the admin dashboard.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            )}
            {dashboards.isLandlord && (
              <Link to="/dashboard/landlord">
                <Card className="card-highlighted apps-card">
                  <Card.Body>
                    <Card.Title>
                      <BsFillHouseDoorFill />
                      {` Landlords`}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Landlord Dashboard</Card.Subtitle>
                    <Card.Text>
                      View your top listings, see upcoming tenant reservations, and manage your files on the landlord
                      dashboard.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            )}
            {(dashboards.isActiveDuty || dashboards.isVeteran) && (
              <Link to="/dashboard/military">
                <Card className="card-highlighted apps-card">
                  <Card.Body>
                    <Card.Title>
                      <MdMilitaryTech />
                      {` Military`}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Military Dashboard</Card.Subtitle>
                    <Card.Text>
                      Check your appointments for viewings, browse listings, and get prepared for your upcoming change
                      in duty station.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            )}
            {dashboards.isCivilian && (
              <Link to="/dashboard/civilian">
                <Card className="card-highlighted apps-card">
                  <Card.Body>
                    <Card.Title>
                      <BsFillPersonFill />
                      {` Civilians`}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Civilian Dashboard</Card.Subtitle>
                    <Card.Text>
                      Check your appointments for viewings, browse listings, and find your next home.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            )}
          </Col>
          <Col>
            <Link to="/apps">
              <Card className="card-highlighted apps-card">
                <Card.Body>
                  <Card.Title>
                    <AiFillAppstore />
                    {` Apps`}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Apps</Card.Subtitle>
                  <Card.Text>Checkout all your apps like video chat or your file manager.</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
}

Dashboard.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    mi: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  }).isRequired,
};
