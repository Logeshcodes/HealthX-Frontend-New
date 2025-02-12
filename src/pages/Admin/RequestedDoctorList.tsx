import React, { useEffect, useState } from 'react';
import DataTable from '../../components/AdminComponents/DataTable';
import { getAllDoctors } from '../../api/action/AdminActionApi';

interface UserProps {
  isDarkMode: boolean;
}

const RequestedDoctorList: React.FC<UserProps> = ({ isDarkMode }) => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getAllDoctors();


        const filteredDoctors = response.filter(
          (doctor: any) => doctor.status === 'pending' || doctor.status === 'rejected' || doctor.status === 'registered'
        );

        setDoctors(filteredDoctors)


      } catch (error) {
        console.error("Error fetching doctors", error);
      }
    };
    fetchDoctors();
  }, []);

  return <DataTable setDoctors={setDoctors} doctors={doctors} isDarkMode={isDarkMode} showActions={true} showVerify={false} />;
};

export default RequestedDoctorList;
