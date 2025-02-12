import { useCallback, useState } from 'react';
import { Card } from '../../../components/Common/card/Card';
import * as Yup from "yup";

import Loader from '../../../components/Common/Fallbacks/Loader';
import PasswordField from '../../../components/UserComponents/common/passwordField';

import { Formik, Form , Field } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { signup } from '../../../api/auth/UserAuthentication';

import { signUp } from '../../../@types/SignupType';

import { motion } from "framer-motion";


// Validation Schema
const signupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
  .matches(/^\S*$/, "Password must not contain spaces")
  .min(6, "Password must be at least 6 characters")
  .required("Password is required")
})


const SignupPage = () => {
 
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (values: signUp) => {
      try {
        setLoader(true);
        console.log("signup button Clicked...")
        const response = await signup(values);
      
        if (response.success) {
          localStorage.setItem("verificationToken", response.token);
          localStorage.setItem("email", values.email);
          toast.success(response.message);
          navigate("/user/verify_otp");
        } else {
          toast.error(response.message);
          setLoader(false);
        }
      } catch (error: any) {
        toast.error(error.message || "Unknown Error Occurred!");
        setLoader(false);
      }
    },[]
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 p-4 flex items-center justify-center">


< motion.div

initial={{opacity:0 , x:200}}
animate={{opacity:100,x:0}}
transition={{duration:1 , ease:'easeInOut'}}
>
      <Card className="w-full max-w-6xl grid md:grid-cols-2 overflow-hidden bg-white rounded-xl shadow-xl">

     
        
        {/* Left Section */}
        <div className="p-8 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-6">
              
              <img
                src="../../../Logo.png"
                alt="Healthcare professional"
                className="rounded-lg mb-4 w-10 h-10"
              />
              
              <h1 className="text-xl font-semibold">Health X</h1>
        </div>
          <div className="mb-8">
            
            <h2 className="text-2xl font-bold mb-2">Welcome to HealthX</h2>
            <h3 className="text-xl font-semibold text-gray-700 mb-6">
              Get started with your email
              <br />
              & set your Password
            </h3>
          </div>


          <Formik
              initialValues={{ email: '', password: '' }} 
              validationSchema={signupSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="space-y-6">
                  <div className="rounded-lg bg-gray-100 p-4">
                    <Field
                      name="email"
                      type="text"
                      className="w-full bg-transparent border-none focus:outline-none text-gray-800"
                      placeholder="Email"
                    />
                    
                  </div>
                  {errors.email && touched.email && (
                      <div className="text-red-500 text-sm">{errors.email}</div>
                    )}
                  <div className="rounded-lg bg-gray-100 p-4">
                    <PasswordField
                      name="password"
                     
                      
                      placeholder="Password"
                    />
                    
                  </div>
                
                  {!loader ? (
                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Continue
                  </button>
                ) : (
                  <Loader />
                )}

                  
                </Form>
              )}
           </Formik>



          <div className="flex items-center gap-4 m-5">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-500">Or With</span>
                <div className="flex-1 h-px bg-gray-300"></div>
        </div>     

          {/* <button className="w-full flex items-center justify-center gap-2 border rounded-lg py-3 hover:bg-gray-50 transition-colors">
                <img src="" alt="Google icon" className="w-5 h-5" />
                <span>Login with Google</span>
              </button> */}

              <div className="text-center space-y-2 m-2">
                <a href="/doctor/register" className="text-red-500 hover:underline">
                  Register as Doctor ? Click here
                </a>
                <p className="text-gray-600">
                  Already have an account ?{' '}
                  <a href="/user/login" className="text-purple-600 hover:underline">
                    Login
                  </a>
                </p>
              </div>
        </div>

        {/* Right Section */}
        <div className="hidden md:block relative bg-gradient-to-br from-purple-600 to-blue-500 p-8">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-8">Patient Signup</h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-10 ml-16 max-w-sm">
              <img
                src="../../../Login-template.png"
                alt="Healthcare professional"
                className="rounded-lg mb-4"
              />
              <div className="absolute bottom-8 right-8">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xl">⚡</span>
                </div>
              </div>
            </div>
          </div>
        </div>



      </Card>
        </motion.div>
    </div>
  );
};

export default SignupPage;