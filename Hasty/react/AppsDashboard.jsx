import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Header from '../../../components/elements/Header';
import { FaComment, FaVideo, FaBlog, FaPodcast, FaMap, FaFolder } from 'react-icons/fa';
import '../apps/apps.css';

const defaultDashboards = {
  isAdmin: false,
  isLandlord: false,
  isActiveDuty: false,
  isVeteran: false,
  isCivilian: false,
};

export default function AppsDashboard(props) {
  const { currentUser } = props;
  const [dashboards, setDashboards] = useState(defaultDashboards);
  const crumbs = [{ name: 'Apps', path: '/apps' }];

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
            <Header title="Apps" crumbs={crumbs} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Link to="/blogs/list">
              <Card className="card-highlighted apps-card">
                <Card.Body>
                  <Card.Title>
                    <FaBlog />
                    {` Read More`}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Blogs</Card.Subtitle>
                  <Card.Text>Get the latest content right at your fingertips.</Card.Text>
                </Card.Body>
              </Card>
            </Link>
            <Link to="/podcast">
              <Card className="card-highlighted apps-card">
                <Card.Body>
                  <Card.Title>
                    <FaPodcast />
                    {` Get Listening`}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Podcasts</Card.Subtitle>
                  <Card.Text>Listen to experts in finding a new home.</Card.Text>
                </Card.Body>
              </Card>
            </Link>
            <Link to="/apps/chat">
              <Card className="card-highlighted apps-card">
                <Card.Body>
                  <Card.Title>
                    <FaComment />
                    {` Start Talking`}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Chat</Card.Subtitle>
                  <Card.Text>Start chatting with our online messenger.</Card.Text>
                </Card.Body>
              </Card>
            </Link>
            <Link to="/apps/videochat">
              <Card className="card-highlighted apps-card">
                <Card.Body>
                  <Card.Title>
                    <FaVideo />
                    {` Meet Online`}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Video Chat</Card.Subtitle>
                  <Card.Text>When you are ready to take the next step and setup a virtual meeting.</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
          <Col>
            <Link to="/apps/locations">
              <Card className="card-highlighted apps-card">
                <Card.Body>
                  <Card.Title>
                    <FaMap />
                    {` My Locations`}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Locations</Card.Subtitle>
                  <Card.Text>See all your locations in one place.</Card.Text>
                </Card.Body>
              </Card>
            </Link>
            {dashboards.isAdmin && (
              <Link to="/apps/file">
                <Card className="card-highlighted apps-card">
                  <Card.Body>
                    <Card.Title>
                      <FaFolder />
                      {` Manage Content`}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">File Manager</Card.Subtitle>
                    <Card.Text>Review all your images and files for your account.</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

AppsDashboard.propTypes = {
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
