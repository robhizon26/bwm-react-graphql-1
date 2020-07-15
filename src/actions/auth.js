import axiosService from "services/AxiosService";
import { extractApiErrors } from "./index";
const { bwmAxios } = axiosService;

export const registerUser = (registerData) => {
  const { username, email, password, passwordConfirmation } = registerData;
  const requestBody = {
    query: `
      mutation ($username: String!, $email: String!, $password: String!, $passwordConfirmation: String!) {
        register(userInput: {username: $username, email: $email, password: $password,passwordConfirmation: $passwordConfirmation}) {
          username
        }
      }
    `,
    variables: {
      username,
      email,
      password,
      passwordConfirmation,
    },
  };
  return bwmAxios
    .post("/graphql", requestBody)
    .catch((error) => Promise.reject(extractApiErrors(error.response || [])));
};

export const loginUser = (loginData) => {
  const { email, password } = loginData;
  const requestBody = {
    query: `
      query ($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          userId
          token
          tokenExpiration
        }
      }
    `,
    variables: {
      email,
      password,
    },
  };
  return bwmAxios
    .post("/graphql", requestBody)
    .then((res) => {
      return res.data.data.login.token;
    })
    .catch((error) => Promise.reject(extractApiErrors(error.response || [])));
};

export const userAuthenticated = (decodedToken) => {
  return {
    type: "USER_AUTHENTICATED",
    username: decodedToken.username || "",
  };
};
