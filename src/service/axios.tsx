import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL ;

export const API = axios.create({
  baseURL,
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
      console.log("Response error:", error.response.data.message);

      if (error.response.status === 401) {
        console.warn("Unauthorized: Logging out user/doctor...");

        // Check role from localStorage
        const userData = localStorage.getItem("user"); 
        const doctorData = localStorage.getItem("doctor");

        if (doctorData) {
			    localStorage.removeItem("doctor");
          console.log("Doctor detected, logging out...");
          
        } else if (userData) {
		      localStorage.removeItem("user");
          console.log("User detected, logging out...");
          
        }

        
      }
    } else {
      console.error("Network or unknown error:", error);
    }

    return Promise.reject(error);
  }
);