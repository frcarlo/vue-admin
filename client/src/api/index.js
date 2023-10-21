import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.DEV
    ? import.meta.env.VITE_DEV_BASE_URL
    : import.meta.env.BASE_URL,
});

instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log("here", error.response?.status);

    return Promise.reject(error);
  },
);

export default instance;
