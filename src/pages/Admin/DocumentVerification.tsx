import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './Card';
import { Button } from '../../components/AdminComponents/common/Button';
import { Textarea } from '../../components/AdminComponents/common/Textarea';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from './Alert';
import { getDoctorByEmail , rejectDoctorDocuments , approveDoctorDocuments} from '../../api/action/AdminActionApi';






import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';



interface DoctorData {
  name: string;
  department: string;
  status : string ;
  email: string;
  education: string;
  medicalLicense: string;
  degreeCertificate: string;
}

const DocumentVerification = () => {

  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);
  const [doctor, setDoctor] = useState<DoctorData>({
    name: '',
    department: '',
    status : "",
    email: '',
    education: '',
    medicalLicense: '',
    degreeCertificate: '',
  });

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const email = decodeURI(location.pathname.split('/').pop() || '');
        const response = await getDoctorByEmail(email);
        if (response.data.length > 0) {
          setDoctor(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching doctor details:', error);
      }
    };

    fetchDoctorDetails();
  }, []);

  const openPreview = (imageSrc: string, title: string) => {
    setPreviewImage({ src: imageSrc, title });
  };

  const closePreview = () => {
    setPreviewImage(null);
  };


  const navigate =  useNavigate()


 
  const confirmApproval = 

    async () => {
      try {
        
        const email = decodeURI(location.pathname.split('/').pop() || '');

       console.log(email , 'email')
  
        const response = await approveDoctorDocuments(email);
  
        if (response.success) {
          toast.success(response.message);
          navigate(`/admin/verifiedDoctors`)
        } else {
          toast.error(response.message);
        }
      } catch (error: any) {
        toast.error(error.message || 'Unknown Error Occurred!');
      } finally {
       
      }
    } 
    


  const handleApprove = () => {
    setShowConfirmModal(true);
  };

  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');



  const [showConfirmModal, setShowConfirmModal] = useState(false);
  

  


  const handleReject =
    async () => {
      try {
        
        const email = decodeURI(location.pathname.split('/').pop() || '');

       
  
        const response = await rejectDoctorDocuments(email, rejectReason);
  
        if (response.success) {
          toast.success(response.message);
          navigate(`/admin/requestedDoctors`)
        } else {
          toast.error(response.message);
        }
      } catch (error: any) {
        toast.error(error.message || 'Unknown Error Occurred!');
      } finally {
       
      }
    }

 

 


  return (
    <div className="min-h-screen bg-slate-800 p-6">
      {previewImage && (
        <div className="fixed inset-0 bg-slate-800 z-50 flex flex-col items-center justify-center">
          <div className="absolute top-4 right-4">
            <Button
              className="text-white hover:bg-slate-700 rounded-full p-2"
              onClick={closePreview}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <h2 className="text-white text-xl font-semibold mb-4">{previewImage.title}</h2>
          <div className="max-h-[80vh] max-w-[90vw] relative">
            <img
              src={previewImage.src}
              alt={previewImage.title}
              className="max-h-[80vh] max-w-[90vw] object-contain"
            />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">Doctor Document Verification</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Doctor Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-white">{doctor.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Specialization</p>
                <p className="font-medium text-white">{doctor.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-white">{doctor.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Education</p>
                <p className="font-medium text-white">{doctor.education}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Medical License</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="aspect-[2/2] bg-gray-100 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={() => openPreview(doctor.medicalLicense, 'Medical License')}
              >
                <img
                  src={doctor.medicalLicense}
                  alt="Medical License"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">License Number</p>
                <p className="font-medium text-white">ML-2024-1234</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Degree Certificate</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="aspect-[2/2] bg-gray-100 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={() => openPreview(doctor.degreeCertificate, 'Degree Certificate')}
              >
                <img
                  src={doctor.degreeCertificate}
                  alt="Degree Certificate"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">University</p>
                <p className="font-medium text-white">Medical University of Example</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {status && (
          <Alert className={`mb-6 ${status === 'approved' ? 'bg-green-50' : 'bg-red-50'}`}>
            <AlertDescription className="flex items-center gap-2">
              {status === 'approved' ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Documents have been approved</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-red-600">Documents have been rejected</span>
                </>
              )}
            </AlertDescription>
          </Alert>
        )}

        {showRejectReason && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Rejection Reason</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Please provide a reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[100px] text-black"
              />
            </CardContent>
          </Card>
        )}




         {/* Confirm Approval Modal */}
         {showConfirmModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
              <h2 className="text-lg font-semibold mb-4 text-black">Confirm Approval</h2>
              <p className='text-black'>Are you sure you want to approve these documents?</p>
              <div className="flex justify-end mt-4 gap-2">
                <Button onClick={() => setShowConfirmModal(false)} className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-black rounded-lg
              hover:from-blue-600 hover:to-blue-700 transition-all duration-200 
              shadow-md hover:shadow-lg transform hover:-translate-y-0.5
              flex items-center gap-2 font-medium">
                  Cancel
                </Button>
                <Button onClick={confirmApproval} className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-black rounded-lg
              hover:from-green-600 hover:to-green-700 transition-all duration-200 
              shadow-md hover:shadow-lg transform hover:-translate-y-0.5
              flex items-center gap-2 font-medium">
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}






        {/* Action Buttons */}
        <Card>
          <CardFooter className="flex justify-end gap-4 p-6">
            {doctor.status === 'rejected' ? (
              <p className="text-red-600 font-medium">Already these documents are rejected.</p>
            ) : (
              !showRejectReason ? (
                <>
                  <Button
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-black rounded-lg
                    hover:from-blue-600 hover:to-blue-700 transition-all duration-200 
                    shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                    flex items-center gap-2 font-medium"
                    onClick={() => setShowRejectReason(true)}
                  >
                    Reject
                  </Button>

                  <Button
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-black rounded-lg
                    hover:from-blue-600 hover:to-blue-700 transition-all duration-200 
                    shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                    flex items-center gap-2 font-medium"
                    onClick={handleApprove}
                  >
                    Approve
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className={`px-6 py-2.5 text-black rounded-lg transition-all duration-200 shadow-md
                    transform hover:-translate-y-0.5 flex items-center gap-2 font-medium
                    ${rejectReason.trim() 
                      ? 'bg-gradient-to-r from-red-800 to-red-800 hover:from-red-600 hover:to-red-700' 
                      : 'bg-red-500 cursor-not-allowed'
                    }`}
                    onClick={handleReject}
                    disabled={!rejectReason.trim()}
                  >
                    Confirm Rejection
                  </Button>

                  <Button
                    className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 
                    transition-all duration-200 shadow-md"
                    onClick={() => setShowRejectReason(false)}
                  >
                    Cancel
                  </Button>
                </>
              )
            )}
          </CardFooter>
        </Card>



      </div>
    </div>
  );
};

export default DocumentVerification;
