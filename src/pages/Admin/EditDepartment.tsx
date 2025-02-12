import { Save, XCircle } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getDepartmentByName, updateDepartment } from '../../api/action/AdminActionApi';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { decodeURI } from '../../utils/decodeURI';

interface EditDepartmentFormProps {
  isDarkMode: boolean;
}

interface DepartmentFormValues {
  departmentName: string;
}

const EditDepartmentForm: React.FC<EditDepartmentFormProps> = ({ isDarkMode }) => {
  const [loader, setLoader] = useState(false);
  const { departmentName } = useParams<{ departmentName: string }>();
  const navigate = useNavigate();

  



  const location = useLocation(); 


  useEffect(()=> {

    const fetchDepartmentDetails = async()=> {
      try {
        const department = decodeURI(location.pathname.split('/').pop() || '');
       
        console.log("inside fetch dept",department)
        const response = await getDepartmentByName(department)
   
         formik.setValues({ departmentName: response?.data[0].departmentName });
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    }
    fetchDepartmentDetails()
  },[])



  const handleSubmit = useCallback(
    async (values: DepartmentFormValues) => {
      try {
        setLoader(true);
        const departmentName = decodeURI(location.pathname.split('/').pop() || '');
        console.log(departmentName, "....")
        console.log(values, "....")
        const response = await updateDepartment(departmentName!, values);
        if (response.success) {
          toast.success(response.message);
          navigate('/admin/department');
        } else {
          toast.error(response.message);
        }
      } catch (error: any) {
        toast.error(error.message || 'Unknown Error Occurred!');
      } finally {
        setLoader(false);
      }
    },
    [departmentName, navigate]
  );

  const formik = useFormik({
    initialValues: {
      departmentName: '',
    },
    validationSchema: Yup.object({
      departmentName: Yup.string()
        .trim()
        .required('Department Name is required')
        .matches(/\S/, 'Department Name cannot be just spaces'),
    }),
    onSubmit: handleSubmit,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue(event.target.name, event.target.value.trimStart());
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className={`mb-6 p-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
    >
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium">Department Name</label>
          <input
            type="text"
            name="departmentName"
            value={formik.values.departmentName}
            onChange={handleInputChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 text-black rounded border ${
              formik.touched.departmentName && formik.errors.departmentName ? 'border-red-500' : ''
            }`}
            placeholder="Enter department name"
            required
          />
          {formik.touched.departmentName && formik.errors.departmentName && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.departmentName}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex space-x-4">
        <button
          type="submit"
          className={`px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 ${
            loader ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loader}
        >
          <Save className="h-4 w-4 inline mr-2" />
          {loader ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/department')}
          className="px-4 py-2 bg-gray-500 text-black rounded-lg shadow hover:bg-gray-600"
        >
          <XCircle className="h-4 w-4 inline mr-2" />
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditDepartmentForm;
