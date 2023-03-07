import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";
import AppointmentMap from "./AppointmentMap";

export default function AttorneyProfileView(props) {
  const { attorneyProfile } = props;
  const [languages, setLanguages] = useState();

  useEffect(() => {
    if (attorneyProfile.languages) {
      setLanguages(attorneyProfile.languages.map(mapLanguages).toString());
    } else {
      setLanguages([]);
    }
  }, [attorneyProfile]);

  const mapLanguages = (language) => {
    return language.name;
  };
  return (
    <>
      <Container>
        <h3 className="mb-2">Attorney Information</h3>
        <Row>
          <Col className="col-3">
            <ul className="list-unstyled">
              <li>
                <label className="m-0 p-0">Practice Name</label>
              </li>
              <li>
                <label className="m-0 p-0 mb-2 text-black">
                  {attorneyProfile.practiceName}
                </label>
              </li>
              <li>
                <label className="m-0 p-0">Website</label>
              </li>
              <li>
                <label className="m-0 p-0 mb-2 text-black text-break">
                  {attorneyProfile.website}
                </label>
              </li>
              <li>
                <label className="m-0 p-0">Contact</label>
              </li>
              <li>
                <label className="m-0 p-0 mb-2 text-black">
                  {attorneyProfile.phone}
                </label>
              </li>
              {attorneyProfile.email && (
                <li>
                  <label className="m-0 p-0 mb-2 text-black">
                    {attorneyProfile.email}
                  </label>
                </li>
              )}
              <li>
                <label className="m-0 p-0">Languages</label>
              </li>
              <li>
                <label className="m-0 p-0 mb-2 text-black">{languages}</label>
              </li>
            </ul>
          </Col>
          <Col className="col-5">
            <ul className="list-unstyled">
              <li>
                <label className="m-0 p-0">About</label>
              </li>
              <li>
                <label className="m-0 p-0 text-black">
                  {attorneyProfile.bio}
                </label>
              </li>
            </ul>
          </Col>
          <Col className="col-1"></Col>
          <Col className="col-3">
            <AppointmentMap location={attorneyProfile.location} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

AttorneyProfileView.propTypes = {
  attorneyProfile: PropTypes.shape({
    bio: PropTypes.string,
    dateCreated: PropTypes.string,
    dateModified: PropTypes.string,
    email: PropTypes.string,
    id: PropTypes.number.isRequired,
    languages: PropTypes.arrayOf(
      PropTypes.shape({
        code: PropTypes.string,
        id: PropTypes.number,
        name: PropTypes.string,
      })
    ),
    location: PropTypes.shape({
      city: PropTypes.string,
      createdBy: PropTypes.number,
      dateCreated: PropTypes.string,
      dateModified: PropTypes.string,
      id: PropTypes.number,
      latitude: PropTypes.number,
      lineOne: PropTypes.string,
      lineTwo: PropTypes.string,
      locationType: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
      longitude: PropTypes.number,
      modifiedBy: PropTypes.number,
      state: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
      zip: PropTypes.string,
    }),
    phone: PropTypes.string,
    practiceName: PropTypes.string.isRequired,
    website: PropTypes.string,
  }),
};
