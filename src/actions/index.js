
import axiosService from 'services/AxiosService';
const { bwmAxios } = axiosService;

export const uploadImage = image => {
  const formData = new FormData();
  formData.append('image', image);

  return bwmAxios.post('/image-upload', formData)
    .then(res => res.data)
}

export const extractApiErrors = (resError) => {
  let errors = [{title: 'Error!', detail: 'Ooops, something went wrong!'}];
  if (resError && resError.data && resError.data.errors) {
    errors =  [{title: 'Error!', detail: resError.data.errors[0].message}];   
  }
  return errors;
}

export * from './auth';
export * from './rentals';
export * from './bookings';
