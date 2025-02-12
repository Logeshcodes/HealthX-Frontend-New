
import { Formik, Form, Field } from 'formik';
import * as Yup from "yup"
import { Card , CardContent , CardHeader ,CardTitle } from '../../components/AdminComponents/common/Card';
import { Button } from '../../components/AdminComponents/common/Button';

const validationSchema = Yup.object().shape({
  bannerTitle: Yup.string()
    .required('Banner title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  startDate: Yup.date()
    .required('Start date is required'),  
  endDate: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date must be after start date'),
  link: Yup.string()
    .url('Please enter a valid URL')
    .required('Link is required'),
  bannerImage: Yup.mixed()
    .required('Banner image is required')
});

const BannerForm = () => {
  const initialValues = {
    bannerTitle: '',
    description: '',
    startDate: '',
    endDate: '',
    link: '',
    bannerImage: null
  };

  const handleSubmit = () => {
    
  };

  return (
    <div className="min-h-screen bg-slate-800 p-4 md:p-6 lg:p-8">
      <Card className="max-w-2xl mx-auto bg-slate-900">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Add New Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {/* {({ errors, touched, setFieldValue }) => ( */}
            {({ errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="bannerTitle" className="block text-sm font-medium text-gray-200  mb-1">
                    Banner Title
                  </label>
                  <Field
                    id="bannerTitle"
                    name="bannerTitle"
                    className={`w-full px-3 py-2 rounded-md border bg-slate-800 text-white ${
                      errors.bannerTitle && touched.bannerTitle
                        ? 'border-red-500'
                        : 'border-blue-500 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                  {errors.bannerTitle && touched.bannerTitle && (
                    <div className="text-red-400 text-sm mt-1">{errors.bannerTitle}</div>
                  )}
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
                      errors.description && touched.description
                        ? 'border-red-500'
                        : 'border-blue-500 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                  {errors.description && touched.description && (
                    <div className="text-red-400 text-sm mt-1">{errors.description}</div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-200 mb-1">
                      Start Date
                    </label>
                    <Field
                      type="date"
                      id="startDate"
                      name="startDate"
                      className={`w-full px-3 py-2 rounded-md border bg-slate-800 text-white ${
                        errors.startDate && touched.startDate
                          ? 'border-red-500'
                          : 'border-blue-500 focus:ring-2 focus:ring-blue-500'
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
                      className={`w-full px-3 py-2 rounded-md border bg-slate-800 text-white ${
                        errors.endDate && touched.endDate
                          ? 'border-red-500'
                          : 'border-blue-500 focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                    {errors.endDate && touched.endDate && (
                      <div className="text-red-400 text-sm mt-1">{errors.endDate}</div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="link" className="block text-sm font-medium text-gray-200 mb-1">
                    Link
                  </label>
                  <Field
                    id="link"
                    name="link"
                    className={`w-full px-3 py-2 rounded-md border bg-slate-800 text-white ${
                      errors.link && touched.link
                        ? 'border-red-500'
                        : 'border-blue-500 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                  {errors.link && touched.link && (
                    <div className="text-red-400 text-sm mt-1">{errors.link}</div>
                  )}
                </div>

                {/* <div>
                  <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-200 mb-1">
                    Choose Banner Image
                  </label>
                  <input
                    type="file"
                    id="bannerImage"
                    name="bannerImage"
                    accept="image/*"
                    onChange={(event) => {
                      setFieldValue('bannerImage', event.currentTarget.files[0]);
                    }}
                    className={`w-full px-3 py-2 rounded-md border bg-slate-800 text-white ${
                      errors.bannerImage && touched.bannerImage
                        ? 'border-red-500'
                        : 'border-blue-500 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                  {errors.bannerImage && touched.bannerImage && (
                    <div className="text-red-400 text-sm mt-1">{errors.bannerImage}</div>
                  )}
                </div> */}

                <Button 
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-black rounded-lg
            hover:from-blue-600 hover:to-blue-700 transition-all duration-200 
            shadow-md hover:shadow-lg transform hover:-translate-y-0.5
            flex items-center gap-2 font-medium"
                >
                  Publish
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default BannerForm;