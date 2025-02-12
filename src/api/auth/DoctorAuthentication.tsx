import { API } from "../../service/axios";
import authentictaionRoutes from "../../@types/endPoints/authEndPoints";




// To signup - show dept

export const getSignupDepartment = async (): Promise<any> => {
  try {
    const response = await API.get(authentictaionRoutes.Get_All_Department ,{ withCredentials : true });

    console.log(response.data, "response resendOtp");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Doctor - Signup


export const signup = async (DoctorRegister: FormData): Promise<any> => {

  console.log("doctor data..", DoctorRegister)
  console.log("doctor data..", FormData)

    try {
      const response = await API.post( authentictaionRoutes.signup_Doctor, DoctorRegister,{
         
          withCredentials: true,
      });
      console.log(response.data, "response????");
      return response.data;
    } catch (error: any) {
      if (error.response.status === 404) {
        throw error;
      }
      console.log(error.message);
    }
  };

  // verify -OTP

  export const verifyOtp = async (otp: string): Promise<any> => {
    try {
      const response = await API.post(authentictaionRoutes.verifyOtp_Doctor, { otp });
      console.log(response.data, "response verifyOtp");
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  // Resend - OTP

  export const resendOtp = async (email: string): Promise<any> => {
    try {
      const response = await API.post(authentictaionRoutes.resendOtp_Doctor, { email });
      console.log(response.data, "response resendOtp");
      return response.data;
    } catch (error) {
      throw error;
    }
  };



  // google -login 

  export const doctorGoogleLogin = async (loginData: object) => {
    try {
      const response = await API.post(
        authentictaionRoutes.googleLogin_doctor,
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

  


  // Doctor - Login

  export const login = async (email: string,password:string): Promise<any> => {
    try {
      const response = await API.post(authentictaionRoutes.login_Doctor, { email,password }, { withCredentials: true });
      console.log(response.data, "response login");
      return response.data;
    } catch (error) {
      throw error;
    }
  };



  // While forgot-password verify email 


  export const verifyEmail = async (email: string): Promise<any> => {
    try {
      const response = await API.post(authentictaionRoutes.verifyEmail_doctor,{ email } ); 
      console.log(response.data, "response verified Email..");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // verify OTP ( forgot - password page )
  
 
  export const verifyResetOtp = async (email:string,otp:string): Promise<any> => {
    try {
      const response = await API.post(authentictaionRoutes.verifyResetOtp_doctor,{ email,otp },{ withCredentials: true });
      console.log(response.data, "response verifyRestOtp");
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  // Resend -OTP ( forgot - password page )


  export const forgotResendOtp = async (email: string): Promise<any> => {
    try {
      const response = await API.post(authentictaionRoutes.forgotResendOtp_doctor, { email });
      console.log(response.data, "response resendOtp");
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // change - reset the password

  
  export const resetPassword = async (password:string): Promise<any> => {
    try {
      const response = await API.post(authentictaionRoutes.resetPassword_doctor,{ password },{ withCredentials:true });
      console.log(response.data, "response passwordReset");
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  

  // Doctor logout

  
  export const logout = async (): Promise<any> => {
    try {
      const response = await API.post(authentictaionRoutes.logout_Doctor,{},{withCredentials: true });
      console.log(response.data, "response logout");
      return response.data;
    } catch (error) {
      throw error;
    }
  };