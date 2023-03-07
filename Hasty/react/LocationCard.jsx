import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Card, Button } from 'react-bootstrap';
import { FaEllipsisV } from 'react-icons/fa';
import './locations.css';

export default function LocationCard(props) {
  const { location, current, onCard, onEdit, isListings } = props;

  const onCardClicked = () => {
    onCard(location);
  };

  const onEditClicked = () => {
    onEdit(location);
  };

  return (
    <>
      <Container className={current.id === location.id ? 'card-selected' : 'card-highlighted'} onClick={onCardClicked}>
        <Row>
          <Card.Title className="mb-0 float-start">
            {isListings ? location.title : location.locationType.name}
            {!isListings && (
              <Button type="button" variant="link" size="sm" className="my-0 py-0 float-end" onClick={onEditClicked}>
                <FaEllipsisV />
              </Button>
            )}
          </Card.Title>
        </Row>
        <Row>
          <p className="my-0">{isListings ? location.location.lineOne : location.lineOne}</p>
          <p className="my-0">{isListings ? '' : location.lineTwo}</p>
          <p className="my-0">
            {isListings ? location.location.city : location.city},{' '}
            {isListings ? location.location.state.name : location.state.code}{' '}
            {isListings ? location.location.zip : location.zip}
          </p>
        </Row>
        <hr className="mt-2" />
      </Container>
    </>
  );
}

LocationCard.propTypes = {
  location: PropTypes.shape({
    city: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,
    lineOne: PropTypes.string.isRequired,
    lineTwo: PropTypes.string,
    locationType: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    longitude: PropTypes.number.isRequired,
    state: PropTypes.shape({
      code: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    zip: PropTypes.string.isRequired,
    internalName: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    shortDescription: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    bedRooms: PropTypes.number.isRequired,
    baths: PropTypes.number.isRequired,
    housingType: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    accessType: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    listingServices: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    listingAmenities: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    images: PropTypes.arrayOf(
      PropTypes.shape({
        fileId: PropTypes.number.isRequired,
        fileTypeId: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      })
    ),
    guestCapacity: PropTypes.number.isRequired,
    costPerNight: PropTypes.number.isRequired,
    costPerWeek: PropTypes.number.isRequired,
    checkInTime: PropTypes.string.isRequired,
    checkOutTime: PropTypes.string.isRequired,
    daysAvailable: PropTypes.number.isRequired,
    location: PropTypes.shape({
      id: PropTypes.number.isRequired,
      locationType: PropTypes.shape({
        id: PropTypes.number.isRequired,
      }),
      lineOne: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
      zip: PropTypes.string.isRequired,
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
    hasVerifiedOwnerShip: PropTypes.bool.isRequired,
    isActive: PropTypes.bool.isRequired,
    createdBy: PropTypes.number.isRequired,
    dateCreated: PropTypes.string.isRequired,
    dateModified: PropTypes.string.isRequired,
  }).isRequired,
  current: PropTypes.shape({
    city: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,
    lineOne: PropTypes.string.isRequired,
    lineTwo: PropTypes.string,
    locationType: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    longitude: PropTypes.number.isRequired,
    state: PropTypes.shape({
      code: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    zip: PropTypes.string.isRequired,
  }).isRequired,
  setLocations: PropTypes.func.isRequired,
  onCard: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  isListings: PropTypes.bool,
};
