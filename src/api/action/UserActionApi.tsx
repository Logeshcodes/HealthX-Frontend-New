import { API } from "../../service/axios";

import UserRouters from "../../@types/endPoints/userEndPoints";
import { Wallet } from "../../@types/WalletPayment";



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

  export const getDoctorDetailsById = async ( doctorId: string | null): Promise<any> => {
    try {
      const response = await API.get(`${UserRouters.getDoctorDetailsById}${doctorId}`,{ withCredentials : true });
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

  export const getPrescriptionById = async (appointmentmentId: string ): Promise<any> => {
    try {
      console.log("Fetching Appointment details with pagination" , appointmentmentId);
  
      const response = await API.get(`${UserRouters.getPrescriptionById}/${appointmentmentId}`,{ withCredentials : true });
  
      console.log("Fetching Appointment details with pagination" , response);
      return response?.data;
  
    } catch (error) {
      console.error("Error in Appointment API call:", error);
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

  export const walletPayment = async ( appointmentData : Wallet ): Promise<any> => {
    try {
      const response = await API.post(`${UserRouters.walletPayment}`,  {appointmentData}, { withCredentials: true });
      console.log(response,"response walletPayment appointment ")
      return response.data;
    } catch (error) {
      console.error("Error in walletPayment API call:", error); 
    }
  };

  export const appointmentCancel = async (appointmentId : string ): Promise<any> => {
    try {
      const response = await API.post(`${UserRouters.appointmentCancel}/${appointmentId}`,  {}, { withCredentials: true });
      console.log(response,"response appointment cancel")
      return response.data;
    } catch (error) {
      console.error("Error in cancelAppointment API call:", error);
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
  
      const response = await API.get(`${UserRouters.getDoctorSlotData}/${email}?page=${page}&limit=${limit}` ,{ withCredentials : true });

  
      console.log(response.data, "get slotBooking response");
      console.log(response, "resp-1");
  
      return response?.data;
  
    } catch (error) {
      console.error("Error in getSlotDetails API call:", error);
    }
  };


  export const getAllAppointmentDetails = async (userId: string | null, page: number, limit: number , activeTab : string  ): Promise<any> => {
    try {
      console.log("Fetching Appointment details with pagination....." , userId);
  
    const response = await API.get(`${UserRouters.getUserAppointmentData}/${userId}?page=${page}&limit=${limit}&activeTab=${activeTab}`,{ withCredentials : true });

      return response?.data;
  
    } catch (error) {
      console.error("Error in Appointment API call:", error);
      throw error ;
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


        const response = await API.get(`${UserRouters.getAppointmentDetails}${txnid}`,{ withCredentials : true });

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

export const addReport=async(doctorId:string,userId : string , reportType:string ,description:string)=>{
  try {

    console.log("dataa", doctorId , userId , reportType , description);
    
    const response=await API.post(UserRouters.addReport,{doctorId,userId,reportType,description},{
      withCredentials:true
    })
    return response.data
    
  } catch (error) {
    console.log(error)
  }
}