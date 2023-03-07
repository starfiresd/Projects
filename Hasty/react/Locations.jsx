import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import { LoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import Pagination from 'rc-pagination';
import Header from '../elements/Header';
import LocationForm from './LocationForm';
import LocationCard from './LocationCard';
import locationService from '../../services/locationService';
import listingService from '../../services/listingService';
import './locations.css';

const defaultLocations = {
  isEdit: false,
  locations: [],
  current: {
    city: '',
    id: 0,
    latitude: 0,
    lineOne: '',
    lineTwo: '',
    locationType: {
      id: 0,
      name: '',
    },
    longitude: 0,
    state: {
      code: '',
      id: 0,
      name: '',
    },
    zip: '',
  },
  cards: [],
  markers: [],
  map: {
    mapId: 'locationMap',
    center: { lat: 33.6539499, lng: -117.7474109 },
    zoom: 10,
    mapContainerClassName: 'location-google-map',
  },
};
const defaultPagination = {
  currentPage: 1,
  pageSize: 5,
  totalCount: 0,
};
const defaultHandlers = { response: [], err: [] };
const API_GOOGLE_AUTO_COMPLETE = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const API_GOOGLE_AUTO_COMPLETE_LIBRARIES = 'places';
const mapOptions = {
  disableDefaultUI: false,
};
const crumbsLocations = [
  { name: 'Apps', path: '/apps' },
  { name: 'Locations', path: '/apps/locations' },
];

const crumbsListings = [
  { name: 'Listings', path: '/listings' },
  { name: 'Map', path: '/listings/map' },
];

export default function Locations(props) {
  const { isListings } = props;
  const [locations, setLocations] = useState(defaultLocations);
  const [pagination, setPagination] = useState(defaultPagination);
  const [handlers, setHandlers] = useState(defaultHandlers);

  useEffect(() => {
    if (isListings) {
      listingService
        .getCurrent(pagination.currentPage - 1, pagination.pageSize)
        .then(onGetBySuccess)
        .catch(errHandler);
    } else {
      locationService
        .getByCreatedBy(pagination.currentPage - 1, pagination.pageSize)
        .then(onGetBySuccess)
        .catch(errHandler);
    }
  }, [pagination.currentPage, locations.isEdit]);

  const onGetBySuccess = (response) => {
    setPagination((prevState) => {
      const newPagination = { ...prevState };
      newPagination.totalCount = response.item.totalCount;
      return newPagination;
    });

    setLocations((prevState) => {
      const loc = { ...prevState };
      loc.map.center.lat = response.item.pagedItems[0].latitude;
      loc.map.center.lng = response.item.pagedItems[0].longitude;
      loc.locations = response.item.pagedItems;
      loc.cards = response.item.pagedItems.map(mapCard);
      if (isListings) {
        loc.markers = response.item.pagedItems.map(mapMarkerListing);
      } else {
        loc.markers = response.item.pagedItems.map(mapMarkerLocation);
      }
      return loc;
    });
  };

  useEffect(() => {
    setLocations((prevState) => {
      const loc = { ...prevState };
      loc.cards = locations.locations.map(mapCard);
      if (isListings) {
        loc.markers = locations.locations.map(mapMarkerListing);
      } else {
        loc.markers = locations.locations.map(mapMarkerLocation);
      }
      return loc;
    });
  }, [locations.current]);

  const mapMarkerLocation = (location) => {
    let markerLatLong = {
      lat: location.latitude,
      lng: location.longitude,
    };
    return (
      <Marker key={`markerLocation_${location.id}`} position={markerLatLong} title={location.lineOne}>
        {locations.current.id === location.id && (
          <InfoWindow position={markerLatLong}>
            <div>
              <h6 className="mt-0 mb-1 text-black">{location.locationType.name}</h6>
              <p className="my-0">{location.lineOne}</p>
              <p className="my-0">{`${location.city}, ${location.state.name} ${location.zip}`}</p>
            </div>
          </InfoWindow>
        )}
      </Marker>
    );
  };

  const mapMarkerListing = (location) => {
    let markerLatLong = {
      lat: location.location.latitude,
      lng: location.location.longitude,
    };
    return (
      <Marker key={`markerListing_${location.id}`} position={markerLatLong} title={location.title}>
        {locations.current.id === location.id && (
          <InfoWindow position={markerLatLong}>
            <div>
              <Row>
                {location.images[0].url && (
                  <Col className="col-auto">
                    <img src={location.images[0].url} className="locations-info-img" alt="housing_img" />
                  </Col>
                )}
                <Col>
                  <h6 className="text-black">{location.title}</h6>
                  <p className="my-0">{location.location.lineOne}</p>
                  <p className="my-0">{`${location.location.city}, ${location.location.state.name} ${location.location.zip}`}</p>
                </Col>
                <Col>
                  <div>
                    <br />
                    <br />
                    <p className="my-0">{`Daily Rate: $${location.costPerNight}`}</p>
                    <p className="my-0">{`Type: ${location.housingType.name}`}</p>
                    <p className="my-0">{`Bedroom(s): ${location.bedRooms}`}</p>
                    <p className="my-0">{`Bath(s): ${location.baths}`}</p>
                  </div>
                </Col>
              </Row>
              <br />
              <Row>
                <p className="my-0">{location.description}</p>
              </Row>
            </div>
          </InfoWindow>
        )}
      </Marker>
    );
  };

  const mapCard = (location) => {
    return (
      <LocationCard
        key={`card_${location.id}`}
        location={location}
        current={locations.current}
        onCard={onCard}
        onEdit={onEdit}
        isListings={isListings}
      />
    );
  };

  const onCard = (location) => {
    setLocations((prevState) => {
      const loc = { ...prevState };
      loc.current = location;
      return loc;
    });
  };

  const onEdit = (location) => {
    setLocations((prevState) => {
      const loc = { ...prevState };
      loc.isEdit = true;
      loc.current = location;
      return loc;
    });
  };

  const onChange = (page) => {
    setPagination((prevState) => {
      const newPagination = { ...prevState };
      newPagination.currentPage = page;
      return newPagination;
    });
  };

  const onFormSubmit = (location) => {
    setLocations((prevState) => {
      const loc = { ...prevState };
      loc.isEdit = false;
      loc.current = location;
      return loc;
    });
  };

  const onFormCancel = () => {
    setLocations((prevState) => {
      const loc = { ...prevState };
      loc.isEdit = false;
      loc.current = {};
      return loc;
    });
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
      <Container>
        <Row>
          <Col>
            <Header
              title={isListings ? 'Listings Map' : 'Locations'}
              crumbs={isListings ? crumbsListings : crumbsLocations}
            />
          </Col>
        </Row>
        <div className="card card-body">
          <Row>
            {locations.isEdit && (
              <Col>
                <LocationForm
                  altLocation={locations.current}
                  isShowTitle={true}
                  isShowCancel={true}
                  onCancel={onFormCancel}
                  isShowSubmit={true}
                  onSubmit={onFormSubmit}
                />
              </Col>
            )}
            {!locations.isEdit && <Col>{locations.cards && locations.cards}</Col>}
            <Col className="col-sm-auto"></Col>
            <Col className="col-8">
              <LoadScript googleMapsApiKey={API_GOOGLE_AUTO_COMPLETE} libraries={[API_GOOGLE_AUTO_COMPLETE_LIBRARIES]}>
                <GoogleMap
                  center={locations.map.center}
                  zoom={locations.map.zoom}
                  mapContainerClassName={locations.map.mapContainerClassName}
                  options={mapOptions}>
                  {locations.markers}
                </GoogleMap>
              </LoadScript>
            </Col>
          </Row>
          {!locations.isEdit && (
            <Row>
              <Col>
                {pagination.totalCount > pagination.pageSize && (
                  <Pagination
                    onChange={onChange}
                    current={pagination.currentPage}
                    pageSize={pagination.pageSize}
                    total={pagination.totalCount}
                  />
                )}
              </Col>
            </Row>
          )}
        </div>
      </Container>
      <br />
    </>
  );
}

Locations.propTypes = {
  currentUser: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    lastName: PropTypes.string.isRequired,
    mi: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  }).isRequired,
  isListings: PropTypes.bool,
  listing: PropTypes.shape({
    id: PropTypes.number.isRequired,
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
  }),
};
