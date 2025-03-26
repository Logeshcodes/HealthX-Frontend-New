import { Formik, Form, Field } from 'formik';
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '../../components/AdminComponents/common/Card';
import { getBannerById, updateBanner } from '../../api/action/AdminActionApi'; 

const validationSchema = Yup.object().shape({
  bannerTitle: Yup.string()
    .required('Banner title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  startDate: Yup.date()
    .required('Start date is required')
    .test(
      'is-future',
      'Start date cannot be in the past',
      function(value) {
        return new Date(value) >= new Date(new Date().setHours(0, 0, 0, 0));
      }
    ),
  endDate: Yup.date()
    .required('End date is required')
    .min(
      Yup.ref('startDate'), 
      'End date must be after start date'
    )
    .test(
      'is-future',
      'End date cannot be in the past',
      function(value) {
        return new Date(value) >= new Date(new Date().setHours(0, 0, 0, 0));
      }
    ),
  link: Yup.string().required('Link is required'),
  bannerImage: Yup.mixed(),
});

interface BannerData {
  _id?: string;
  bannerTitle: string;
  description: string;
  startDate: string;
  endDate: string;
  link: string;
  role: string;
  bannerImage: File | string | null; 
}

const EditBannerForm = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { id: bannerId } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<BannerData>({
    bannerTitle: '',
    description: '',
    startDate: '',
    endDate: '',
    link: '',
    role: '',
    bannerImage: null,
  });

  const today = new Date().toISOString().split('T')[0]; // For date input min attribute

  useEffect(() => {
    const fetchBannerDetails = async () => {
      try {
        setLoading(true);
        if (!bannerId) return;
        
        const response = await getBannerById(bannerId);
        const banner = response.data.data; 
        
        if (banner) {
          setInitialValues({
            _id: banner._id || "",
            bannerTitle: banner.bannerTitle || "",
            description: banner.description || "",
            startDate: banner.startDate ? banner.startDate.split('T')[0] : "",
            endDate: banner.endDate ? banner.endDate.split('T')[0] : "",
            link: banner.link || "",
            role: banner.role || "",
            bannerImage: banner.bannerImage || null,
          });
  
          if (banner.bannerImage) {
            setImagePreview(banner.bannerImage); 
          }
        }
      } catch (error) {
        toast.error("Failed to load banner details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBannerDetails();
  }, [bannerId]);
  

  const handleSubmit = async (values: BannerData) => {
    try {
      setLoading(true);
     
      const formData = new FormData();

      if (values.bannerImage && typeof values.bannerImage !== 'string') {
        formData.append("bannerImage", values.bannerImage);
      }

      Object.entries(values).forEach(([key, value]) => {
        if (key !== "bannerImage" && value !== null) {
          formData.append(key, value.toString());
        }
      });
  
      const response = await updateBanner(bannerId!, formData);
      if (response.success) {
        toast.success(response.message);
        navigate('/admin/banners');
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      console.error("Update Error:", error);
      toast.error(error.message || 'Unknown Error Occurred!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full mx-auto bg-slate-900">
      <div className="min-h-screen bg-slate-800 p-4 md:p-6 lg:p-8 rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Edit Banner</CardTitle>
        </CardHeader>
        <CardContent>
          {!loading ? (
            <Formik
              initialValues={initialValues}
              enableReinitialize={true}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, setFieldValue, isSubmitting, values }) => (
                <Form className="space-y-6">
                  {/* Banner Title */}
                  <div>
                    <label htmlFor="bannerTitle" className="block text-sm font-medium text-gray-200 mb-1">
                      Banner Title
                    </label>
                    <Field
                      id="bannerTitle"
                      name="bannerTitle"
                      className={`w-full px-3 py-2 rounded-md border bg-slate-800 text-white ${
                        errors.bannerTitle && touched.bannerTitle ? 'border-red-500' : 'border-blue-500'
                      }`}
                    />
                    {errors.bannerTitle && touched.bannerTitle && (
                      <div className="text-red-400 text-sm mt-1">{errors.bannerTitle}</div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-1">
                      Description
                    </label>
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      rows="4"
                      className={`w-full px-3 py-2 rounded-md border bg-slate-800 text-white ${
                        errors.description && touched.description ? 'border-red-500' : 'border-blue-500'
                      }`}
                    />
                    {errors.description && touched.description && (
                      <div className="text-red-400 text-sm mt-1">{errors.description}</div>
                    )}
                  </div>

                  {/* Role */}
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-200 mb-1">
                      Role
                    </label>
                    <Field
                      as="select"
                      id="role"
                      name="role"
                      className={`w-full px-3 py-2 rounded-md border bg-slate-800 text-white ${
                        errors.role && touched.role ? 'border-red-500' : 'border-blue-500'
                      }`}
                    >
                      <option value="">Select Role</option>
                      <option value="Patient">Patient</option>
                      <option value="Doctor">Doctor</option>
                    </Field>
                    {errors.role && touched.role && (
                      <div className="text-red-400 text-sm mt-1">{errors.role}</div>
                    )}
                  </div>

                  {/* Start & End Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-200 mb-1">
                        Start Date
                      </label>
                      <Field 
                        type="date" 
                        id="startDate" 
                        name="startDate" 
                        min={today}
                        className={`w-full px-3 py-2 rounded-md border bg-slate-800 text-white ${
                          errors.startDate && touched.startDate ? 'border-red-500' : 'border-blue-500'
                        }`}
                      />
                      {errors.startDate && touched.startDate && (
                        <div className="text-red-400 text-sm mt-1">{errors.startDate}</div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-200 mb-1">
                        End Date
                      </label>
                      <Field 
                        type="date" 
                        id="endDate" 
                        name="endDate" 
                        min={values.startDate || today}
                        className={`w-full px-3 py-2 rounded-md border bg-slate-800 text-white ${
                          errors.endDate && touched.endDate ? 'border-red-500' : 'border-blue-500'
                        }`}
                      />
                      {errors.endDate && touched.endDate && (
                        <div className="text-red-400 text-sm mt-1">{errors.endDate}</div>
                      )}
                    </div>
                  </div>

                  {/* Link */}
                  <div>
                    <label htmlFor="link" className="block text-sm font-medium text-gray-200 mb-1">
                      Link
                    </label>
                    <Field 
                      id="link" 
                      name="link" 
                      className={`w-full px-3 py-2 rounded-md border bg-slate-800 text-white ${
                        errors.link && touched.link ? 'border-red-500' : 'border-blue-500'
                      }`}
                    />
                    {errors.link && touched.link && (
                      <div className="text-red-400 text-sm mt-1">{errors.link}</div>
                    )}
                  </div>                

                  {/* File Upload */}
                  <div>
                    <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-200 mb-1">
                      Banner Image
                    </label>
                    <input
                      type="file"
                      id="bannerImage"
                      name="bannerImage"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        if (file) {
                          const maxSize = 3 * 1024 * 1024; // 3MB
                          if (!file.type.startsWith("image/")) {
                            toast.error("Only image files are allowed");
                            return;
                          }
                          if (file.size > maxSize) {
                            toast.error("File size must be less than 3MB");
                            return;
                          }
                          setFieldValue("bannerImage", file);
                          
                          // Update Preview
                          const reader = new FileReader();
                          reader.onload = () => {
                            setImagePreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full px-3 py-2 rounded-md border bg-slate-800 text-white"
                    />
                    {errors.bannerImage && touched.bannerImage && (
                      <div className="text-red-400 text-sm mt-1">{errors.bannerImage}</div>
                    )}
                  </div>

                  {/* Image Preview Section */}
                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-gray-300 mb-2">Current Banner:</p>
                      <img
                        src={imagePreview}
                        alt="Banner Preview"
                        className="w-full h-96 object-cover rounded-lg border border-gray-600"
                      />
                    </div>
                  )}

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </Form>
              )}
            </Formik>
          ) : (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default EditBannerForm;