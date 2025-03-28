import { useCallback, useState } from "react";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { Card } from "../../../components/Common/card/Card";
import Loader from "../../../components/Common/Fallbacks/Loader";
import PasswordField from "../../../components/UserComponents/common/passwordField";
import InputField from "../../../components/UserComponents/common/inputField";

import { signUp } from "../../../@types/SignupType";

import { signup } from "../../../api/auth/UserAuthentication";

const signupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  mobileNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
    .required("Mobile number is required"),
  password: Yup.string()
    .matches(/^\S*$/, "Password must not contain spaces")
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const SignupPage = () => {
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = useCallback(async (values: signUp) => {
    try {
      setLoader(true);
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
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 px-4 py-8 sm:p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 100, x: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <Card className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-white rounded-xl shadow-xl">
          {/* Left Section */}
          <div className="p-4 sm:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <img
                src="../../../Logo.png"
                alt="Healthcare professional"
                className="rounded-lg mb-2 sm:mb-4 w-8 h-8 sm:w-10 sm:h-10"
              />
              <h1 className="text-xl font-semibold">Health X</h1>
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Welcome to HealthX</h2>
            </div>

            <Formik
              initialValues={{
                username: "",
                email: "",
                mobileNumber: 0,
                password: "",
                confirmPassword: "",
              }}
              validationSchema={signupSchema}
              onSubmit={handleSubmit}
            >
              {({}) => (
                <Form className="space-y-6">
                  <div className="bg-gray-100">
                    <InputField
                      name="username"
                      type="text"
                      label={"username"}
                      placeholder="Username"
                    />
                  </div>
                  <div className="bg-gray-100">
                    <InputField
                      name="email"
                      type="text"
                      label={"Email"}
                      placeholder="Email"
                    />
                  </div>

                  <div className="bg-gray-100">
                    <InputField
                      name="mobileNumber"
                      type="text"
                      placeholder="Mobile Number"
                      label={"Mobile Number"}
                    />
                  </div>

                  <div className="rounded-lg">
                    <PasswordField name="password" placeholder="Password" />
                  </div>

                  <div className="rounded-lg">
                    <PasswordField
                      name="confirmPassword"
                      placeholder="Confirm Password"
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

            <div className="flex items-center gap-4 my-3 sm:m-5">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500">Or With</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <div className="text-center space-y-2 m-2">
              <a
                href="/doctor/register"
                className="text-red-500 hover:underline"
              >
                Register as Doctor ? Click here
              </a>
              <p className="text-gray-600">
                Already have an account ?{" "}
                <a
                  href="/user/login"
                  className="text-purple-600 hover:underline"
                >
                  Login
                </a>
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden md:block relative bg-gradient-to-br from-purple-600 to-blue-500 p-10">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-8">Patient Signup</h2>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-10 ml-16 max-w-sm w-96">
                <img
                  src="../../../Login-template.png"
                  alt="Healthcare professional"
                  className="rounded-lg m-10 w-96"
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
