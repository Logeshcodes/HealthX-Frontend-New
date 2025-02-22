import { Formik, Form, Field } from 'formik';
import * as Yup from "yup";
import { Card, CardContent, CardHeader, CardTitle } from '../../components/AdminComponents/common/Card';
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { getBannerById, updateBanner } from '../../api/action/AdminActionApi'; 


// Validation Schema
const validationSchema = Yup.object().shape({
  bannerTitle: Yup.string()
    .required('Banner title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date must be after start date'),
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
  const { id: bannerId } = useParams<{ id: string }>(); // Get Banner ID from URL
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

  const [imagePreview, setImagePreview] = useState<string | null>(null);


  useEffect(() => {
    const fetchBannerDetails = async () => {
      try {
        setLoading(true);
        if (!bannerId) return;
        
        const response = await getBannerById(bannerId);
        console.log(response.data.data, "Fetched Banner Data");
  
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
  
          // Set Image Preview
          if (banner.bannerImage) {
            setImagePreview(banner.bannerImage); // Assuming backend returns a URL
          }
        }
      } catch (error) {
        console.error("Error fetching banner details:", error);
        toast.error("Failed to load banner details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBannerDetails();
  }, [bannerId]);
  

  


  // Submit Handler
  const handleSubmit = async (values: BannerData) => {
    try {
      setLoading(true);

     
      const formData = new FormData();
      formData.append("bannerTitle", values.bannerTitle);
      formData.append("description", values.description);
      formData.append("startDate", values.startDate);
      formData.append("endDate", values.endDate);
      formData.append("link", values.link);
      formData.append("role", values.role);

      if (values.bannerImage instanceof File) {
        formData.append("bannerImage", values.bannerImage);
      }

      // API Call
      const response = await updateBanner(bannerId!, values);
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
              {({ errors, touched, setFieldValue, isSubmitting }) => (
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
                    {errors.bannerTitle && touched.bannerTitle && <div className="text-red-400 text-sm mt-1">{errors.bannerTitle}</div>}
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-1">Description</label>
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      rows="4"
                      className={`w-full px-3 py-2 rounded-md border bg-slate-800 text-white ${
                        errors.description && touched.description ? 'border-red-500' : 'border-blue-500'
                      }`}
                    />
                    {errors.description && touched.description && <div className="text-red-400 text-sm mt-1">{errors.description}</div>}
                  </div>

                  {/* Start & End Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field type="date" id="startDate" name="startDate" className="w-full px-3 py-2 rounded-md border bg-slate-800 text-white" />
                    <Field type="date" id="endDate" name="endDate" className="w-full px-3 py-2 rounded-md border bg-slate-800 text-white" />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-200 mb-1">Choose Banner Image</label>
                                        <input
                    type="file"
                    id="bannerImage"
                    name="bannerImage"
                    accept="image/*"
                    onChange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        if (file) {
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

                    {errors.bannerImage && touched.bannerImage && <div className="text-red-400 text-sm mt-1">{errors.bannerImage}</div>}
                  </div>

                  {/* Image Preview Section */}
                    {imagePreview && (
                    <div className="mt-4">
                        <p className="text-gray-300">Preview:</p>
                        <img
                        src={imagePreview}
                        alt="Banner Preview"
                        className="w-full h-96 object-cover rounded-lg border border-gray-600"
                        />
                    </div>
                    )}


                  {/* Submit Button */}
                  <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white py-3 rounded-lg">
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </Form>
              )}
            </Formik>
          ) : (
            <p className="text-white text-center">Loading...</p>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default EditBannerForm;
