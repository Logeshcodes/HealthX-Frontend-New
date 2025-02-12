import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordField from "../../../components/UserComponents/common/passwordField";
import InputField from "../../../components/UserComponents/common/inputField";
import { DoctorRegister } from "../../../@types/DoctorSignupType";
import {
  signup,
  getSignupDepartment,
} from "../../../api/auth/DoctorAuthentication";
import Loader from "../../../components/Common/Fallbacks/Loader";
import {
  User,
  Mail,
  Phone,
  Building,
  Stethoscope,
  GraduationCap,
  Briefcase,
  FileText,
} from "lucide-react";

import { motion } from "framer-motion";

interface department {
  departmentName: "String";
}

const DoctorSignup = () => {
  const [department, setDepartment] = useState<department[]>([]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const showDepartment = async () => {
        const response = await getSignupDepartment();
        setDepartment(response.departments);
      };
      showDepartment();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const initialValues = {
    name: "",
    email: "",
    Mobile: "",
    department: "",
    consultationType: "",
    education: "",
    experience: "",
    description: "",
    password: "",
    confirmPassword: "",
  };

  const signupSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    Mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
      .required("Mobile number is required"),
    department: Yup.string().required("Department is required"),
    consultationType: Yup.string()
      .oneOf(["In-person", "Online", "Both"], "Invalid consultation type")
      .required("Consultation type is required"),
    education: Yup.string()
      .min(2, "Education must be at least 2 characters")
      .required("Education is required"),
    experience: Yup.number()
      .typeError("Experience must be a number")
      .min(0, "Experience cannot be negative")
      .required("Experience is required"),
    description: Yup.string()
      .max(500, "Description must be less than 500 characters")
      .required("Description is required"),
    password: Yup.string()
      .matches(/^\S*$/, "Password must not contain spaces")
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = useCallback(
    async (values: DoctorRegister) => {
      try {
        setLoader(true);
        const formData = new FormData();
        for (const key of Object.keys(values) as (keyof DoctorRegister)[]) {
          if (values[key] !== undefined) {
            formData.append(key, values[key] as string);
          }
        }
        const response = await signup(formData);
        if (response.success) {
          localStorage.setItem("verificationToken", response.token);
          localStorage.setItem("email", values.email);
          toast.success(response.message);
          navigate("/doctor/verify_otp");
        } else {
          toast.error(response.message);
          setLoader(false);
        }
      } catch (error: any) {
        toast.error(error.message || "An unknown error occurred!");
        setLoader(false);
      }
    },
    [navigate]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 100, x: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
            {/* Left side - Branding */}
            <div className="lg:w-1/3 bg-gradient-to-br from-purple-600 to-blue-600 p-12 hidden lg:block">
              <div className="h-full flex flex-col">
                <div className="flex items-center space-x-3 mb-12">
                  <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                    <div className="text-3xl">👨‍⚕️</div>
                  </div>
                  <h2 className="text-white text-3xl font-bold">Health X</h2>
                </div>

                <div className="flex-grow">
                  <h1 className="text-4xl font-bold text-white mb-6">
                    Join Our Medical Community
                  </h1>
                  <p className="text-lg text-white/80 mb-8">
                    Empower your practice with our comprehensive healthcare
                    platform.
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 text-white/90">
                      <div className="bg-white/10 p-3 rounded-lg">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Professional Profile</h3>
                        <p className="text-white/70">
                          Build your online presence
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-white/90">
                      <div className="bg-white/10 p-3 rounded-lg">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Patient Management</h3>
                        <p className="text-white/70">
                          Streamline your practice
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-white/90">
                      <div className="bg-white/10 p-3 rounded-lg">
                        <Building className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Digital Healthcare</h3>
                        <p className="text-white/70">
                          Modern medical solutions
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="lg:w-3/4 p-2">
              <div className="p-10 mx-auto">
                <h2 className="text-2xl font-bold mb-2">Create your account</h2>
                <p className="text-gray-600 mb-8">
                  Join thousands of healthcare professionals
                </p>

                <Formik
                  initialValues={initialValues}
                  validationSchema={signupSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-gray-600 text-sm mb-1">
                            <User className="w-4 h-4" />
                            <span>Full Name</span>
                          </div>
                          <InputField
                            type="text"
                            name="name"
                            placeholder="Dr. John Doe"
                            label=""
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-gray-600 text-sm mb-1">
                            <Mail className="w-4 h-4" />
                            <span>Email</span>
                          </div>
                          <InputField
                            type="email"
                            name="email"
                            placeholder="doctor@example.com"
                            label=""
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-gray-600 text-sm mb-1">
                            <Phone className="w-4 h-4" />
                            <span>Mobile</span>
                          </div>
                          <InputField
                            type="text"
                            name="Mobile"
                            placeholder="1234567890"
                            label=""
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-gray-600 text-sm mb-1">
                            <Building className="w-4 h-4" />
                            <span>Department</span>
                          </div>
                          <Field
                            as="select"
                            name="department"
                            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors text-gray-700 text-sm"
                          >
                            <option value="">Select Department...</option>
                            {department.map((dept, index) => (
                              <option value={dept.departmentName} key={index}>
                                {dept.departmentName}
                              </option>
                            ))}
                          </Field>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-gray-600 text-sm mb-1">
                            <Stethoscope className="w-4 h-4" />
                            <span>Consultation Type</span>
                          </div>
                          <Field
                            as="select"
                            name="consultationType"
                            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors text-gray-700 text-sm"
                          >
                            <option value="">Select Type...</option>
                            <option value="Both">
                              Both Online & In-person
                            </option>
                            <option value="Online">Online Only</option>
                            <option value="In-person">In-person Only</option>
                          </Field>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-gray-600 text-sm mb-1">
                            <GraduationCap className="w-4 h-4" />
                            <span>Education</span>
                          </div>
                          <InputField
                            type="text"
                            name="education"
                            placeholder="MD, MBBS, etc."
                            label=""
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-gray-600 text-sm mb-1">
                            <Briefcase className="w-4 h-4" />
                            <span>Experience (years)</span>
                          </div>
                          <InputField
                            type="number"
                            name="experience"
                            placeholder="Years of experience"
                            label=""
                          />
                        </div>

                        <div className="md:col-span-2 space-y-1">
                          <div className="flex items-center space-x-2 text-gray-600 text-sm mb-1">
                            <FileText className="w-4 h-4" />
                            <span>Professional Summary</span>
                          </div>
                          <InputField
                            type="textarea"
                            name="description"
                            placeholder="Brief description of your practice and specializations"
                            label=""
                          />
                        </div>

                        <div className="space-y-1">
                          <PasswordField
                            name="password"
                            placeholder="Create password"
                          />
                        </div>

                        <div className="space-y-1">
                          <PasswordField
                            name="confirmPassword"
                            placeholder="Confirm password"
                          />
                        </div>
                      </div>

                      {!loader ? (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <span>Create Account</span>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      ) : (
                        <Loader />
                      )}

                      <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-4 text-gray-500 bg-white">
                            Or
                          </span>
                        </div>
                      </div>

                      <div className="text-center space-y-4">
                        <a
                          href="/user/signup"
                          className="block text-purple-600 hover:text-purple-700 transition-colors"
                        >
                          Register as a Patient Instead
                        </a>
                        <p className="text-gray-600">
                          Already have an account?{" "}
                          <a
                            href="/doctor/login"
                            className="text-purple-600 hover:text-purple-700 font-medium"
                          >
                            Sign in
                          </a>
                        </p>
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

export default DoctorSignup;
