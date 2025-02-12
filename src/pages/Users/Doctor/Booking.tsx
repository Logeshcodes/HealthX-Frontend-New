
import { Card , CardContent } from '../../../components/AdminComponents/common/Card';
import { Calendar } from 'lucide-react';
import { Button } from '../../../components/AdminComponents/common/Button';
import { useState } from 'react';

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

  // const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState('');
  console.log(timeSlot)


   const renderTimeSlots = () => (
      <div className="grid grid-cols-3 gap-2 mt-4">
        {doctorData.availableTimeSlots.map((slot) => (
          <Button
            key={slot}
            
            onClick={() => setTimeSlot(slot)}
            className="text-sm"
          >
            {slot}
          </Button>
        ))}
      </div>
    );




 const Booking = () =>{

   

    return (
        <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Book Appointment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Select Date</h3>
              <Calendar
                mode="single"
               
               
                className="rounded-md border"
                
              />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Available Time Slots</h3>
              {renderTimeSlots()}
              <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                Confirm Booking
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
}


export default Booking ;