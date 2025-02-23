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
      return response?.data ;

    } catch (error) {
      console.log(error);
    }
  };

  export const getSlotDetailsById = async (id: string | null): Promise<any> => {
    try {
      const response = await API.get(`${UserRouters.getSlotDetailsById}${id}`,{ withCredentials : true });
      console.log(response,"data by id..")
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



  // Show all doctor data in userSide Home DoctorCarousel 
 

  export const getDoctorData = async (): Promise<any> => {
    try {
      const response = await API.get(`${UserRouters.getAllDoctors}`,{ withCredentials : true });
      return response?.data; 
    } catch (error) {
      console.log("Error fetching doctor data:", error);
    }
  };

 
  // get slots userside 

  export const getSlotDetails = async (email: string | null, page: number = 1, limit: number = 4): Promise<any> => {
    try {
      console.log("Fetching slot details with pagination");
  
      const response = await API.get(`${UserRouters.getDoctorSlotData}/${email}?page=${page}&limit=${limit}`);

  
      console.log(response.data, "get slotBooking response");
      console.log(response, "resp-1");
  
      return response?.data;
  
    } catch (error) {
      console.error("Error in getSlotDetails API call:", error);
    }
  };


  export const getAllAppointmentDetails = async (email: string | null, page: number, limit: number ): Promise<any> => {
    try {
      console.log("Fetching Appointment details with pagination" , email);
  
      const response = await API.get(`${UserRouters.getUserAppointmentData}/${email}?page=${page}&limit=${limit}`);

  
      console.log(response.data, "get Appointment response");
      console.log(response, "resp-1");
  
      return response?.data;
  
    } catch (error) {
      console.error("Error in Appointment API call:", error);
    }
  };

 


  export const getAppointment = async (email: string): Promise<any> => {
    try {
      console.log("Fetching Appointment details with pagination" , email);
  
      const response = await API.get(`${UserRouters.getAppointment}/${email}`);

  
      console.log(response.data, "get Appointment response");
      console.log(response, "resp-2222222222222222");
  
      return response?.data;
  
    } catch (error) {
      console.error("Error in Appointment API call:", error);
    }
  };



  // get appointment - payment success userside 

  export const getAppointmentDetails = async (txnid: string | null): Promise<any> => {
    try {
        if (!txnid) {
            throw new Error("Transaction ID is required");
        }

        console.log("Fetching appointment details...", txnid);

        console.log("Requesting:", `${UserRouters.getAppointmentDetails}/${txnid}`);


        const response = await API.get(`${UserRouters.getAppointmentDetails}${txnid}`);

        console.log(response, "Fetched appointment details");

        return response; 
    } catch (error) {
        console.error("Error in getAppointmentDetails API call:", error);
        throw error; // Properly propagate errors
    }
};


export const getAllBanner = async (): Promise<any> => {
  try {
   

    const response = await API.get(UserRouters.getAllBanner, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    console.log(response.data, "getBannerData response");
    return response?.data;
  } catch (error) {
    console.error("Error in getBannerData API call:", error);
  }
};