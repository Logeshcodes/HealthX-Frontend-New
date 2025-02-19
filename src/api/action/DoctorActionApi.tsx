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

    const response = await API.delete(`${DoctorRoutes.deleteSlot}/${_id}`);
    console.log(response.data, "deleteSlot response");
    return response?.data;
  } catch (error) {
    console.error("Error in deleteSlot API call:", error);
  }
};


export const getSlotDetails = async (email: string | null): Promise<any> => {
  try {
    console.log("Inside updateProfile API call");

    const response = await API.get(`${DoctorRoutes.getDoctorSlotData}/${email}`);

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
