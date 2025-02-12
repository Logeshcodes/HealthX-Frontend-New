import { Card , CardContent } from '../../../components/AdminComponents/common/Card';


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


const Education = () =>{

    return (

        <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Education & Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Education</h3>
              <div className="space-y-4">
                {doctorData.education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-blue-500 pl-4">
                    <h4 className="font-medium">{edu.degree}</h4>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500">{edu.year}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Certifications</h3>
              <div className="space-y-4">
                {doctorData.certifications.map((cert, index) => (
                  <div key={index} className="border-l-2 border-green-500 pl-4">
                    <h4 className="font-medium">{cert.name}</h4>
                    <p className="text-sm text-gray-600">{cert.issuedBy}</p>
                    <p className="text-sm text-gray-500">{cert.year}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )

}

export default Education ;