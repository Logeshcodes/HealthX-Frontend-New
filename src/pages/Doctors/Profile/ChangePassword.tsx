
import { toast } from "react-toastify";
import PasswordField from '../../../components/UserComponents/common/passwordField';

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { updatePassword } from "../../../api/action/DoctorActionApi";


const ChangePassword = () => {

  
  const changePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Current password is required"),
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm password is required"),
  });



  const initialValues = {
    currentPassword : "" ,
    newPassword: "",
    confirmPassword: "",
  };


  const onSubmit = async (data: { newPassword: string; currentPassword: string }) => {
      try {
        console.log("Clicked...")
        const response = await updatePassword(data); 

        if (response.success) {
          toast.success("Password changed successfully");
          
        } else {
          toast.error(response.message || "Failed to changed password");
        }
      } catch (error) {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>
      
        

      <Formik
          initialValues={initialValues}  validationSchema={changePasswordSchema}  onSubmit={onSubmit}>
          {() => (
            <Form className="space-y-6 my-4 flex flex-col justify-center">
             
              <div>
                <PasswordField name="currentPassword" placeholder="current Password" />
              </div>

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
          

        
      
    </div>
  );
};

export default ChangePassword;
