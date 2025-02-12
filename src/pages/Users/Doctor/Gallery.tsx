
import { Card , CardContent } from '../../../components/AdminComponents/common/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../Navbar/DialogOverlay";
import { Camera } from 'lucide-react';

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

const Gallery = () =>{

        return (
            
    <Card className="mb-6">
    <CardContent className="p-6">
      <h2 className="text-xl font-semibold mb-4">Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {doctorData.gallery.map((item) => (
          <Dialog key={item.id}>
            <DialogTrigger>
              <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <Camera className="w-8 h-8 text-gray-500 mb-2" />
                <p className="text-sm text-gray-600 px-2 text-center">{item.title}</p>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{item.title}</DialogTitle>
              </DialogHeader>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <Camera className="w-16 h-16 text-gray-400" />
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </CardContent>
  </Card>
        )
}


export default Gallery 