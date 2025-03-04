import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:5000", 
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const verificationToken = localStorage.getItem("verificationToken");

    if (verificationToken) {
      config.headers["the-verify-token"] = verificationToken;
    }
    return config;
  },
  (error) => {
    console.log(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log(error.response.data.message);
    } else {
      console.log(error);
    }
    return Promise.reject(error);
  }
);
