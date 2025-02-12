
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import PasswordField from "../../../components/UserComponents/common/passwordField";
import { resetPassword } from "../../../api/auth/DoctorAuthentication";

const DoctorResetPassword = () => {

  const navigate =  useNavigate()
  
  const resetPasswordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm password is required"),
  });


  const initialValues = {
    newPassword: "",
    confirmPassword: "",
  };


  const onSubmit = async (data: { newPassword: string; confirmPassword: string }) => {
    try {
        console.log("reset clicked...")
      const response = await resetPassword(data.newPassword); // Replace with your API call
      if (response.success) {
        toast.success("Password reset successfully");
        localStorage.removeItem("ForgotPassEmail")
        navigate(`/doctor/login`)
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden flex">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-8">
            <div className="h-12 w-12  rounded-xl flex items-center justify-center mb-4">
             
              <img src="../../../Logo.png" alt="Logo" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
            <p className="text-gray-600 mt-2">Enter the new password below to change your password</p>
          </div>
          
       

        <Formik
          initialValues={initialValues}
          validationSchema={resetPasswordSchema}
          onSubmit={onSubmit}
        >
          {() => (
            <Form className="space-y-6 my-4 flex flex-col justify-center">
             
              <div>
                <PasswordField name="newPassword" placeholder="New Password" />
              </div>

              
              <div>
                <PasswordField  name="confirmPassword" placeholder="Confirm Password" />
              </div>

           
              <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              name="Reset Password"
            >
              Confirm
            </button>

             
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

export default DoctorResetPassword;