import axiosService from "services/AxiosService";
import {  extractApiErrors } from "./index";
const { bwmAxios } = axiosService;

export const verifyRentalOwner = (rentalId) => {
  const requestBody = {
    query: `
      query ($rentalId: String!) {
        verifyUser(rentalId: $rentalId) {
          status
        }
      }
    `,
    variables: {
      rentalId,
    },
  };
  return bwmAxios
    .post("/graphql", requestBody)
    .then((res) => res.data.data.verifyUser);
};

export const fetchRentals = (location) => (dispatch) => {
  dispatch({ type: "REQUEST_DATA", resource: "rentals" });
  const requestBody = {
    query: `
      query ($city: String!) {
        getRentals(city: $city) {
          category
          city
          dailyPrice
          image
          {
            url
          }
          shared
          title
          _id
        }
      }
    `,
    variables: {
      city: location || "",
    },
  };
  return bwmAxios
    .post("/graphql", requestBody)
    .then((res) => res.data.data.getRentals)
    .then((rentals) => {
      dispatch({ type: "REQUEST_DATA_COMPLETE", resource: "rentals" });
      dispatch({
        type: "FETCH_RENTALS",
        rentals,
      });
    });
};

export const fetchUserRentals = () => (dispatch) => {
  dispatch({ type: "REQUEST_DATA", resource: "manage-rentals" });
  const requestBody = {
    query: `
      query  {
        getUserRentals {
          category
          city
          dailyPrice
          image
          {
            url
          }
          shared
          title
          _id
        }
      }
    `,
  };
  return bwmAxios
    .post("/graphql", requestBody)
    .then((res) => res.data.data.getUserRentals)
    .then((rentals) => {
      dispatch({
        type: "REQUEST_DATA_COMPLETE",
        data: rentals,
        resource: "manage-rentals",
      });
    });
};

export const fetchRentalById = (rentalId) => async (dispatch) => {
  dispatch({ type: "REQUEST_DATA", resource: "rental" });
  const requestBody = {
    query: `
    query ($rentalId: String!) {
      getRentalById(rentalId: $rentalId) {
          category
          city
          dailyPrice
          description
          image
          {
            url
          }
          numOfRooms
          shared
          street
          title
          _id
        }
      }
    `,
    variables: {
      rentalId,
    },
  };
  bwmAxios
    .post("/graphql", requestBody)
    .then((res) => res.data.data.getRentalById)
    .then((rental) => {
      dispatch({ type: "REQUEST_DATA_COMPLETE", resource: "rental" });
      dispatch({
        type: "FETCH_RENTAL_BY_ID",
        rental: rental,
      });
    });
};

export const createRental = (rental) => {
  const {
    title,
    city,
    street,
    category,
    numOfRooms,
    description,
    dailyPrice,
    shared,
    image,
  } = rental;
  const requestBody = {
    query: `
      mutation ($title: String!, $city: String!, $street: String!, $category: String!, $numOfRooms: Int!, $description: String!, $dailyPrice: Float!, $shared: Boolean, $image: String!)  {
        createRental(createRentalInput:{title: $title, city: $city, street: $street, category: $category, numOfRooms: $numOfRooms, description: $description, dailyPrice: $dailyPrice, shared: $shared, image: $image}) {
          _id
        }
      }
    `,
    variables: {
      title,
      city,
      street,
      category,
      numOfRooms: +numOfRooms,
      description,
      dailyPrice: +dailyPrice,
      shared:!!shared,
      image,
    },
  };
  return bwmAxios.post("/graphql", requestBody);
};

export const updateRental = (id, rentalData) => (dispatch) => {
  const {
    title,
    city,
    street,
    category,
    numOfRooms,
    description,
    dailyPrice,
    shared,
    image
  } = rentalData;
  const requestBody = {
    query: `
    mutation ($rentalId: String! $title: String, $city: String, $street: String, $category: String, $numOfRooms: Int, $description: String, $dailyPrice: Float, $shared: Boolean, $image: String)  {
      updateRental(updateRentalInput:{rentalId:$rentalId, title: $title, city: $city, street: $street, category: $category, numOfRooms: $numOfRooms, description: $description, dailyPrice: $dailyPrice, shared: $shared, image: $image}) {
          category
          city
          dailyPrice
          description
          image
          {
            url
          }
          numOfRooms
          shared
          street
          title
          _id
        }
      }
    `,
    variables: {
      rentalId:id,
      title,
      city,
      street,
      category,
      numOfRooms: +numOfRooms,
      description,
      dailyPrice: +dailyPrice,
      shared:!!shared,
      image:image&&image._id,
    },
  };
  return bwmAxios.post("/graphql", requestBody)
    .then((res) => res.data.data.updateRental)
    .then((updatedRental) => {
      // console.log(updatedRental);
      dispatch({
        type: "UPDATE_RENTAL_SUCCESS",
        rental: updatedRental,
      });
    })
    .catch((error) => Promise.reject(extractApiErrors(error  || [])));
};

export const deleteRental = (rentalId) => (dispatch) => {
  const resource = "manage-rentals";
  const requestBody = {
    query: `
    mutation ($rentalId: String!) {
      deleteRental(rentalId: $rentalId) {
          id
        }
      }
    `,
    variables: {
      rentalId,
    },
  };
  return bwmAxios
    .post("/graphql", requestBody)
    .then((res) => {
      if (res.data.data.deleteRental) return res.data.data.deleteRental;
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
