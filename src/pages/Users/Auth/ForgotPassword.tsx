import  { useState } from 'react';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

import Loader from '../../../components/Common/Fallbacks/Loader';
import InputField from '../../../components/UserComponents/common/inputField';

import { verifyEmail } from '../../../api/auth/UserAuthentication';

const ForgotPassword = () => {

  const [loader, setLoader] = useState(false);

  const initialValues = {
    email: "",
  };

  const navigate = useNavigate();

  const onSubmit = async (data: { email: string }) => {
    try {
  
      setLoader(true); 
      const response = await verifyEmail(data.email);
      if (response?.success) {
        
        localStorage.setItem("ForgotPassEmail", response.data.email);
        toast.success(response.message);
        navigate(`/user/forgot-password-otp`);
      } else {
        toast.error(response?.message || "An error occurred. Please try again.");
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
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center px-4 py-8 sm:p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-4 sm:p-8">
          <div className="mb-6 sm:mb-8">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center mb-4">
              <img src="../../../Logo.png" alt="Logo" className="w-full h-full" />
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
                  href="/user/login"
                  className="text-purple-700 hover:underline"
                >
                  Log in here
                </a>
              </div>
            </Form>
          )}
        </Formik>
          
          <div className="mt-6 text-center">
            <a href="/user/login" className="text-purple-600 hover:text-purple-800 text-sm">
              Back to Login
            </a>
          </div>
        </div>
        
        {/* Right side - Image */}
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-purple-400 to-purple-600 p-12">
          <div className="h-full flex items-center justify-center">
            <img
              src="../../../Login-template.png"
              alt="Reset Password"
              className="rounded-2xl max-w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;