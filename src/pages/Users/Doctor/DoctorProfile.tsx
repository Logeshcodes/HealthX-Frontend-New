
import { Card , CardContent } from "../../../components/AdminComponents/common/Card";

import { CheckCircle } from 'lucide-react';
import { Button } from "../../../components/AdminComponents/common/Button";

import { 
  User, Mail, Phone, Award, BookOpen, Clock, FileText, 
  Check,Building,
  Stethoscope, GraduationCap, Globe  , 
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { getDoctorDetails } from "../../../api/action/UserActionApi";


interface Doctor{

  name : string ;
  email : string ;
  Mobile : string ;
  department : string ;
  experience : number;
  role : string ;
  education : string ;
  description : string ;
  consultationType : string ;
  profilePicture : string ;

}


const DoctorProfile = () => {


  const [doctor, setDoctor] = useState<Doctor>({} as Doctor);

  




  useEffect(()=>{

    const fetchDoctors = async () =>{

      const email = decodeURI(location.pathname.split('/').pop() || '');
      const response = await getDoctorDetails(email) ;
      setDoctor(response || []);

      console.log(response)

    }

    fetchDoctors()

  }, [])

  const navigate = useNavigate()

  const bookSlot = ()=>{
      navigate(`/user/slot`)
  }




  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 mt-40">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
       

        <div className="grid md:grid-cols-12 gap-6">
          {/* Left Profile Section */}
          <div className="md:col-span-4">
            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-6 group">
                    <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center overflow-hidden transform transition-transform group-hover:scale-105">
                    <img
                        src={doctor?.profilePicture || "/default-avatar.png"}
                        alt="Profile"
                        className="max-w-36  h-36 rounded-full object-cover"
                        onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                      />
                    </div>

                    <div className="absolute -bottom-0 right-7 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white border-2 border-white">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-2 text-center">{doctor.name}</h1>
                  <p className="text-blue-100 mb-4 text-center flex items-center gap-2">
                    <Stethoscope className="w-5 h-5" />
                    {doctor?.department} Specialist
                  </p>
                  
                  {/* <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-xl font-bold">{doctor.rating}</span>
                    <span className="text-blue-100">({doctor.reviewCount} reviews)</span>
                  </div> */}

                 

                  <div className="w-full space-y-4 text-blue-50">
                   
                    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                      <Mail className="w-5 h-5" />
                      <span>{doctor.email}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                      <Phone className="w-5 h-5" />
                      <span>+91 {doctor.Mobile}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                      <Building className="w-5 h-5" />
                      <span>{doctor.department}</span>
                    </div>
                  </div>

                </div>

                <div className="grid grid-cols-2 gap-3 w-full mt-4">
                  <div className="flex items-center gap-3 p-3 bg-white/10 text-white rounded-lg backdrop-blur-sm">
                  <GraduationCap className="w-4 h-4 mr-2" />
                      <span>{doctor.education}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/10 text-white rounded-lg backdrop-blur-sm">
                    <Globe className="w-4 h-4 mr-2" />
                      <span>{doctor.consultationType}</span>
                    </div>
                  </div>
                
              </CardContent>
              
            </Card>

            {/* Languages Card */}
            {/* <Card className="mt-6 bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.languages.map((lang) => (
                    <Badge key={lang}  className="px-3 py-1">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Right Details Section */}
          <div className="md:col-span-8 space-y-6">
            <Card className="bg-white">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center gap-2">
                  <Award className="w-6 h-6" />
                  Professional Information
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium">Experience</h3>
                    </div>
                    <p className="text-gray-600">{doctor.experience} Years</p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium">Role</h3>
                    </div>
                    <p className="text-gray-600">{doctor.role}</p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium">Description</h3>
                    </div>
                    <p className="text-gray-600">{doctor.description}</p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium">Consultation</h3>
                    </div>
                    <p className="text-gray-600">{doctor.consultationType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          

            {/* Verification Status */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-blue-600 mb-4">Language Known</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Check className="w-6 h-6 text-green-500" />
                      <span className="font-medium">Tamil</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                    <Check className="w-6 h-6 text-green-500" />
                      <span className="font-medium">English</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                    <Check className="w-6 h-6 text-green-500" />
                      <span className="font-medium">Malayalam</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            


                
              <Button onClick={bookSlot} className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-black rounded-lg
              hover:from-green-600 hover:to-green-700 transition-all duration-200 
              shadow-md hover:shadow-lg transform hover:-translate-y-0.5
              flex items-center gap-2 font-medium">
                  Book Appointment
              </Button>
             

          
          </div>
        </div>



      </div>
    </div>

    
  );
};

export default DoctorProfile;