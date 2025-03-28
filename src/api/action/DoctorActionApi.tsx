import DoctorRoutes from "../../@types/endPoints/doctorEndPoints";
import { API } from "../../service/axios";


export const getDoctorData = async (email: string | null): Promise<any> => {
  try {
    
    const response = await API.get( `${DoctorRoutes.getDoctorData}${email}`,{ withCredentials : true });
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};




export const updateProfile = async (formData: FormData): Promise<any> => {
  try {
    console.log("Inside updateProfile API call");

    const response = await API.put(DoctorRoutes.updateProfile, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    console.log(response.data.user, "updateProfile response");
    return response?.data;
  } catch (error) {
    console.error("Error in updateProfile API call:", error);
  }
};



export const slotBooking = async (formData: FormData): Promise<any> => {
  try {
    console.log("Inside updateProfile API call");

    const response = await API.post(DoctorRoutes.SlotBooking, formData, {
      withCredentials: true,
    });
    console.log(response.data.user, "slotBooking response");
    return response?.data;
  } catch (error) {
    console.error("Error in updateProfile API call:", error);
  }
};

export const deleteSlot = async (_id: string): Promise<any> => {
  try {
    console.log("Inside deleteSlot API call");

    const response = await API.delete(`${DoctorRoutes.deleteSlot}/${_id}`,{ withCredentials : true });
    console.log(response.data, "deleteSlot response");
    return response?.data;
  } catch (error) {
    console.error("Error in deleteSlot API call:", error);
  }
};


export const getSlotDetails = async (email: string | null): Promise<any> => {
  try {
    console.log("Inside updateProfile API call");

    const response = await API.get(`${DoctorRoutes.getDoctorSlotData}/${email}`,{ withCredentials : true });

    console.log(response.data, "get slotBooking response");
    return response?.data;

   
  } catch (error) {
    console.error("Error in updateProfile API call:", error);
  }
};






export const updatePassword = async ( data: any): Promise<any> => {
  try {
    
    console.log("coming..." , data)
    const response = await API.put(DoctorRoutes.updatePassword,data, { withCredentials: true });
    console.log(response, "response updatePassword");
    return response.data;
  } catch (error) {
    console.error("Error in updateProfile API call:", error);
  }
};



export const sendVerification=async (formData:FormData)=>{
  try {
      const response=await API.post(DoctorRoutes.sendVerification,formData,{headers:{"Content-Type":"multipart/form-data"},withCredentials:true})

      console.log(response.data,"response verification...")
      return response.data
      
  } catch (error) {
      console.log(error)
  }
}

export const getAllBanner = async (): Promise<any> => {
  try {
   

    const response = await API.get(DoctorRoutes.getAllBanner, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    console.log(response.data, "getBannerData response");
    return response?.data;
  } catch (error) {
    console.error("Error in getBannerData doctor API call:", error);
  }
};


export const getAllDoctorAppointmentDetails = async (doctorId: string | null, page: number, limit: number , activeTab: string ): Promise<any> => {
  try {
    console.log("Fetching Appointment details with pagination" , doctorId);

    const response = await API.get(`${DoctorRoutes.getDoctorAppointmentData}/${doctorId}?page=${page}&limit=${limit}&activeTab=${activeTab}`,{ withCredentials : true });

    console.log("Fetching Appointment details with pagination" , response);
    return response?.data;

  } catch (error) {
    console.error("Error in Appointment API call:", error);
  }
};

export const getAppointmentById = async (appointmentmentId: string ): Promise<any> => {
  try {
    console.log("Fetching Appointment details with pagination" , appointmentmentId);

    const response = await API.get(`${DoctorRoutes.getAppointmentById}/${appointmentmentId}`,{ withCredentials : true });

    console.log("Fetching Appointment details with pagination" , response);
    return response?.data;

  } catch (error) {
    console.error("Error in Appointment API call:", error);
  }
};


export const addReview=async(doctorId:string,userId : string , rating:number,comment:string)=>{
  try {

    console.log("dataa", doctorId , userId , rating , comment);
    
    const response=await API.post(DoctorRoutes.addReview,{doctorId,userId , rating,comment},{
      withCredentials:true
    })
    return response.data
    
  } catch (error) {
    console.log(error)
  }
}
export const addReply = async (reviewId: string,userId: string,comment: string) => {
  try {
    const response = await API.post(DoctorRoutes.addReply, {reviewId,userId,comment}, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to add reply." };
  }
};

export const addPrescription = async (data: any) => {
  try {
    const response = await API.post(DoctorRoutes.addPrescription, data, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    console.error("Error adding prescription:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to add prescription."
    };
  }
};



export const likeReview = async (reviewId: string, userId: string) => {
  try {
    const response = await API.post(DoctorRoutes.likeReview, { reviewId, userId }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.log("Error liking review:", error);
    return { success: false, message: "Something went wrong" };
  }
};

export const likeReply = async (replyId: string, userId: string , reviewId: string ) => {
  try {

    const response = await API.post(DoctorRoutes.likeReply, { replyId, userId , reviewId }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error liking reply:", error);
    return { success: false, message: "Something went wrong" };
  }
};

export const GetDoctorReviews=async(doctorId:string)=>{
  try {
    const response=await API.get(`${DoctorRoutes.getReview}${doctorId}`,{
      withCredentials:true
    })
    console.log(response.data.data,"reviews")
    return response.data
    
  } catch (error) {
    console.log(error)
  }
}