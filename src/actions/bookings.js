import axiosService from "services/AxiosService";
import { extractApiErrors } from "./index";
const { bwmAxios } = axiosService;

export const createBooking = (booking) => {
  const { startAt, endAt, guests, nights, price, rental } = booking;
  const requestBody = {
    query: `
      mutation ($startAt: String!, $endAt: String!, $guests: Int!, $nights: Int!, $price: Float!, $rentalId: String! ) {
        createBooking(createBookingInput: {startAt: $startAt, endAt: $endAt, guests: $guests, nights: $nights, price: $price, rentalId: $rentalId}) {
          startAt
          endAt
        }
      }
    `,
    variables: {
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      guests,
      nights,
      price,
      rentalId: rental._id,
    },
  };
  return bwmAxios
    .post("/graphql", requestBody)
    .then((res) => res.data.data.createBooking)
    .catch((error) =>
      Promise.reject(extractApiErrors(error.response || []))
    );
};

export const getBookings = (rentalId) => {
  const requestBody = {
    query: `
      query ($rentalId: String!) {
        getBookings(rentalId: $rentalId) {
          startAt
          endAt
        }
      }
    `,
    variables: {
      rentalId,
    },
  };
  return bwmAxios
    .post("/graphql", requestBody)
    .then((res) => res.data.data.getBookings);
};

export const fetchUserBookings = () => (dispatch) => {
  const requestBody = {
    query: `
      query {
        getUserBookings{
          createdAt
          startAt
          endAt
          nights
          guests
          price
          rental{
            title
            city
            _id
          }
          _id
        }
      }
    `,
  };

  dispatch({ type: "REQUEST_DATA", resource: "manage-bookings" });
  return (
    bwmAxios
      .post("/graphql", requestBody)
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
  const requestBody = {
    query: `
      query {
        getReceivedBookings{
          createdAt
          startAt
          endAt
          nights
          guests
          price
          rental{
            title
            city
            _id
          }
          user{
            username
          }
          _id
        }
      }
    `,
  };

  dispatch({ type: "REQUEST_DATA", resource: "received-bookings" });
  return (
    bwmAxios
      .post("/graphql", requestBody)
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

export const deleteBooking = (bookingId) => (dispatch) => {
  const resource = "manage-bookings";
  const requestBody = {
    query: `
    mutation ($bookingId: String!) {
        deleteBooking(bookingId: $bookingId) {
          id
        }
      }
    `,
    variables: {
      bookingId,
    },
  };
  return bwmAxios
    .post("/graphql", requestBody)
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
