import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getDoctorData , sendVerification   } from '../../../api/action/DoctorActionApi';

const VerifyProfileSchema = Yup.object().shape({
  medicalLicense: Yup.mixed().nullable().required("Medical license is required."),
   
  degreeCertificate: Yup.mixed().nullable().required("Degree certificate is required."),
});


// medicalLicense: Yup.mixed()
// .required("Medical license is required.")
// .test(
//   "fileType",
//   "Invalid file format. Supported formats: SVG, PNG, JPG, or PDF",
//   (value: any) =>
//     value &&
//     ["image/png", "image/jpeg", "image/svg+xml", "application/pdf"].includes(value.type)
// ),


const VerifyProfile  = () => {

  
  const navigate = useNavigate()

  const [doctors, setDoctors] = useState<any>({});
  const [medicalLicensePreview, setMedicalLicensePreview] = useState<string | null>(null);
  const [degreeCertificatePreview, setDegreeCertificatePreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);



  console.log(doctors)

      useEffect(() => {
        const fetchDoctors = async () => {
          try {

            

            const doctorDataString = localStorage.getItem('doctor');
            if (doctorDataString) {
              const doctor = JSON.parse(doctorDataString);
              const email = doctor?.email;
              // console.log('Doctor Email:', email);
    
              if (email) {
                const data = await getDoctorData(email);
                // console.log('Doctors list:', data);
                setDoctors(data);
              }
            } else {
              console.log('No doctor data found in localStorage');
             
            }
          } catch (error) {
            console.log('Error fetching doctors:', error);
          } 
        };
    
        fetchDoctors();
      }, []);




  const handleFilePreview = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: File | null) => void,
    fieldName: string,
    setPreview: (preview: string | null) => void
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFieldValue(fieldName, file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };



  interface verifyData  {
    medicalLicense : string ,
    degreeCertificate : string 
  }


   const handleSubmit = async (data: verifyData) => {

          try {
            console.log("clicked...")

            setIsLoading(true) ;
            
            const formData = new FormData();


            const doctorDataString = localStorage.getItem('doctor');

            if (doctorDataString) {
              const doctor = JSON.parse(doctorDataString);
              const email = doctor?.email;
              const name = doctor?.name ;
              const department = doctor?.department ;
              const education = doctor?.education ;

              console.log("show" , email  , name)
              
              formData.append("email", email);
              formData.append("name", name);
              formData.append("department", department);
              formData.append("education", education);
              
            }

            
            if (data.medicalLicense) {
              formData.append("medicalLicense", data.medicalLicense);
            }

            if (data.degreeCertificate) {
              formData.append("degreeCertificate", data.degreeCertificate);
            }
          
            console.log(formData , "formdata")
            const response = await sendVerification(formData);

            console.log("response" , response )
      
            if (response.success) {

              toast.success(response.message);
              // toast.success("Documents submitted successfully");
              navigate(`/doctor/profile/my-account`);
            } else {
              toast.error(response.message || "Failed to update profile");
            }
          } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred");
          }finally {
            setIsLoading(false)
          }
        };


      

  return (
    <Formik
      initialValues={{
        medicalLicense: '',
        degreeCertificate: '',
      }}
      validationSchema={VerifyProfileSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue }) => (
        <Form className="bg-white rounded-lg p-6 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Medical License */}
            <div className="bg-sky-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-white">Upload Medical License</h2>
              <div className="flex flex-col items-center">
                <label
                  htmlFor="medicalLicense"
                  className="w-full mt-6 border-2 border-dashed border-blue-600 rounded-lg p-6 text-center cursor-pointer"
                >
                  <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-blue-500 hover:underline">Click to upload</p>
                  <p className="text-gray-400 text-sm mt-2">or drag and drop</p>
                  <p className="text-gray-400 text-sm mt-1">SVG, PNG, JPG, or PDF</p>
                  <input
                    id="medicalLicense"
                    type="file"
                    name="medicalLicense"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) =>
                      handleFilePreview(e, setFieldValue, "medicalLicense", setMedicalLicensePreview)
                    }
                  />
                </label>
                <ErrorMessage name="medicalLicense" component="div" className="text-red-500 mt-2" />
                {medicalLicensePreview && (
                  <img
                    src={medicalLicensePreview}
                    alt="Medical License Preview"
                    className="w-full h-auto mt-4"
                  />
                )}
              </div>
            </div>

            {/* Upload Experience or Degree Certificate */}
            <div className="bg-sky-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-white">
                Upload Experience or Degree Certificate
              </h2>
              <div className="flex flex-col items-center">
                <label
                  htmlFor="degreeCertificate"
                  className="w-full mt-6 border-2 border-dashed border-blue-600 rounded-lg p-6 text-center cursor-pointer"
                >
                  <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-blue-500 hover:underline">Click to upload</p>
                  <p className="text-gray-400 text-sm mt-2">or drag and drop</p>
                  <p className="text-gray-400 text-sm mt-1">SVG, PNG, JPG, or PDF</p>
                  <input
                    id="degreeCertificate"
                    type="file"
                    name="degreeCertificate"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) =>
                      handleFilePreview(
                        e,
                        setFieldValue,
                        "degreeCertificate",
                        setDegreeCertificatePreview
                      )
                    }
                  />
                </label>
                <ErrorMessage
                  name="degreeCertificate"
                  component="div"
                  className="text-red-500 mt-2"
                />
                {degreeCertificatePreview && (
                  <img
                    src={degreeCertificatePreview}
                    alt="Degree Certificate Preview"
                    className="w-full h-auto mt-4"
                  />
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`mt-6 px-4 py-2 rounded text-white ${
              isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>

        </Form>
      )}
    </Formik>
  );
};

export default VerifyProfile;
