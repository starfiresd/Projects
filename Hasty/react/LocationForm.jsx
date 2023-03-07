import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import toastr from 'toastr';
import { LoadScript, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { locationSchema } from '../../schemas/locationSchema';
import lookUpService from '../../services/lookUpService';
import locationService from '../../services/locationService';
import './locations.css';

const defaultLocation = {
  id: 0,
  locationTypeId: 0,
  lineOne: '',
  lineTwo: '',
  city: '',
  stateId: 0,
  zip: '',
  latitude: 0,
  longitude: 0,
};
const defaultMapData = {
  initialMap: {
    center: { lat: 33.6539499, lng: -117.7474109 },
    zoom: 10,
  },
  markers: [],
  mapContainerClassName: 'location-google-map-small',
};
const defaultOptions = { states: [], statesComponents: [], locationTypesComponents: [] };
const defaultHandlers = { response: [], err: [] };
const API_GOOGLE_AUTO_COMPLETE = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const API_GOOGLE_AUTO_COMPLETE_LIBRARIES = 'places';
const mapOptions = {
  disableDefaultUI: false,
};

export default function LocationForm(props) {
  const {
    altLocation,
    isShowGoogleMaps,
    isShowTitle,
    titleText,
    isShowClear,
    onClear,
    isShowCancel,
    cancelText,
    onCancel,
    isShowSubmit,
    onSubmit,
    isAllowAutoUpdate,
  } = props;
  const [location, setLocation] = useState(defaultLocation);
  const [options, setOptions] = useState(defaultOptions);
  const [autoComplete, setAutoComplete] = useState({});
  const [mapData, setMapData] = useState(defaultMapData);
  const [handlers, setHandlers] = useState(defaultHandlers);

  useEffect(() => {
    lookUpService.LookUp(['States', 'LocationTypes']).then(onLookUpSuccess).catch(errHandler);
  }, []);

  const onLookUpSuccess = (response) => {
    setOptions((prevState) => {
      const options = { ...prevState };
      options.states = response.item.states;
      options.statesComponents = response.item.states.map(mapStateOption);
      options.locationTypesComponents = response.item.locationTypes.map(mapLocationTypeOption);
      return options;
    });
  };

  const mapStateOption = (state) => {
    return (
      <option key={state.id} value={state.id}>
        {state.name}
      </option>
    );
  };

  const mapLocationTypeOption = (locationType) => {
    return (
      <option key={locationType.id} value={locationType.id}>
        {locationType.name}
      </option>
    );
  };

  const handleChange = (property, value) => {
    if (altLocation) {
      altLocation[property] = value;
    } else {
      setLocation((prevState) => {
        const loc = { ...prevState };
        loc[property] = value;
        return loc;
      });
    }
  };

  const onLoad = (autocomplete) => {
    setAutoComplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autoComplete) {
      const address = autoComplete.getPlace().address_components;
      const lat = autoComplete.getPlace().geometry.location.lat();
      const lng = autoComplete.getPlace().geometry.location.lng();
      if (altLocation) {
        altLocation.lineOne = `${address[0]?.long_name} ${address[1]?.long_name}`;
        altLocation.city = address[3]?.long_name;
        altLocation.stateId = options.states.find(
          (state) => state.name === address[5]?.short_name || state.name === address[4]?.short_name
        ).id;
        altLocation.zip = address[7]?.long_name;
        altLocation.latitude = lat;
        altLocation.longitude = lng;
      } else {
        setLocation((prevState) => {
          const loc = { ...prevState };
          loc.lineOne = `${address[0]?.long_name} ${address[1]?.long_name}`;
          loc.city = address[3]?.long_name;
          loc.stateId = options.states.find(
            (state) => state.name === address[5]?.short_name || state.name === address[4]?.short_name
          ).id;
          loc.zip = address[7]?.long_name;
          loc.latitude = lat;
          loc.longitude = lng;
          return loc;
        });
      }
      setMapData((prevState) => {
        const map = { ...prevState };
        map.initialMap.center.lat = lat;
        map.initialMap.center.lng = lng;
        map.markers = [
          <Marker
            key={`marker`}
            position={{ lat: lat, lng: lng }}
            title={`${address[0].long_name} ${address[1].long_name}`}
          />,
        ];
        return map;
      });
    }
  };

  const onClearClicked = () => {
    if (autoComplete?.getPlace()?.address_components) {
      setAutoComplete({});
    }

    if (altLocation) {
      altLocation.locationTypeId = defaultLocation.locationTypeId;
      altLocation.lineOne = defaultLocation.lineOne;
      altLocation.lineTwo = defaultLocation.lineTwo;
      altLocation.city = defaultLocation.city;
      altLocation.stateId = defaultLocation.stateId;
      altLocation.zip = defaultLocation.zip;
      altLocation.latitude = defaultLocation.latitude;
      altLocation.longitude = defaultLocation.longitude;
    } else {
      setLocation((prevState) => {
        const loc = { ...prevState };
        loc.locationTypeId = defaultLocation.locationTypeId;
        loc.lineOne = defaultLocation.lineOne;
        loc.lineTwo = defaultLocation.lineTwo;
        loc.city = defaultLocation.city;
        loc.stateId = defaultLocation.stateId;
        loc.zip = defaultLocation.zip;
        loc.latitude = defaultLocation.latitude;
        loc.longitude = defaultLocation.longitude;
        return loc;
      });
    }
    onClear();
  };

  const onCancelClicked = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const onSubmitClicked = (values) => {
    if (altLocation?.id && altLocation?.id !== 0) {
      location.id = +altLocation.id;
      values.id = +altLocation.id;
      locationService
        .update(+altLocation.id, values)
        .then(onSubmitSuccess)
        .catch(onSubmitError);
    } else if (location.id !== 0) {
      values.id = +location.id;
      locationService
        .update(+location.id, values)
        .then(onSubmitSuccess)
        .catch(onSubmitError);
    } else {
      locationService.add(values).then(onSubmitSuccess).catch(onSubmitError);
    }
  };

  const onSubmitSuccess = (response) => {
    toastr.success('Location successfully added or updated.', 'Location Added or Updated');
    if (altLocation && altLocation?.id > 0) {
      locationService.getById(altLocation.id).then(onGetByIdSuccess).catch(errHandler);
    } else if (location.id > 0) {
      locationService.getById(location.id).then(onGetByIdSuccess).catch(errHandler);
    } else {
      locationService.getById(response.item).then(onGetByIdSuccess).catch(errHandler);
    }
  };

  const onSubmitError = () => {
    toastr.error('Location not added or updated.', 'Location Add/Update Failure');
  };

  const onGetByIdSuccess = (response) => {
    if (isAllowAutoUpdate) {
      if (altLocation) {
        altLocation.id = response.item.id;
        setLocation((prevState) => {
          const loc = { ...prevState };
          loc.id = response.item.id;
          return loc;
        });
      } else {
        setLocation((prevState) => {
          const loc = { ...prevState };
          loc.id = response.item.id;
          return loc;
        });
      }
    } else {
      setAutoComplete({});
      if (altLocation) {
        altLocation.id = defaultLocation.id;
        altLocation.locationTypeId = defaultLocation.locationTypeId;
        altLocation.lineOne = defaultLocation.lineOne;
        altLocation.lineTwo = defaultLocation.lineTwo;
        altLocation.city = defaultLocation.city;
        altLocation.stateId = defaultLocation.stateId;
        altLocation.zip = defaultLocation.zip;
        altLocation.latitude = defaultLocation.latitude;
        altLocation.longitude = defaultLocation.longitude;
        setLocation((prevState) => {
          const loc = { ...prevState, ...defaultLocation };
          return loc;
        });
      } else {
        setLocation((prevState) => {
          const loc = { ...prevState, ...defaultLocation };
          return loc;
        });
      }
    }
    onSubmit(response.item);
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
      {isShowTitle && (
        <Row>
          <h4>
            {titleText
              ? titleText
              : (altLocation?.id && altLocation?.id !== 0) || (location?.id && location?.id !== 0)
              ? 'Change Location'
              : 'New Location'}
          </h4>
        </Row>
      )}
      {((altLocation && altLocation.lineOne === '') || (!altLocation && location.lineOne === '')) && (
        <Row>
          <Col>
            {window.google === undefined ? (
              <LoadScript googleMapsApiKey={API_GOOGLE_AUTO_COMPLETE} libraries={[API_GOOGLE_AUTO_COMPLETE_LIBRARIES]}>
                <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
                  <input type="text" name="autocomplete" className="form-control" placeholder="Address" />
                </Autocomplete>
              </LoadScript>
            ) : (
              <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
                <input type="text" name="autocomplete" className="form-control" placeholder="Address" />
              </Autocomplete>
            )}
          </Col>
        </Row>
      )}
      <Formik
        enableReinitialize={true}
        initialValues={altLocation ? altLocation : location}
        validationSchema={locationSchema}
        onSubmit={onSubmitClicked}>
        {(props) => (
          <Form>
            <Row>
              <Col>
                {((altLocation && altLocation.lineOne !== '') || (!altLocation && location.lineOne !== '')) && (
                  <Row>
                    <Col>
                      <Field
                        type="text"
                        name="lineOne"
                        className="form-control"
                        placeholder="Address"
                        onChange={(e) => {
                          props.handleChange(e);
                          handleChange('lineOne', e.currentTarget.value);
                        }}
                      />
                      <ErrorMessage name="lineOne" component="div" className="location-error-message" />
                    </Col>
                  </Row>
                )}
                <Row>
                  <Col>
                    <Field
                      type="text"
                      name="lineTwo"
                      className="form-control mt-2"
                      placeholder="Suite/Apt #"
                      onChange={(e) => {
                        props.handleChange(e);
                        handleChange('lineTwo', e.currentTarget.value);
                      }}
                    />
                    <ErrorMessage name="lineTwo" component="div" className="location-error-message" />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Field
                      type="text"
                      name="city"
                      className="form-control mt-2"
                      placeholder="City"
                      onChange={(e) => {
                        props.handleChange(e);
                        handleChange('city', e.currentTarget.value);
                      }}
                    />
                    <ErrorMessage name="city" component="div" className="location-error-message" />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Field
                      component="select"
                      name="stateId"
                      className="form-select mt-2"
                      onChange={(e) => {
                        props.handleChange(e);
                        handleChange('stateId', e.currentTarget.value);
                      }}>
                      <option value="">State</option>
                      {options.statesComponents.length > 0 && options.statesComponents}
                    </Field>
                    <ErrorMessage name="stateId" component="div" className="location-error-message" />
                  </Col>
                  <Col>
                    <Field
                      type="text"
                      name="zip"
                      className="form-control mt-2"
                      placeholder="Zip Code"
                      onChange={(e) => {
                        props.handleChange(e);
                        handleChange('zip', e.currentTarget.value);
                      }}
                    />
                    <ErrorMessage name="zip" component="div" className="location-error-message" />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Field
                      component="select"
                      name="locationTypeId"
                      className="form-select mt-2"
                      onChange={(e) => {
                        props.handleChange(e);
                        handleChange('locationTypeId', e.currentTarget.value);
                      }}>
                      <option value="">Type</option>
                      {options.locationTypesComponents.length > 0 && options.locationTypesComponents}
                    </Field>
                    <ErrorMessage name="locationTypeId" component="div" className="location-error-message" />
                  </Col>
                </Row>
              </Col>
              {isShowGoogleMaps &&
                ((altLocation && altLocation.lineOne !== '') || (!altLocation && location.lineOne !== '')) && (
                  <Col className="col-auto">
                    <LoadScript
                      googleMapsApiKey={API_GOOGLE_AUTO_COMPLETE}
                      libraries={[API_GOOGLE_AUTO_COMPLETE_LIBRARIES]}>
                      <GoogleMap
                        center={mapData.initialMap.center}
                        zoom={mapData.initialMap.zoom}
                        mapContainerClassName={mapData.mapContainerClassName}
                        options={mapOptions}>
                        {mapData.markers}
                      </GoogleMap>
                    </LoadScript>
                  </Col>
                )}
            </Row>
            <Row>
              <Col>
                {isShowClear && (
                  <Button
                    type="reset"
                    variant="outline-secondary"
                    className="float-start mt-2"
                    onClick={onClearClicked}>
                    Clear
                  </Button>
                )}
                {isShowSubmit && (
                  <Button type="submit" variant="secondary" className="float-end mt-2 ms-1">
                    Submit
                  </Button>
                )}
                {isShowCancel && (
                  <Button type="button" variant="danger" className="float-end mt-2" onClick={onCancelClicked}>
                    {cancelText ? cancelText : 'Cancel'}
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  );
}

LocationForm.propTypes = {
  altLocation: PropTypes.shape({
    id: PropTypes.number,
    locationTypeId: PropTypes.number,
    lineOne: PropTypes.string,
    lineTwo: PropTypes.string,
    city: PropTypes.string,
    stateId: PropTypes.number,
    zip: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
  isShowGoogleMaps: PropTypes.bool,
  isShowTitle: PropTypes.bool,
  titleText: PropTypes.string,
  isShowClear: PropTypes.bool,
  onClear: PropTypes.func,
  isShowCancel: PropTypes.bool,
  cancelText: PropTypes.string,
  onCancel: PropTypes.func,
  isShowSubmit: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  isAllowAutoUpdate: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  isValid: PropTypes.bool,
};
