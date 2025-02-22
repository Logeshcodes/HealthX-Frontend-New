import { Formik, Form, Field } from 'formik';
import * as Yup from "yup";
import { Card, CardContent, CardHeader, CardTitle } from '../../components/AdminComponents/common/Card';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { addBanner } from '../../api/action/AdminActionApi';

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
  bannerImage: Yup.mixed().required('Banner image is required'),
});

interface BannerData {
  bannerTitle: string;
  description: string;
  startDate: string;
  endDate: string;
  link: string;
  role: string;
  bannerImage: File | null; // Store as a File object
}

const BannerForm = () => {
  const initialValues: BannerData = {
    bannerTitle: '',
    description: '',
    startDate: '',
    endDate: '',
    link: '',
    role: '',
    bannerImage: null, // Initialize as null
  };

  const navigate = useNavigate();

  const handleSubmit = async (data: BannerData) => {
    try {
      console.log("Form submitted:", data);

      const formData = new FormData();
      if (data.bannerImage) {
        formData.append("bannerImage", data.bannerImage);
      }

      Object.entries(data).forEach(([key, value]) => {
        if (key !== "bannerImage") {
          formData.append(key, value);
        }
      });

      // Log form data for debugging
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await addBanner(formData);

      if (response.success) {
        toast.success("Banner added successfully");
        navigate(`/admin/banners`);
      } else {
        toast.error(response.message || "Failed to add banner");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <Card className="w-full mx-auto bg-slate-900">
      <div className="min-h-screen bg-slate-800 p-4 md:p-6 lg:p-8 rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Add New Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, setFieldValue, isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="bannerTitle" className="block text-sm font-medium text-gray-200 mb-1">
                    Banner Title
                  </label>
                  <Field
                    id="bannerTitle"
                    name="bannerTitle"
                    className={`w-full px-3 py-2 rounded-md border bg-slate-800 text-white ${
                      errors.bannerTitle && touched.bannerTitle ? 'border-red-500' : 'border-blue-500 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                  {errors.bannerTitle && touched.bannerTitle && <div className="text-red-400 text-sm mt-1">{errors.bannerTitle}</div>}
                </div>

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
                      errors.description && touched.description ? 'border-red-500' : 'border-blue-500 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                  {errors.description && touched.description && <div className="text-red-400 text-sm mt-1">{errors.description}</div>}
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-200 mb-1">Role</label>
                  <Field as="select" id="role" name="role" className="w-full px-3 py-2 rounded-md border bg-slate-800 text-white">
                    <option value="">Select Role</option>
                    <option value="Patient">Patient</option>
                    <option value="Doctor">Doctor</option>
                  </Field>
                  {errors.role && touched.role && <div className="text-red-400 text-sm mt-1">{errors.role}</div>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-200 mb-1">Start Date</label>
                    <Field type="date" id="startDate" name="startDate" className="w-full px-3 py-2 rounded-md border bg-slate-800 text-white" />
                    {errors.startDate && touched.startDate && <div className="text-red-400 text-sm mt-1">{errors.startDate}</div>}
                  </div>

                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-200 mb-1">End Date</label>
                    <Field type="date" id="endDate" name="endDate" className="w-full px-3 py-2 rounded-md border bg-slate-800 text-white" />
                    {errors.endDate && touched.endDate && <div className="text-red-400 text-sm mt-1">{errors.endDate}</div>}
                  </div>
                </div>

                <div>
                  <label htmlFor="link" className="block text-sm font-medium text-gray-200 mb-1">Link</label>
                  <Field id="link" name="link" className="w-full px-3 py-2 rounded-md border bg-slate-800 text-white" />
                  {errors.link && touched.link && <div className="text-red-400 text-sm mt-1">{errors.link}</div>}
                </div>

                {/* File Upload Field */}
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
                      }
                    }}
                    className="w-full px-3 py-2 rounded-md border bg-slate-800 text-white"
                  />
                  {errors.bannerImage && touched.bannerImage && <div className="text-red-400 text-sm mt-1">{errors.bannerImage}</div>}
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white py-3 rounded-lg">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </div>
    </Card>
  );
};

export default BannerForm;
