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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 px-4 py-8 sm:p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 100, x: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <Card className="max-w-6xl overflow-hidden flex flex-col md:flex-row bg-white rounded-3xl shadow-xl w-full">
          {/* Left Side - Login Form */}
          <div className="w-full md:w-3/5 p-4 sm:p-8 md:p-12">
            <div className="flex items-center gap-2 mb-6 sm:mb-8">
              
              <img
                src="../../../Logo.png"
                alt="Healthcare professional"
                className="rounded-lg mb-2 sm:mb-4 w-8 h-8 sm:w-10 sm:h-10"
              />
              <span className="text-xl font-bold">Health X</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Hi, Welcome Back! 👋</h2>

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
                        className={`w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 ${
                          errors.email && touched.email
                            ? "focus:ring-red-500"
                            : "focus:ring-purple-500"
                        }`}
                      />
                      {errors.email && touched.email && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="relative">
                      <PasswordField name="password" placeholder="password" />
                    </div>
                    <div className="text-right">
                      <a
                        href="/user/verifyEmail"
                        className="text-red-500 hover:text-red-600 text-sm"
                      >
                        Forgot Password?
                      </a>
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
                      <span className="px-2 bg-white text-gray-500">
                        Or With
                      </span>
                    </div>
                  </div>

                  {/* Google Login */}
                  <GoogleOAuthProvider clientId="820976220458-vffcl6e1rc5t6urg4hasroqjovhufpac.apps.googleusercontent.com">
                    <div className="flex justify-center">
                      <GoogleLogin
                        onSuccess={googleSubmit}
                        onError={() => console.error("Google Login Failed")}
                      />
                    </div>
                  </GoogleOAuthProvider>

                  {/* Sign Up Link */}
                  <p className="text-center text-sm">
                    Don't have an account?{" "}
                    <a
                      href="/user/signup"
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Sign Up
                    </a>
                  </p>
                </Form>
              )}
            </Formik>
          </div>

          {/* Right Section */}
          <div className="hidden md:block relative bg-gradient-to-br from-purple-600 to-blue-500  p-14">
            <div className="text-center text-white p-4">
              <h2 className="text-3xl font-bold mb-8 ">Patient Login</h2>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-14 ml-8 max-w-sm">
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

export default LoginPage;
