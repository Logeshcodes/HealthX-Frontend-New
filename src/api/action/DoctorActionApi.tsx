import DoctorRoutes from "../../@types/endPoints/doctorEndPoints";
import { API } from "../../service/axios";


export const getDoctorData = async (email: string | null): Promise<any> => {
  try {
    
    const response = await API.get( `${DoctorRoutes.getDoctorData}${email}`);
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

export const appointmentBooking = async (formData: FormData): Promise<any> => {
  try {
    console.log("Inside updateProfile API call");

    const response = await API.post(DoctorRoutes.appointmentBooking, formData, {
      withCredentials: true,
    });
    console.log(response.data.user, "appointmentBooking response");
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


export const reVerifyRequest=async (formData:FormData)=>{
  try {
      const response=await API.post(DoctorRoutes.sendReVerifyRequest,formData,{headers:{"Content-Type":"multipart/form-data"},
      withCredentials:true})
      
      console.log(response.data,"response verification...")
      return response.data
      
  } catch (error) {
      console.log(error)
  }
}
