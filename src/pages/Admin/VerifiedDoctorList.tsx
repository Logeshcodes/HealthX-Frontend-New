import React, { useEffect, useState } from 'react';

import DataTable from '../../components/AdminComponents/DataTable';

import { getAllDoctors } from '../../api/action/AdminActionApi';
import LoadingSpinner from '../../components/AdminComponents/LoadingSpinner';

interface UserProps {
  isDarkMode: boolean;
}

const VerifiedDoctorList: React.FC<UserProps> = ({ isDarkMode }) => {

    const [ doctors , setDoctors] = useState([])
    const [ loader , setLoader] = useState(false);
  
    useEffect(()=>{
      try {
        setLoader(true);
        const showDoctors = async() =>{
            const response =  await getAllDoctors();
            const filteredDoctors = response.filter(
              (doctor: any) => doctor.status === 'approved' || doctor.status === 'blocked'
            );
            setDoctors(filteredDoctors);
        }
        showDoctors()
      } catch (error) {
        console.log(error)
      } finally {
        setLoader(false);
      }
    } , []);

  return (

    <>
      {loader ? (
        <LoadingSpinner />
      ) : (
        <DataTable setDoctors={setDoctors} doctors={doctors} isDarkMode={isDarkMode} showActions={false} showVerify={true}  />
      )}
    </>
  )
};

export default VerifiedDoctorList;
