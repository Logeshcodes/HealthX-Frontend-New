import { CardContent, Card } from '../../../components/DoctorComponents/Appointments/card';
import { Button } from '../../../components/DoctorComponents/Appointments/button';
import { getSlotDetails } from '../../../api/action/UserActionApi';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SlotBooking = () => {
  const [slots, setSlots] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSlots, setTotalSlots] = useState(0);
  const slotsPerPage = 4;

  const location = useLocation();

 
  useEffect(() => {
    const fetchSlots = async () => {
      const email = decodeURI(location.pathname.split('/').pop() || '');
      const response = await getSlotDetails(email, currentPage, slotsPerPage);
    
      if (response) {
        setSlots(response.data); 
        setTotalSlots(response.total);  
      }
    };
    
    fetchSlots();
  }, [currentPage, location.pathname]); 
  

  // Handle previous page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle next page
  const handleNextPage = () => {
    const totalPages = Math.ceil(totalSlots / slotsPerPage);

    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const navigate = useNavigate()

  const handleSubmit = (id:string)=>{
      navigate(`/user/slotDetails/${id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8 mt-40">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Available Slots */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 pl-1 mb-6">
            Available Slots
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {slots.map((slot, index) => (
              <Card
                key={slot._id || index}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-lg transition-shadow p-4 rounded-lg shadow-md"
              >
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">
                      # Slot No: {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-500">{slot.timeSlot}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Schedule Date:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {new Date(slot.date).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Schedule Day:</span>
                      <span className="text-sm font-medium text-gray-800">{slot.day}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Slot Timing:</span>
                      <span className="text-sm font-medium text-gray-800">{slot.timeSlot}</span>
                    </div>
                  </div>

                  {!slot.avaliable ? (
                     <>
                     <Button className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors w-full" disabled>
                       Already Booked
                     </Button>
                     <span className="text-red-500 flex items-center gap-1 text-sm">
                       <span className="w-2 h-2 rounded-full bg-red-500"></span> Not Available
                     </span>
                   </>
                  ) : (
                    <>
                    
                    <Button onClick={()=>handleSubmit(slot._id)} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full">
                      Book Slot
                    </Button>
                   
                    <span className="text-green-500 flex items-center gap-1 text-sm">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span> Slot Available
                    </span>
                  </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6">
        <Button
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
            className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Previous
          </Button>

          
          <span className="text-lg font-medium text-gray-700">
            Page {currentPage} of {Math.ceil(totalSlots / slotsPerPage)}
          </span>
          <Button
            onClick={handleNextPage}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            disabled={currentPage === Math.ceil(totalSlots / slotsPerPage)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SlotBooking;
