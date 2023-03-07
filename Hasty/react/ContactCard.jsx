import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container, Row, Image, Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { FaAt, FaPhone, FaLocationArrow, FaUsers, FaVideo } from 'react-icons/fa';
import Avatar from '../../../assets/images/generic/generic-avatar.jpg';

export default function ContactCard(props) {
  const { currentContact } = props;
  const navigate = useNavigate();

  const onGetVideoChatRm = (e) => {
    e.preventDefault();
    navigate(`/apps/videochat/`);
  };

  return (
    <Card className="chat-card card-body friend-info-card">
      <div className="text-center">
        <Image
          variant="top"
          fluid={true}
          roundedCircle={true}
          thumbnail={true}
          className="object-fit-cover avatar-lg"
          src={currentContact.avatarUrl ? currentContact.avatarUrl : Avatar}
        />
      </div>
      <Card.Title className="text-center">
        {currentContact.firstName ? `${currentContact.firstName} ${currentContact.lastName[0]}` : 'Select a Contact'}
      </Card.Title>
      <div className="text-center">
        <Button
          className="w-60 mb-1"
          variant="secondary"
          onClick={onGetVideoChatRm}
          disabled={props.currentContact?.id ? false : true}>
          <FaVideo /> Video Chat
        </Button>
      </div>
      <Card.Text className="text-center chat-font-smaller">
        {currentContact.id ? 'Last Interacted: 5:30pm' : ''}
      </Card.Text>
      <hr className="w-75 ms-4" />
      <ListGroup className="list-group-flush">
        <Container>
          <Row>
            <p className="mt-2 mb-0">
              <FaAt />
              <strong> Email:</strong>
            </p>
            <p>{currentContact.email ? currentContact.email : 'No email provided'}</p>
            <p className="mt-2 mb-0">
              <FaPhone />
              <strong> Phone Number:</strong>
            </p>
            <p>{currentContact.id ? '+1 555-555-5555' : 'No phone provided'}</p>
            <p className="mt-2 mb-0">
              <FaLocationArrow />
              <strong> Location:</strong>
            </p>
            <p>{currentContact.id ? 'California, USA' : 'No location provided'}</p>
            <p className="mt-2 mb-1">
              <FaUsers />
              <strong> Groups:</strong>
            </p>
            {currentContact.id ? (
              <p>
                <span className="badge badge-info-lighten p-1 font-14 me-1">Work</span>
                <span className="badge badge-info-lighten p-1 font-14 me-1">Friends</span>
              </p>
            ) : (
              <p>No groups assigned</p>
            )}
          </Row>
        </Container>
      </ListGroup>
    </Card>
  );
}

ContactCard.propTypes = {
  currentContact: PropTypes.shape({
    avatarUrl: PropTypes.string,
    dateCreated: PropTypes.string,
    dateModified: PropTypes.string,
    email: PropTypes.string,
    firstName: PropTypes.string,
    id: PropTypes.number,
    isConfirmed: PropTypes.bool,
    lastName: PropTypes.string,
    mi: PropTypes.string,
    statusId: PropTypes.number,
  }),
  onEmail: PropTypes.func.isRequired,
};
