import * as Yup from 'yup';

const locationSchema = Yup.object().shape({
    locationTypeId: Yup.number().min(1, 'Must select location type').required('Is Required'),
    lineOne: Yup.string().max(255).required('Address is required'),
    lineTwo: Yup.string().max(255),
    city: Yup.string().max(255).required('City is required'),
    zip: Yup.string().max(50).required('Zip code is required'),
    stateId: Yup.number().min(1, 'Must select state').required('Is Required'),
});

export { locationSchema };
