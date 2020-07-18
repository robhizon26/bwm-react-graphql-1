import axiosService from "services/AxiosService";
import { extractApiErrors } from "./index";
import { reqCreateBooking, reqGetBookings, reqFetchUserBookings, reqFetchReceivedBookings, reqDeleteBooking } from './requestBody';
const { bwmAxios } = axiosService;

export const createBooking = booking => {
  return bwmAxios
    .post("/graphql", reqCreateBooking(booking))
    .then((res) => res.data.data.createBooking)
    .catch((error) =>
      Promise.reject(extractApiErrors(error.response || []))
    );
};

export const getBookings = rentalId => {
  return bwmAxios
    .post("/graphql", reqGetBookings(rentalId))
    .then((res) => res.data.data.getBookings);
};

export const fetchUserBookings = () => (dispatch) => {
  dispatch({ type: "REQUEST_DATA", resource: "manage-bookings" });
  return (
    bwmAxios
      .post("/graphql", reqFetchUserBookings())
      .then((res) => res.data.data.getUserBookings)
      .then((bookings) => {
        dispatch({
          type: "REQUEST_DATA_COMPLETE",
          data: bookings,
          resource: "manage-bookings",
        });
      })
  );
};

export const fetchReceivedBookings = () => (dispatch) => {
  dispatch({ type: "REQUEST_DATA", resource: "received-bookings" });
  return (
    bwmAxios
      .post("/graphql", reqFetchReceivedBookings())
      .then((res) => res.data.data.getReceivedBookings)
      .then((bookings) => {
        dispatch({
          type: "REQUEST_DATA_COMPLETE",
          data: bookings,
          resource: "received-bookings",
        });
      })
  );
};

export const deleteBooking = bookingId => (dispatch) => {
  const resource = "manage-bookings";
  return bwmAxios
    .post("/graphql", reqDeleteBooking(bookingId))
    .then((res) => {
      if (res.data.data.deleteBooking) return res.data.data.deleteBooking;
      else throw res;
    })
    .then(({id}) => {
      dispatch({
        type: "DELETE_RESOURCE",
        id,
        resource,
      });
    })
    .catch((error) => {
      dispatch({
        type: "REQUEST_ERROR",
        errors: extractApiErrors(error || []),
        resource,
      });
    });
};
