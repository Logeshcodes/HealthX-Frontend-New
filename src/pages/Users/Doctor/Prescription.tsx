import { useState, useEffect } from 'react';

import { getDoctorDetailsById, getUserData , getPrescriptionById } from '../../../api/action/UserActionApi';

// For PDF generation
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';


interface UserData {
    username : string;
    email: string;
    mobileNumber: string;
    profilePicture: string;
    isBlocked: string;
    createdAt: string;
    updatedAt: string;
  
    age : string ;
    gender : string ;
    height : string ;
    weight : string ;
    bloodGroup : string ;
  }


  interface Doctor {
    _id: string;
    name: string;
    email: string;
    Mobile: string;
    department: string;
    experience: number;
    role: string;
    education: string;
    description: string;
    consultationType: string;
    profilePicture: string;
    location: string;
  }

  interface Medication {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }

  interface PrescriptionData {
    _id : string;
    doctorId: string;
    patientId: string;
    appointmentId: string;
    prescriptionDate: string;
    medications: Medication[];
    diagnosis: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
  }

const PrescriptionDetails = () => {
    const [prescription, setPrescription] = useState<PrescriptionData>({} as PrescriptionData);
    const [doctor, setDoctor] = useState<Doctor>({} as Doctor);
    const [loading, setLoading] = useState(true);
  
  
     const [user, setUser] = useState<UserData>({
        username: '',
        email: '',
        mobileNumber: '',
        profilePicture : "",
        isBlocked: '',
        createdAt: '',
        updatedAt: '',
        age : '',
        gender : "",
        height : "",
        weight : "",
        bloodGroup : "",
     
      });
  
        useEffect(() => {
          const fetchUsers = async () => {
            try {
              const userDataString = localStorage.getItem('user');
              if (userDataString) {
                const user = JSON.parse(userDataString);
                const email = user?.email;
                console.log('user Email:', email);
      
                if (email) {
                  const response = await getUserData(email);
                  console.log('users list:', response);
                  setUser(response);
                }
              } else {
                console.log('No user data found in localStorage');
              }
            } catch (error) {
              console.log('Error fetching users:', error);
              
            } finally {
              setLoading(false);
            }
          };
      
          fetchUsers();
        }, []);
  
  
      
  
  
        useEffect(() => {
            const appointmentId = decodeURI(location.pathname.split('/').pop() || '');
          
            const fetchAppointments = async () => {
              try {
                setLoading(true);
                const prescriptionRes = await getPrescriptionById(appointmentId);
          
                if (prescriptionRes.success) {
                  console.log("prescriptionRes", prescriptionRes);
                  setPrescription(prescriptionRes.data);
                } else {
                  toast.error(prescriptionRes?.message || 'Appointment Data Not Found');
                }
              } catch (error) {
                toast.error('Error fetching appointment data');
              } finally {
                setLoading(false);
              }
            };
          
            fetchAppointments();
          }, []);
          
      
          useEffect(() => {
            if (!prescription || !prescription.doctorId) return; 
          
            const fetchDoctors = async () => {
              try {
                console.log("Fetching doctor details for ID:", prescription.doctorId);
                const response = await getDoctorDetailsById(prescription.doctorId);
                console.log("Doctor Details:", response);
                setDoctor(response);
              } catch (error) {
                toast.error("Error fetching doctor details");
              }
            };
          
            fetchDoctors();
          }, [prescription]); 
          
  
  const formatDate = (dateString : any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const downloadPDF = () => {
    const prescriptionElement = document.getElementById('prescription-container');
  
    if (!prescriptionElement) {
      console.error("Element with ID 'prescription-container' not found.");
      return;
    }
  
   
    const originalStyles = {
      backgroundColor: prescriptionElement.style.backgroundColor,
      padding: prescriptionElement.style.padding,
      margin: prescriptionElement.style.margin,
      boxShadow: prescriptionElement.style.boxShadow
    };
  
   
    prescriptionElement.style.backgroundColor = "white";
    prescriptionElement.style.padding = "20px";
    prescriptionElement.style.margin = "0";
    prescriptionElement.style.boxShadow = "none";
  
    const options = {
      scale: 2, 
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff" 
    };
  
    html2canvas(prescriptionElement, options).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      const imgWidth = 210; 
      const pageHeight = 297; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
     
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      
      prescriptionElement.style.backgroundColor = originalStyles.backgroundColor;
      prescriptionElement.style.padding = originalStyles.padding;
      prescriptionElement.style.margin = originalStyles.margin;
      prescriptionElement.style.boxShadow = originalStyles.boxShadow;
      
      pdf.save(`Prescription-${prescription._id}.pdf`);
    });
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  

  return (
  <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-6 px-4">
    <div className="container mx-auto py-6 px-4 mt-32">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold mb-2 md:mb-0 text-indigo-800">Prescription Details</h1>
        <div className="flex">
          <button 
            onClick={downloadPDF}
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded-lg mr-2 flex items-center shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download PDF
          </button>
       
        </div>
      </div>

      <div id="prescription-container" className="bg-white rounded-lg shadow-xl p-6 mb-6 border border-indigo-100 ">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between mb-6 ">
          <div>
            <h2 className="text-xl font-bold text-blue-700">Medical Prescription</h2>
            <p className="text-black-500 text-sm">Prescription ID: {prescription._id}</p>
          </div>
          <p className="mt-2 sm:mt-0">
            Date: {prescription ? formatDate(prescription.prescriptionDate) : ''}
          </p>
        </div>

        <hr className="my-6 border-indigo-100" />

        {/* Doctor & Patient Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border border-blue-100 rounded-lg p-4 bg-blue-50 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Doctor Information</h3>
            {doctor && (
              <div>
                <p><span className="font-medium">Name:</span> Dr. {doctor.name}</p>
                <p><span className="font-medium">Department:</span> {doctor.department}</p>
                <p><span className="font-medium">Education:</span> {doctor.education}</p>
                <p><span className="font-medium">Email:</span> {doctor.email}</p>
              </div>
            )}
          </div>
          <div className="border border-blue-100 rounded-lg p-4 bg-blue-50 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Patient Information</h3>
            {user && (
              <div>
                <p><span className="font-medium">Name:</span> {user.username || 'N/A'}</p>
                <p><span className="font-medium">Age:</span> {user.age || 'N/A'}</p>
                <p><span className="font-medium">Gender:</span> {user.gender || 'N/A'}</p>
                <p><span className="font-medium">Blood Group:</span> {user.bloodGroup || 'N/A'}</p>
                <div className="flex gap-4 mt-1">
                  {user.height && (
                    <p><span className="font-medium">Height:</span> {user.height} cm</p>
                  )}
                  {user.weight && (
                    <p><span className="font-medium">Weight:</span> {user.weight} kg</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Diagnosis */}
        {prescription && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Diagnosis</h3>
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 shadow-sm">
              <p>{prescription.diagnosis}</p>
            </div>
          </div>
        )}

        {/* Medications */}
        {prescription && prescription.medications && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Prescribed Medications</h3>
            <div className="overflow-x-auto rounded-lg shadow-sm">
              <table className="min-w-full border-collapse">
                <thead className="bg-indigo-100">
                  <tr>
                    <th className="border border-indigo-200 px-4 py-2 text-left">Medication</th>
                    <th className="border border-indigo-200 px-4 py-2 text-left">Dosage</th>
                    <th className="border border-indigo-200 px-4 py-2 text-left">Frequency</th>
                    <th className="border border-indigo-200 px-4 py-2 text-left">Duration</th>
                    <th className="border border-indigo-200 px-4 py-2 text-left">Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescription.medications.map((med, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                      <td className="border border-indigo-200 px-4 py-2">{med.name}</td>
                      <td className="border border-indigo-200 px-4 py-2">{med.dosage}</td>
                      <td className="border border-indigo-200 px-4 py-2">{med.frequency}</td>
                      <td className="border border-indigo-200 px-4 py-2">{med.duration}</td>
                      <td className="border border-indigo-200 px-4 py-2">{med.instructions || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notes */}
        {prescription && prescription.notes && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Additional Notes</h3>
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 shadow-sm">
              <p>{prescription.notes}</p>
            </div>
          </div>
        )}

        {/* Footer with timestamp */}
        {prescription && (
          <div className="mt-8 pt-4 border-t border-dashed border-indigo-300 text-right">
            <p className="text-black-500 text-sm">
              Prescription created: {new Date(prescription.createdAt).toLocaleString()}
            </p>
            <p className="text-black-500 text-sm">
              Last updated: {new Date(prescription.updatedAt).toLocaleString()}
            </p>
          </div>
        )}

       
      </div>
    </div>
  </div>
);
};

export default PrescriptionDetails;