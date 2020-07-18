import axiosService from "services/AxiosService";
import { extractApiErrors } from "./index";
import { reqVerifyRentalOwner, reqFetchRentals, reqFetchUserRentals, reqFetchRentalById, reqCreateRental, reqUpdateRental, reqDeleteRental } from './requestBody';
const { bwmAxios } = axiosService;

export const verifyRentalOwner = rentalId => {
  return bwmAxios
    .post("/graphql", reqVerifyRentalOwner(rentalId))
    .then((res) => res.data.data.verifyUser);
};

export const fetchRentals = location => dispatch => {
  dispatch({ type: "REQUEST_DATA", resource: "rentals" });
  return bwmAxios
    .post("/graphql", reqFetchRentals(location))
    .then((res) => res.data.data.getRentals)
    .then((rentals) => {
      dispatch({ type: "REQUEST_DATA_COMPLETE", resource: "rentals" });
      dispatch({
        type: "FETCH_RENTALS",
        rentals,
      });
    });
};

export const fetchUserRentals = () => dispatch => {
  dispatch({ type: "REQUEST_DATA", resource: "manage-rentals" });
  return bwmAxios
    .post("/graphql", reqFetchUserRentals())
    .then((res) => res.data.data.getUserRentals)
    .then((rentals) => {
      dispatch({
        type: "REQUEST_DATA_COMPLETE",
        data: rentals,
        resource: "manage-rentals",
      });
    });
};

export const fetchRentalById = rentalId => async dispatch => {
  dispatch({ type: "REQUEST_DATA", resource: "rental" });
  bwmAxios
    .post("/graphql", reqFetchRentalById(rentalId))
    .then((res) => res.data.data.getRentalById)
    .then((rental) => {
      dispatch({ type: "REQUEST_DATA_COMPLETE", resource: "rental" });
      dispatch({
        type: "FETCH_RENTAL_BY_ID",
        rental: rental,
      });
    });
};

export const createRental = rental => {
  return bwmAxios.post("/graphql", reqCreateRental(rental));
};

export const updateRental = (id, rentalData) => dispatch => {
  return bwmAxios.post("/graphql", reqUpdateRental(id, rentalData))
    .then((res) => res.data.data.updateRental)
    .then((updatedRental) => {
      dispatch({
        type: "UPDATE_RENTAL_SUCCESS",
        rental: updatedRental,
      });
    })
    .catch((error) => Promise.reject(extractApiErrors(error || [])));
};

export const deleteRental = rentalId => dispatch => {
  const resource = "manage-rentals";
  return bwmAxios
    .post("/graphql", reqDeleteRental(rentalId))
    .then((res) => {
      if (res.data.data.deleteRental) return res.data.data.deleteRental;
      else throw res;
    })
    .then(({ id }) => {
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
