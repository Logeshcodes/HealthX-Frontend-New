import  { useState } from 'react';

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Loader from '../../../components/Common/Fallbacks/Loader';
import InputField from '../../../components/UserComponents/common/inputField';
import { useNavigate } from 'react-router-dom';
import { verifyEmail } from '../../../api/auth/DoctorAuthentication';

const DoctorForgotPassword = () => {

  const [loader, setLoader] = useState(false);

  const initialValues = {
    email: "",
  };

  const navigate = useNavigate();

  const onSubmit = async (data: { email: string }) => {
    try {
      console.log("Submitting forgot password request for:", data.email);
  
      setLoader(true); 
  
      const response = await verifyEmail(data.email);
  
      console.log("Response received:", response.message);
  
      if (response?.success) {
        
        localStorage.setItem("ForgotPassEmail", response.data.email);
  
        toast.success(response.message);
        
        
        navigate(`/doctor/forgot-password-otp`);
      } else {
        toast.error(
          response?.message || "An error occurred. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during password reset request:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoader(false); 
    }
  };
  



  const emailSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden flex">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-8">
            <div className="h-12 w-12  rounded-xl flex items-center justify-center mb-4">
             
              <img src="../../../Logo.png" alt="Logo" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
            <p className="text-gray-600 mt-2">Enter your email to reset your password</p>
          </div>
          
         

<Formik
          initialValues={initialValues}
          validationSchema={emailSchema}
          onSubmit={onSubmit}
        >
          {() => (
            <Form className="space-y-6 my-4 flex flex-col justify-center">
              {/* Email Field */}
              <div>
                <InputField
                label="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                />
              </div>

              {/* Submit Button */}
              {!loader ? (
                
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">Continue
              </button>

              ) : (
                <Loader />
              )}

              <div className="text-sm font-medium text-gray-900 cursor-pointer">
                Remembered?{" "}
                <a
                  href="/doctor/login"
                  className="text-purple-700 hover:underline"
                >
                  Log in here
                </a>
              </div>
            </Form>
          )}
        </Formik>
          
          <div className="mt-6 text-center">
            <a href="/doctor/login" className="text-purple-600 hover:text-purple-800 text-sm">
              Back to Login
            </a>
          </div>
        </div>
        
        {/* Right side - Image */}
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-purple-400 to-purple-600 p-12">
          <div className="h-full flex items-center justify-center">
            <img
              src="../../../doctor-img.png"
              alt="Reset Password"
              className="rounded-2xl max-w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorForgotPassword;