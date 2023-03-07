import React from "react";
import PropTypes from "prop-types";
import GoogleMapWMarkers from "components/elements/maps/GoogleMapWMarkers";

export default function AppointmentMap(props) {
  const { location } = props;
  const mapData = {
    initialMap: {
      center: { lat: location.latitude, lng: location.longitude },
      zoom: 10,
    },
    markers: [
      {
        name: "appointment",
        lat: location.latitude,
        lng: location.longitude,
      },
    ],
  };

  return (
    <>
      <ul className="list-unstyled">
        <li>
          <label className="m-0 p-0">Location</label>
        </li>
        <li>
          <label className="m-0 p-0 text-black">
            <div>
              {location.lineOne}, {location.lineTwo}
            </div>
            <div>
              {location.city}, {location.state.name} {location.zip}
            </div>
          </label>
        </li>
      </ul>
      <GoogleMapWMarkers mapData={mapData} />
    </>
  );
}

AppointmentMap.propTypes = {
  location: PropTypes.shape({
    city: PropTypes.string.isRequired,
    createdBy: PropTypes.number,
    dateCreated: PropTypes.string,
    dateModified: PropTypes.string,
    id: PropTypes.number,
    latitude: PropTypes.number,
    lineOne: PropTypes.string.isRequired,
    lineTwo: PropTypes.string.isRequired,
    locationType: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    longitude: PropTypes.number,
    modifiedBy: PropTypes.number,
    state: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    zip: PropTypes.string.isRequired,
  }),
};
