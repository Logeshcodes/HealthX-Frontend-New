import React, { useEffect, useState } from 'react';
import DataTable from '../../components/AdminComponents/DataTable';

import { getAllDoctors } from '../../api/action/AdminActionApi';

interface UserProps {
  isDarkMode: boolean;
}

const VerifiedDoctorList: React.FC<UserProps> = ({ isDarkMode }) => {

    const [ doctors , setDoctors] = useState([])

  
    useEffect(()=>{
  
      try {
  
        const showDoctors = async() =>{
            const response =  await getAllDoctors()
            console.log(response , "All Docters")

            const filteredDoctors = response.filter(
              (doctor: any) => doctor.status === 'approved' || doctor.status === 'blocked'
            );
  
            setDoctors(filteredDoctors)
            
        }
        showDoctors()
          
      } catch (error) {
        console.log(error)
      }
  
    } , [])


    

  return <DataTable setDoctors={setDoctors} doctors={doctors} isDarkMode={isDarkMode} showActions={false} showVerify={true}  />;
};

export default VerifiedDoctorList;
