import { useEffect, useState } from 'react';
import { Edit2, FileText, DollarSign, Briefcase , GraduationCap , Phone , Mail , User , Calendar , Store , CircleDot , Aperture , MapPin } from 'lucide-react';
import { getDoctorData , updateProfile } from '../../../api/action/DoctorActionApi';


import AlertDialog2 from '../../UserComponents/common/AlertDialogBox2';
import { toast } from "react-toastify";

import { Formik, Form , Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';

interface UserData {
  name: string;
  email: string;
  Mobile: string;
  department: string;
  education: string;
  experience: string;
  description: string;
  consultationType: string;
  consultationFee: string;
  isVerified: string;
  updatedAt: string;
  createdAt: string ;
  profilePicture : string ;
  location : string ,
  isBlocked : false ;
}


const EditProfile = () => {

  const navigate = useNavigate();




 const [doctors, setDoctors] = useState<UserData>({
    name: '',
    email: '',
    Mobile: '',
    department: '',
    education: '',
    experience: '',
    description: '',
    consultationType: '',
    consultationFee: '',
    isVerified: '',
    updatedAt: '',
    createdAt: '',
    profilePicture : '',
    location : '',
    isBlocked : false ,
  });


  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(3, 'Name must be at least 3 characters')
      .max(50, 'Name must be at most 50 characters'),
    
    location : Yup.string()
    .required('Location is required')
    .min(15, 'Name must be at least 15 characters')
    .max(100, 'Name must be at most 100 characters'),

    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),

    Mobile: Yup.string()
      .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
      .required('Mobile number is required'),

    department: Yup.string()
      .required('Department is required'),

    education: Yup.string()
      .required('Education is required'),

    experience: Yup.number()
      .positive('Experience must be a positive number')
      .integer('Experience must be an integer')
      .required('Experience is required'),

    profilePicture: Yup.mixed().notRequired(),
      
     isBlocked: Yup.boolean().notRequired(),

    description: Yup.string()
      .max(500, 'Description must be at most 500 characters'),

    consultationType: Yup.string()
      .oneOf(['In-Person', 'Online' , 'Both'], 'Invalid consultation type')
      .required('Consultation type is required'),

    consultationFee: Yup.number()
      .positive('Consultation fee must be a positive number')
      .required('Consultation fee is required'),

    isVerified: Yup.string()
      .oneOf(['Yes', 'No'], 'Invalid verification status')
      .required('Verification status is required')

    
  });





  const [loading, setLoading] = useState<boolean>(true);

  console.log(loading);


    useEffect(() => {
      const fetchDoctors = async () => {
        try {
          const doctorDataString = localStorage.getItem('doctor');
          if (doctorDataString) {
            const doctor = JSON.parse(doctorDataString);
            const email = doctor?.email;
            console.log('Doctor Email:', email);
  
            if (email) {
              const data = await getDoctorData(email);
              console.log('Doctors list:', data);
              setDoctors(data);
            }
          } else {
            console.log('No doctor data found in localStorage');
          }
        } catch (error) {
          console.log('Error fetching doctors:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchDoctors();
    }, []);
  


    const initialValues = {
      name: doctors.name,
      email: doctors.email,
      Mobile: doctors.Mobile,
      department: doctors.department,
      education: doctors.education,
      experience: doctors.experience,
      description: doctors.description,
      consultationType: doctors.consultationType,
      consultationFee: doctors.consultationFee,
      isVerified: doctors.isVerified,
      createdAt : doctors.createdAt,
      updatedAt : doctors.updatedAt,
      location : doctors.location,
      profilePicture : doctors.profilePicture ,
      isBlocked : doctors.isBlocked ,
    };


      const handleSubmit = async (data: UserData, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) =>{
        try {
          console.log("clicked...")
          setSubmitting(true);
          
          const formData = new FormData();
          Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
          });
          console.log(formData , "formdata")
          const response = await updateProfile(formData);
    
          if (response.success) {
            toast.success("Profile updated successfully");
            navigate(`/doctor/profile/my-account`);
          } else {
            toast.error(response.message || "Failed to update profile");
          }
        } catch (error) {
          console.error(error);
          toast.error("An unexpected error occurred");
        }finally {
          setSubmitting(false); 
        }
      };


      const handleImageUpload = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          setDoctors((prev) => ({
            ...prev,
            profilePicture: file, // Store the file itself, not the base64 string
          }));
        }
      };
  

      const [imgSrc, setImgSrc] = useState(
        doctors.profilePicture || "../../../profile.jpg"
        );
      
        useEffect(() => {
          if (doctors?.profilePicture) {
            setImgSrc(doctors.profilePicture);
            console.log(doctors.profilePicture , "pic")
          }
        }, [doctors.profilePicture]);


  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">


<Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => handleSubmit(values, { setSubmitting })}
            >
              {({ isSubmitting,setSubmitting , values  , errors, touched }) => (
                <Form className="space-y-4">



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>
            
            
             




           

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="text-sm text-gray-600">Name</label>
                    <div className="flex items-center space-x-2">
                      <User size={20} className="text-blue-500" />
                      <Field
                        name="name"
                        type="text"
                        placeholder="Name"
                        className={`w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 ${errors.name && touched.name ? "focus:ring-red-500" : "focus:ring-purple-500"}`}
                      />
                        </div>
                      {errors.name && touched.name && (
                        <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                      )}
                  </div>



                    {/* Mobile Field */}
                    <div>
                    <label htmlFor="Mobile" className="text-sm text-gray-600">Mobile</label>
                    <div className="flex items-center space-x-2">
                      <Phone size={20} className="text-blue-500" />
                      <Field
                        name="Mobile"
                        type="text"
                        placeholder="Mobile"
                        className={`w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 ${errors.Mobile && touched.Mobile ? "focus:ring-red-500" : "focus:ring-purple-500"}`}
                      />
                        </div>
                      {errors.Mobile && touched.Mobile && (
                        <div className="text-red-500 text-sm mt-1">{errors.Mobile}</div>
                      )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="text-sm text-gray-600">Email</label>
                    <div className="flex items-center space-x-2">
                      <Mail size={20} className="text-blue-500" />
                      <Field
                        name="email"
                        type="email"
                        disabled
                        placeholder="Email"
                        className={`w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 ${errors.email && touched.email ? "focus:ring-red-500" : "focus:ring-purple-500"}`}
                      />
                        </div>
                      {errors.email && touched.email && (
                        <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                      )}
                  </div>

                

                  {/* Department Field */}
                  <div>
                    <label htmlFor="department" className="text-sm text-gray-600">Department</label>
                    <div className="flex items-center space-x-2">
                      <Briefcase size={20} className="text-blue-500" />
                      <Field
                        name="department"
                        type="text"
                        disabled
                        placeholder="Department"
                        className={`w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 ${errors.department && touched.department ? "focus:ring-red-500" : "focus:ring-purple-500"}`}
                      />
                        </div>
                      {errors.department && touched.department && (
                        <div className="text-red-500 text-sm mt-1">{errors.department}</div>
                      )}
                  </div>

                  {/* Education Field */}
                  <div>
                    <label htmlFor="education" className="text-sm text-gray-600">Education</label>
                    <div className="flex items-center space-x-2">
                      <GraduationCap size={20} className="text-blue-500" />
                      <Field
                        name="education"
                        type="text"
                        placeholder="Education"
                        disabled
                        className={`w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 ${errors.education && touched.education ? "focus:ring-red-500" : "focus:ring-purple-500"}`}
                      />
                        </div>
                      {errors.education && touched.education && (
                        <div className="text-red-500 text-sm mt-1">{errors.education}</div>
                      )}
                  </div>




                    



                    {/* -- */}


                    
                  {/* Experience Field */}
                  <div>
                    <label htmlFor="experience" className="text-sm text-gray-600">Experience (Years)</label>
                    <div className="flex items-center space-x-2">
                      <Edit2 size={20} className="text-blue-500" />
                      <Field
                        name="experience"
                        type="number"
                        placeholder="Experience"
                        className={`w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 ${errors.experience && touched.experience ? "focus:ring-red-500" : "focus:ring-purple-500"}`}
                      />
                        </div>
                      {errors.experience && touched.experience && (
                        <div className="text-red-500 text-sm mt-1">{errors.experience}</div>
                      )}
                  </div>

               


                   {/* Consultation Fee Field */}
                   <div>
                    <label htmlFor="consultationFee" className="text-sm text-gray-600">Consultation Fee</label>
                    <div className="flex items-center space-x-2">
                      <DollarSign size={20} className="text-blue-500" />
                      <Field
                        name="consultationFee"
                        type="number"
                        placeholder="Consultation Fee"
                        className={`w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 ${errors.consultationFee && touched.consultationFee ? "focus:ring-red-500" : "focus:ring-purple-500"}`}
                      />
                        </div>
                      {errors.consultationFee && touched.consultationFee && (
                        <div className="text-red-500 text-sm mt-1">{errors.consultationFee}</div>
                      )}
                  </div>

                  {/* Consultation Type Field */}
                  <div>
                    <label htmlFor="consultationType" className="text-sm text-gray-600">Consultation Type</label>
                    <div className="flex items-center space-x-2">
                      <Briefcase size={20} className="text-blue-500" />
                      <Field
                        as="select"
                        name="consultationType"
                        className={`w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 ${errors.consultationType && touched.consultationType ? "focus:ring-red-500" : "focus:ring-purple-500"}`}
                      >
                        <option value="">Select Type</option>
                        <option value="Both">Both</option>
                        <option value="Online">Online</option>
                        <option value="In-Person">In-Person</option>
                      </Field>
                      </div>
                      {errors.consultationType && touched.consultationType && (
                        <div className="text-red-500 text-sm mt-1">{errors.consultationType}</div>
                      )}
                  </div>

                 


                 
                     {/* Description Field */}
                  <div >
                    <label htmlFor="description" className="text-sm text-gray-600">Description</label>
                    <div className="flex items-center space-x-4">
                      <FileText size={20} className="text-blue-500" />
                      <Field
                        name="description"
                        as="textarea"
                        placeholder="Description"
                        className={`w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 ${errors.description && touched.description ? "focus:ring-red-500" : "focus:ring-purple-500"}`}
                      />
                        </div>
                      {errors.description && touched.description && (
                        <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                      )}
                  
                  </div>


                  {/* location */}

                      {
                        (doctors.consultationType === 'Both' || doctors.consultationType === 'In-Person' ) &&

                          <div>
                          <label htmlFor="location" className="text-sm text-gray-600">Location</label>
                          <div className="flex items-center space-x-2">
                            <MapPin size={20} className="text-blue-500" />
                            <Field
                              name="location"
                              type="text"
                              placeholder="Location"
                              className={`w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 ${errors.location && touched.location ? "focus:ring-red-500" : "focus:ring-purple-500"}`}
                            />
                              </div>
                            {errors.location && touched.location && (
                              <div className="text-red-500 text-sm mt-1">{errors.location}</div>
                            )}
                        </div>


                       
                      }

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
                          onError={(e) => (e.currentTarget.src = "../../../profile.jpg")}
                        />
            
            
                        <h3 className="font-medium text-gray-800">{doctors.name}</h3>
                        <p className="text-gray-500">{doctors.department}</p>
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
                            {doctors.isBlocked === false ? (
                              <span className="text-green-500 relative">Active</span>
                            ) : (
                              
                              <span>Blocked</span>
                            )}
                          </div>
            
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Store size={20} className="text-blue-500" />
                              <span className="text-sm">Joined</span>
                            </div>
                            <span className="text-sm text-gray-600 pl-12">
                              {new Date(doctors.createdAt).toLocaleDateString("en-GB")}
                            </span>
                          </div>
            
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Calendar size={20} className="text-blue-500" />
                              <span className="text-sm">Update</span>
                            </div>
                            <span className="text-sm text-gray-600 pl-12">
                              {new Date(doctors.updatedAt).toLocaleDateString("en-GB")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>


                    <div className="col-span-full mt-4">
                    <AlertDialog2
                      title="Confirm Changes"
                      alert="Are you sure you want to update your details?"
                      onConfirm={() => handleSubmit(values, { setSubmitting })} // ✅ Corrected
                    >
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-blue-500 text-white py-3 rounded-lg ${
                          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                        }`}
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </button>
                    </AlertDialog2>

                    </div>
         



         
        </div>


        </Form>
                  )}
                </Formik>

        

      </div>
      

    

  );
};

export default EditProfile;




