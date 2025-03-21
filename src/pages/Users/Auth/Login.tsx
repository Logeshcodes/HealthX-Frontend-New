import { motion } from "framer-motion";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import { Card } from "../../../components/Common/card/Card";
import PasswordField from "../../../components/UserComponents/common/passwordField";


import { setUser } from "../../../redux/slices/userSlice";
import { Login } from "../../../@types/LoginData";

import { login, UserGoogleLogin } from "../../../api/auth/UserAuthentication";


const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginPage = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
    role: "",
    isBlocked: false,
  };

  const onSubmit = async (data: Login) => {
    try {

      const response = await login(data.email, data.password, data.role);

      const user = response?.user;

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        toast.success(response?.message);
        dispatch(
          setUser({
            userId: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isBlocked: user.isBlocked,
            profilePicture: user.profilePicture,
          })
        );

        setTimeout(() => {
          navigate(`/`);
        }, 1000);
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const googleSubmit = async (credentialResponse: any) => {

    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
      let response = await UserGoogleLogin({
        name: decoded.name,
        email: decoded.email,
        password: decoded.sub,
        profilePicture: decoded.picture,
        mobileNumber : decoded.phoneNumber ,
      });
    
      const user = response?.user;

      if (response) {
        dispatch(
          setUser({
            userId: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isBlocked: user.isBlocked,
            profilePicture: user.profilePicture,
          })
        );
        toast.success(response.message);
        navigate(`/`);
      } else {
        const { message } = response.response?.data;
        toast.error(message);
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-6xl"
      >
        <Card className="overflow-hidden flex flex-col md:flex-row bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl">
          {/* Left Side - Login Form */}
          <div className="w-full md:w-3/5 p-8 md:p-14">
            <div className="flex items-center gap-3 mb-10">
              <img
                src="../../../Logo.png"
                alt="Healthcare professional"
                className="rounded-lg w-12 h-12 object-cover"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Health X
              </span>
            </div>

            <h2 className="text-3xl font-bold mb-8 text-gray-800">Hi, Welcome Back! 👋</h2>

            <Formik
              initialValues={initialValues}
              validationSchema={loginSchema}
              onSubmit={onSubmit}
            >
              {({ errors, touched }) => (
                <Form className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <div className="relative">
                      <Field
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-3.5 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ease-in-out
                        ${errors.email && touched.email ? 'focus:ring-red-500 border-red-300' : 'focus:ring-purple-500 hover:bg-gray-100'}"
                      />
                      {errors.email && touched.email && (
                        <div className="text-red-500 text-sm mt-2 ml-1">
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="relative">
                      <PasswordField name="password" placeholder="Password" />
                    </div>
                    <div className="text-right mt-2">
                      <a
                        href="/user/verifyEmail"
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors"
                      >
                        Forgot Password?
                      </a>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3.5 rounded-xl
                    hover:from-purple-700 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-[1.02] 
                    active:scale-[0.98] font-medium text-lg shadow-lg"
                  >
                    Login Now
                  </button>

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  {/* Google Login */}
                  <div className="flex justify-center">
                    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                      <GoogleLogin
                        onSuccess={googleSubmit}
                        onError={() => console.error("Google Login Failed")}
                        theme="outline"
                        size="large"
                        shape="rectangular"
                      />
                    </GoogleOAuthProvider>
                  </div>

                  {/* Sign Up Link */}
                  <p className="text-center text-gray-600 mt-8">
                    Don't have an account?{" "}
                    <a
                      href="/user/signup"
                      className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                    >
                      Sign Up
                    </a>
                  </p>
                </Form>
              )}
            </Formik>
          </div>

          {/* Right Section */}
          <div className="hidden md:block relative bg-gradient-to-br from-purple-600 to-blue-500 p-16">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center text-white"
            >
              <h2 className="text-4xl font-bold mb-10">Patient Login</h2>
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 ml-8 max-w-sm 
                shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/20">
                <img
                  src="../../../Login-template.png"
                  alt="Healthcare professional"
                  className="rounded-xl mb-4 w-full h-auto transform hover:scale-105 transition-transform duration-300"
                />
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute bottom-10 right-10"
                >
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center 
                    shadow-lg transform hover:rotate-12 transition-transform">
                    <span className="text-2xl">⚡</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
