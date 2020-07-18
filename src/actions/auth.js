import axiosService from "services/AxiosService";
import { extractApiErrors } from "./index";
import { reqRegisterUser, reqLoginUser } from './requestBody';
const { bwmAxios } = axiosService;

export const registerUser = registerData => {
  return bwmAxios
    .post("/graphql", reqRegisterUser(registerData))
    .catch((error) => Promise.reject(extractApiErrors(error.response || [])));
};

export const loginUser = loginData => {
  return bwmAxios
    .post("/graphql", reqLoginUser(loginData))
    .then((res) => {
      return res.data.data.login.token;
    })
    .catch((error) => Promise.reject(extractApiErrors(error.response || [])));
};

export const userAuthenticated = decodedToken => {
  return {
    type: "USER_AUTHENTICATED",
    username: decodedToken.username || "",
  };
};
