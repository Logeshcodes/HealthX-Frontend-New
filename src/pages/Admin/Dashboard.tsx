import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Common/card/Card';

import { getAllDoctors } from '../../api/action/AdminActionApi';
import { getAllDepartment } from '../../api/action/AdminActionApi';
import { getAllUser } from '../../api/action/AdminActionApi';

import { User, Stethoscope, Building } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  isDarkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isDarkMode }) => {

  const [doctorsCount , setDoctorsCount] = useState(0) ;
  const [ usersCount , setUsersCount] = useState(0);
  const [ deptCount , setDeptCount] = useState(0);

  const navigate = useNavigate()


  useEffect(()=>{


    const fetchDoctors = async ()=>{

      const doctorData = await getAllDoctors();
      const len = doctorData.length ;
      setDoctorsCount(len)
    }

    fetchDoctors()

    const fetchUsers = async()=>{
        const userData = await getAllUser()
        const len = userData.length ;
        setUsersCount(len);
    }
    fetchUsers()


    const fetchDepartments = async()=>{
      const departmentData = await getAllDepartment()
      const len = departmentData.data.departments.length ;
      setDeptCount(len);
    }

    fetchDepartments()

  },[usersCount , deptCount])


  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <h1 className="text-3xl font-bold mb-8 text-blue-500">Admin Dashboard</h1>

      <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onClick={()=> navigate('/admin/verifiedDoctors')}>
                <Card className={`p-6 hover:bg-gray-700 ${isDarkMode ? 'bg-gray-800' : 'bg-white '}`}>
                  <div  className="flex items-center mb-4">
                    <Stethoscope className="w-6 h-6 text-blue-500 mr-2" /> 
                    <h3 className="text-lg">Doctor Count</h3>
                  </div>
                  <p className="text-3xl font-bold">{doctorsCount}</p>
                </Card>
                </div>

                <div onClick={()=> navigate('/admin/users')}>
                <Card className={`p-6 hover:bg-gray-700 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex items-center mb-4">
                    <User className="w-6 h-6 text-green-500 mr-2" /> 
                    <h3 className="text-lg">Users Count</h3>
                  </div>
                  <p className="text-3xl font-bold">{usersCount}</p>
                </Card>
                </div>

                <div onClick={()=> navigate('/admin/department')}>
                <Card className={`p-6 hover:bg-gray-700 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex items-center mb-4">
                    <Building className="w-6 h-6 text-yellow-500 mr-2" /> 
                    <h3 className="text-lg">Departments</h3>
                  </div>
                  <p className="text-3xl font-bold">{deptCount}</p>
                </Card>
                </div>

              </div>

              {/* Graph placeholder */}
              <Card className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} h-96`}>
                <h3 className="text-lg mb-4">Graph Overview</h3>
                <div className="h-full flex items-center justify-center text-gray-500">
                  Graph visualization would go here
                </div>
              </Card>
            </div>
    </div>
  );
};

export default Dashboard;
