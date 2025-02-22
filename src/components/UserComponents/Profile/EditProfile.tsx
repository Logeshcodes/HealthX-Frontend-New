import { useEffect, useState } from "react";
import {
  User,
  Phone,
  Mail,
  CircleDot,
  Calendar,
  Store,
  CalendarDays,
  HeartPulse,
  User2,
  Ruler,
  LucideDumbbell,
  Aperture,
} from "lucide-react";
import { updateProfile, getUserData } from "../../../api/action/UserActionApi";

import { toast } from "react-toastify";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

interface UserData {
  username: string;
  email: string;
  mobileNumber: string;
  profilePicture: string;
  isBlocked: string;
  createdAt: string;
  updatedAt: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  bloodGroup: string;
}

const EditProfile = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserData>({
    username: "",
    email: "",
    mobileNumber: "",
    profilePicture: "",
    isBlocked: "",
    createdAt: "",
    updatedAt: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    bloodGroup: "",
  });

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters"),

    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),

    mobileNumber: Yup.string()
      .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
      .required("Mobile number is required"),

    profilePicture: Yup.mixed().notRequired(),

    isBlocked: Yup.boolean().notRequired(),

    createdAt: Yup.date()
      .notRequired()
      .default(() => new Date()),

    updatedAt: Yup.date()
      .notRequired()
      .default(() => new Date()),

    age: Yup.number()
      .positive("Age must be a positive number")
      .integer("Age must be an integer")
      .min(1, "Age must be at least 1")
      .max(120, "Age must be at most 120")
      .required("Age is required"),

    gender: Yup.string()
      .oneOf(["Male", "Female", "Other"], "Invalid gender")
      .required("Gender is required"),

    height: Yup.number()
      .positive("Height must be a positive number")
      .required("Height is required"),

    weight: Yup.number()
      .positive("Weight must be a positive number")
      .required("Weight is required"),

    bloodGroup: Yup.string()
      .oneOf(
        ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
        "Invalid blood group"
      )
      .required("Blood group is required"),
  });

  const [loading, setLoading] = useState<boolean>(true);

  console.log(loading);

  //   const [initialValues, setInitialValues] = useState(users);
  // useEffect(() => setInitialValues(users), [users]);

  const initialValues = {
    username: users?.username || "",
    email: users?.email || "",
    mobileNumber: users?.mobileNumber || "",
    profilePicture: users?.profilePicture || "",
    isBlocked: users?.isBlocked || "",
    createdAt: users?.createdAt || "",
    updatedAt: users?.updatedAt || "",
    age: users?.age || "",
    gender: users?.gender || "",
    height: users?.height || "",
    weight: users?.weight || "",
    bloodGroup: users?.bloodGroup || "",
  };

  const [imgSrc, setImgSrc] = useState(
    users.profilePicture || "../../../profile.jpg"
  );

  useEffect(() => {
    if (users?.profilePicture) {
      setImgSrc(users.profilePicture);
      console.log(users.profilePicture, "pic");
    }
  }, [users.profilePicture]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userDataString = localStorage.getItem("user");
        if (userDataString) {
          const user = JSON.parse(userDataString);
          const email = user?.email;

          if (email) {
            const data = await getUserData(email);
            setUsers(data);
          }

          console.log("user photo ----", users.profilePicture);
        }
      } catch (error) {
        console.log("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (data: UserData) => {
    try {
      console.log("clicked...", data);

      const formData = new FormData();

      // Check if profilePicture is an instance of File
      if (data?.profilePicture) {
        formData.append("profilePicture", data.profilePicture);
      }

      // Append other form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "profilePicture") {
          formData.append(key, value);
        }
      });

      // Log form data for debugging
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Send the request to the backend
      const response = await updateProfile(formData);

      if (response.success) {
        toast.success("Profile updated successfully");
        navigate(`/user/profile/my-account`);
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setUsers((prev) => ({
        ...prev,
        profilePicture: file,
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          isSubmitting,
          values,
          handleChange,
          handleBlur,
          errors,
          touched,
        }) => (
          <Form>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Edit Profile
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Username Field */}
                    <div>
                      <label
                        htmlFor="username"
                        className="text-sm text-gray-600"
                      >
                        Username
                      </label>
                      <div className="flex items-center space-x-2">
                        <User size={20} className="text-blue-500" />
                        <Field
                          name="username"
                          type="text"
                          placeholder="Username"
                          className={`w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 ${
                            errors.username && touched.username
                              ? "focus:ring-red-500"
                              : "focus:ring-purple-500"
                          }`}
                        />
                      </div>
                      {errors.username && touched.username && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.username}
                        </div>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="text-sm text-gray-600">
                        Email
                      </label>
                      <div className="flex items-center space-x-2">
                        <Mail size={20} className="text-blue-500" />
                        <Field
                          name="email"
                          type="email"
                          disabled
                          placeholder="Email"
                          className={`w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 ${
                            errors.email && touched.email
                              ? "focus:ring-red-500"
                              : "focus:ring-purple-500"
                          }`}
                        />
                      </div>
                      {errors.email && touched.email && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </div>
                      )}
                    </div>

                    {/* Mobile Number Field */}
                    <div>
                      <label
                        htmlFor="mobileNumber"
                        className="text-sm text-gray-600"
                      >
                        Mobile Number
                      </label>
                      <div className="flex items-center space-x-2">
                        <Phone size={20} className="text-blue-500" />
                        <Field
                          name="mobileNumber"
                          type="text"
                          placeholder="Mobile Number"
                          className={`w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 ${
                            errors.mobileNumber && touched.mobileNumber
                              ? "focus:ring-red-500"
                              : "focus:ring-purple-500"
                          }`}
                        />
                      </div>
                      {errors.mobileNumber && touched.mobileNumber && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.mobileNumber}
                        </div>
                      )}
                    </div>

                    {/* Profile Picture Field */}
                    {/* <div>
                    <label htmlFor="profilePicture" className="text-sm text-gray-600">Profile Picture URL</label>
                    <div className="flex items-center space-x-2">
                      <Aperture size={20} className="text-blue-500" />
                      <Field
                        name="profilePicture"
                        type="text"
                        placeholder="Profile Picture URL"
                        className={`w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 ${errors.profilePicture && touched.profilePicture ? "focus:ring-red-500" : "focus:ring-purple-500"}`}
                      />
                      {errors.profilePicture && touched.profilePicture && (
                        <div className="text-red-500 text-sm mt-1">{errors.profilePicture}</div>
                      )}
                    </div>
                  </div> */}

                    {/* Age Field */}
                    <div>
                      <label htmlFor="age" className="text-sm text-gray-600">
                        Age
                      </label>
                      <div className="flex items-center space-x-2">
                        <CalendarDays size={20} className="text-blue-500" />
                        <Field
                          name="age"
                          type="number"
                          placeholder="Age"
                          className={`w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 ${
                            errors.age && touched.age
                              ? "focus:ring-red-500"
                              : "focus:ring-purple-500"
                          }`}
                        />
                      </div>
                      {errors.age && touched.age && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.age}
                        </div>
                      )}
                    </div>

                    {/* Gender Field */}
                    <div>
                      <label htmlFor="gender" className="text-sm text-gray-600">
                        Gender
                      </label>
                      <div className="flex items-center space-x-2">
                        <User2 size={20} className="text-blue-500" />
                        <Field
                          as="select"
                          name="gender"
                          className={`w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 ${
                            errors.gender && touched.gender
                              ? "focus:ring-red-500"
                              : "focus:ring-purple-500"
                          }`}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </Field>
                      </div>
                      {errors.gender && touched.gender && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.gender}
                        </div>
                      )}
                    </div>

                    {/* Height Field */}
                    <div>
                      <label htmlFor="height" className="text-sm text-gray-600">
                        Height (cm)
                      </label>
                      <div className="flex items-center space-x-2">
                        <Ruler size={20} className="text-blue-500" />
                        <Field
                          name="height"
                          type="number"
                          placeholder="Height"
                          className={`w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 ${
                            errors.height && touched.height
                              ? "focus:ring-red-500"
                              : "focus:ring-purple-500"
                          }`}
                        />
                      </div>
                      {errors.height && touched.height && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.height}
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="weight" className="text-sm text-gray-600">
                        Weight (kg)
                      </label>
                      <div className="flex items-center space-x-2">
                        <LucideDumbbell size={20} className="text-blue-500" />
                        <Field
                          type="number"
                          name="weight"
                          value={values.weight || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your Weight"
                          className={`w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 ${
                            errors.weight && touched.weight
                              ? "focus:ring-red-500"
                              : "focus:ring-purple-500"
                          }`}
                        />
                      </div>
                      {errors.weight && touched.weight && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.weight}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="bloodGroup"
                        className="text-sm text-gray-600"
                      >
                        Blood Group
                      </label>
                      <div className="flex items-center space-x-2">
                        <HeartPulse size={20} className="text-blue-500" />
                        <select
                          name="bloodGroup"
                          value={values.bloodGroup || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`border p-2 rounded w-full bg-gray-200 ${
                            errors.bloodGroup && touched.bloodGroup
                              ? "border-red-500"
                              : ""
                          }`}
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>
                      {errors.bloodGroup && touched.bloodGroup && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.bloodGroup}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="lg:w-1/1  rounded-lg p-6 bg-gray-200">
                <div className="flex flex-col items-center">
                  {/* Show uploaded profile picture or default */}
                  <img
                    src={imgSrc}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-blue-100"
                    onError={(e) =>
                      (e.currentTarget.src = "../../../profile.jpg")
                    }
                  />

                  <h3 className="font-medium text-gray-800">
                    {users.username}
                  </h3>

                  <div className="w-full mt-6 space-y-6">
                    {/* Profile picture upload */}
                    <label className="block text-sm font-medium text-gray-700">
                      Upload Profile Picture
                    </label>
                    <input
                      type="file"
                      name="profilePicture"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0 file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Aperture size={20} className="text-blue-500" />
                        <span className="text-sm">Status</span>
                      </div>
                      <CircleDot size={20} className="text-green-500 ml-48" />
                      {users.isBlocked === "true" ? (
                        <span>Blocked</span>
                      ) : (
                        <span className="text-green-500 relative">Active</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Store size={20} className="text-blue-500" />
                        <span className="text-sm">Joined</span>
                      </div>
                      <span className="text-sm text-gray-600 pl-12">
                        {new Date(users.createdAt).toLocaleDateString("en-GB")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Calendar size={20} className="text-blue-500" />
                        <span className="text-sm">Update</span>
                      </div>
                      <span className="text-sm text-gray-600 pl-12">
                        {new Date(users.updatedAt).toLocaleDateString("en-GB")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-full mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-blue-500 text-white py-3 rounded-lg ${
                    isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-600"
                  }`}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditProfile;
