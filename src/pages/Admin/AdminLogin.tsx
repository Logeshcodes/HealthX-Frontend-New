import { Formik, Form, Field } from "formik";
import * as Yup from "yup"
import {toast} from 'react-toastify'
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import PasswordField from "../../components/UserComponents/common/passwordField";

import { adminLogin } from "../../api/auth/AdminAuthentication";

const AdminLogin = () => {

  const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };



  const handleSubmit = async(values: { email: string; password: string }) => {

    const response= await adminLogin(values) ;
    const email = response.data.email ;
    if(response.success){
      localStorage.setItem("admin", JSON.stringify(email));
      toast.success(response.message)
      navigate('/admin/dashboard')
     
    }else{
      toast.error(response.message)
    }
   
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
       < motion.div
        initial={{opacity:0 , x:200}}
        animate={{opacity:100,x:0}}
        transition={{duration:1 , ease:'easeInOut'}}
        >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Animation */}
            <div className="w-full md:w-1/2 bg-purple-600 p-12 flex flex-col justify-center items-center text-white">
              <div className="animate-bounce mb-4">
                
              </div>
              <div className="relative">
                <div className="w-64 h-64 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl animate-pulse">
                      <img src="https://cdn.pixabay.com/animation/2023/10/08/03/19/03-19-26-213_512.gif" alt="" />
                    </div>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-white/30 rounded-full animate-spin-slow"></div>
                </div>
              </div>
              <h3 className="mt-6 text-2xl font-bold">Admin Login Page </h3>
              <p className="mt-4 text-center text-white/80">
                Secure repository management 
              </p>
            </div>

            {/* Right Side - Login Form */}

            <div className="w-full md:w-1/2 py-16 px-12">
              <h2 className="text-3xl mb-4 font-bold">Hi Admin, Welcome Back! 👋</h2>
              <p className="mb-8 text-gray-600">
                Please login to access your dashboard
              </p>
             
                     <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={handleSubmit}>
             
                       {({ errors, touched }) => (
                         <Form className="space-y-6">
                           {/* Email Field */}
                           <div>
                             <div className="relative">
                               <Field
                                 name="email"
                                 type="email"
                                 placeholder="Email"
                                 className={`w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 ${
                                   errors.email && touched.email ? "focus:ring-red-500" : "focus:ring-purple-500"
                                 }`}
                               />
                               {errors.email && touched.email && (
                                 <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                               )}
                             </div>
                           </div>
             
                           {/* Password Field */}
                           <div>
                             <div className="relative">
                             <div>
                                <PasswordField  name="password" placeholder="Password" />
                            </div>
                               {errors.password && touched.password && (
                                 <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                               )}
                             </div>
                             <div className="p-4">
                               
                             </div>
                           </div>
             
                           {/* Submit Button */}
                           <button
                             type="submit"
                             className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
                            
                           >
                             Login Now
                           </button>
             
                           {/* Divider */}
                           <div className="relative my-6">
                             <div className="absolute inset-0 flex items-center">
                               <div className="w-full border-t border-gray-200"></div>
                             </div>
                             <div className="relative flex justify-center text-sm">
                               <span className="px-2 bg-white text-gray-500">Admin Credentials</span>
                             </div>
                           </div>
                         </Form>
                       )}
                 </Formik>
            </div>
          </div>
        </div>
      </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;