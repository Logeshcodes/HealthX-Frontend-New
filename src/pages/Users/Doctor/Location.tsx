import { Card , CardContent } from '../../../components/AdminComponents/common/Card';
import { Button } from '../../../components/AdminComponents/common/Button';
import { MapPin , ExternalLink } from 'lucide-react';

 // Extended sample data
 const doctorData = {
    // ... previous data ...
    education: [
      {
        degree: "MBBS",
        institution: "All India Institute of Medical Sciences",
        year: "2015-2020"
      },
      {
        degree: "MD Cardiology",
        institution: "Christian Medical College, Vellore",
        year: "2020-2023"
      }
    ],
    certifications: [
      {
        name: "Advanced Cardiac Life Support",
        issuedBy: "American Heart Association",
        year: "2023"
      },
      {
        name: "Fellowship in Interventional Cardiology",
        issuedBy: "Apollo Hospitals",
        year: "2024"
      }
    ],
    gallery: [
      { id: 1, type: 'clinic', title: 'Modern Consultation Room' },
      { id: 2, type: 'clinic', title: 'Advanced Cardiac Equipment' },
      { id: 3, type: 'certificate', title: 'MBBS Degree' },
      { id: 4, type: 'certificate', title: 'Medical License' }
    ],
    location: {
      address: "123 Anna Nagar, Chennai, Tamil Nadu",
      coordinates: { lat: 13.0827, lng: 80.2707 },
      landmarks: "Near Apollo Hospital"
    },
    social: {
      facebook: "dr.logesh",
      twitter: "dr_logesh",
      linkedin: "dr-logesh-cardio",
      instagram: "dr.logesh.cardio"
    },
    availableTimeSlots: [
      "09:00 AM", "10:00 AM", "11:00 AM",
      "02:00 PM", "03:00 PM", "04:00 PM"
    ]
  };





const Location = () =>{

    return (

        <Card className="mb-6">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Clinic Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" />
              {doctorData.location.address}
            </p>
            <p className="text-gray-600 ml-7 mb-4">
              {doctorData.location.landmarks}
            </p>
            <Button  className="ml-7">
              Get Directions
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-12 h-12 text-gray-400" />
            <span className="text-gray-500 ml-2">Map View</span>
          </div>
        </div>
      </CardContent>
    </Card>
    )


}

export default Location ;