import { API } from "../../service/axios"
import authentictaionRoutes from "../../@types/endPoints/authEndPoints"

import { userData } from "../../@types/UserDataType"


// Signup - User

  export const signup = async (userData: userData): Promise<any> => {
    try {
      console.log("users data..", userData)
      const response = await API.post( authentictaionRoutes.signup_user, userData );
      console.log(response.data, "response");
      return response.data;

    } 
    catch (error: any) {
      if (error.response.status === 404) {
        throw error;
      }
      console.log(error.message);
    }
  };

  // After signup - verifyOTP


  export const verifyOtp = async (otp: string): Promise<any> => {
    try {
      const response = await API.post(authentictaionRoutes.verifyOtp_user, { otp });
      console.log(response.data, "response verifyOtp");
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  // Signup Page - resend OTP again
  
  export const resendOtp = async (email: string): Promise<any> => {
    try {
      const response = await API.post(authentictaionRoutes.resendOtp_user, { email });
      console.log(response.data, "response resendOtp");
      return response.data;
    } catch (error) {
      throw error;
    }
  };



  // google -Login 

  export const UserGoogleLogin = async (loginData: object) => {
    try {
      const response = await API.post(
        authentictaionRoutes.googleLogin_User,
        loginData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error: any) {
      return error;
    }
  };


  // User - Login


  export const login = async (email: string,password:string , role: string ): Promise<any> => {
    try {

      // const res= await axios.post('http:localhost:5000/auth/user/login',{email,password,role})
      const response = await API.post(authentictaionRoutes.login_user, { email,password , role },{ withCredentials: true});
      console.log(response.data, "response login");
      return response.data;
    } catch (error) {
      throw error;
    }
  };




  // While forgot-password verify email 


  export const verifyEmail = async (email: string): Promise<any> => {
    try {
      const response = await API.post( authentictaionRoutes.verifyEmail_user,{ email } ); 
      console.log(response.data, "response sendRestLink");
      return response.data;
    } catch (error) {
      throw error;
    }
  };

 // after verified email send otp check vaild 

 export const verifyResetOtp = async (email: string,otp: string): Promise<any> => {
  try {

    const response = await API.post( authentictaionRoutes.verifyResetOtp_user,{ email,otp },{ withCredentials: true });
    console.log(response.data, "response verifyRestOtp");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// In forgot-password ( resend-otp page )

export const forgotResendOtp = async (email: string): Promise<any> => {
  try {
    const response = await API.post( authentictaionRoutes.forgotResendOtp_user,{ email });
    console.log(response.data, "response resendOtp");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Change reset the Password 

export const resetPassword = async (password: string): Promise<any> => {
  try {
    const response = await API.post(authentictaionRoutes.resetPassword_user,{ password },{ withCredentials: true });
    console.log(response.data, "response passwordReset");
    return response.data;
  } catch (error) {
    throw error;
  }
};





// user - logout


export const logout = async (): Promise<any> => {
  try {
    const response = await API.post(authentictaionRoutes.logout_user,{},{ withCredentials: true });
    return response;
  } catch (error) {
    throw error;
  }
};
