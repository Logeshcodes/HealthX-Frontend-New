import { API } from "../../service/axios";

import UserRouters from "../../@types/endPoints/userEndPoints";




  export const getUserData = async (email: string | null): Promise<any> => {
    try {
      const response = await API.get(`${UserRouters.getUserData}${email}`,{ withCredentials : true });
      console.log(response,"datA")
      return response?.data;

    } catch (error) {
      console.log(error);
    }
  };

   // For Doctor Details Page

  export const getDoctorDetails = async (email: string | null): Promise<any> => {
    try {
      const response = await API.get(`${UserRouters.getDoctorDetails}${email}`,{ withCredentials : true });
      console.log(response,"datA")
      return response?.data;

    } catch (error) {
      console.log(error);
    }
  };



  // doctor filter - user side 


export const getDepartmentData = async (): Promise<any> => {
  try {
    const response = await API.get(UserRouters.Get_All_Department ,{ withCredentials : true });

    console.log(response.data, "response resendOtp");
    return response.data;
  } catch (error) {
    throw error;
  }
};



  export const updateProfile = async (formData: FormData): Promise<any> => {
    try {
      console.log("Inside updateProfile API call       " , formData);
  
      const response = await API.post(UserRouters.updateProfile, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      console.log(response.data.user, "updateProfile response");
      return response?.data;
    } catch (error) {
      console.error("Error in updateProfile API call:", error);
    }
  };
  
  export const updatePassword = async (data: any): Promise<any> => {
    try {
      const response = await API.put(UserRouters.updatePassword, data, { withCredentials: true });
      console.log(response,"response updatePassword")
      return response.data;
    } catch (error) {
      console.error("Error in updateProfile API call:", error);
    }
  };

  // Show all doctor data in userSide
 

  export const getDoctorData = async (): Promise<any> => {
    try {
      const response = await API.get(`${UserRouters.getAllDoctors}`,{ withCredentials : true });
      return response?.data; 
    } catch (error) {
      console.log("Error fetching doctor data:", error);
    }
  };

 
  
 
  