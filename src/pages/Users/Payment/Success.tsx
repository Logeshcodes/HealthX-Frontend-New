import { useEffect, useState } from 'react';
import { Check,BadgeCheck , Calendar, Clock, User, CreditCard ,  Aperture , MapPin ,BadgeAlert } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent} from '../../../components/DoctorComponents/Appointments/card';
import { Button } from '../../../components/DoctorComponents/Appointments/button';

import { getAppointmentDetails } from '../../../api/action/UserActionApi';
import { getSlotDetailsById } from '../../../api/action/UserActionApi';


interface Appointment{
  slotId : string ,
  paymentId : string ,
  doctorId : string ,
  amount : number ,
  paymentStatus : string ,
  location : string ,
  patientId : string ,
}


interface Slot {
    date : string ,
    timeSlot : string ,
    mode : string ,
}

interface Doctor{
    location : string ,
}

const PaymentSuccessPage = () => {
    const txnid = decodeURI(location.pathname.split('/').pop() || '');
    const [appointment, setAppointment] = useState<Appointment>();
    const [slot, setSlot] = useState<Slot>();
    const [doctor, setDoctor] = useState<Doctor>();
    const [showAnimation, setShowAnimation] = useState(false);
    

    useEffect(() => {
        if (txnid) {
            const fetchAppointment = async () => {
                try {
                    const response = await getAppointmentDetails(txnid);
                    setAppointment(response.data);
                    setShowAnimation(true);
                } catch (error) {
                    console.error("Error fetching appointment details:", error);
                }
            };
            fetchAppointment();
        }
    }, [txnid]);


    const slotId = appointment?.slotId ;


    useEffect(() => {
        if (slotId) {
            const fetchSlot = async () => {
                try {
                    const response = await getSlotDetailsById(slotId);
                    setSlot(response.data);
                    setShowAnimation(true);
                } catch (error) {
                    console.error("Error fetching slot details:", error);
                }
            };
            fetchSlot();
        }
    }, [slotId]);




    if (!appointment) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse text-lg">Loading appointment details...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-200 flex items-center justify-center p-4 mt-28">
            <div className="max-w-2xl w-full space-y-8">
                {/* Success Animation */}
                <div className="flex justify-center">
                    <div className={`rounded-full bg-green-100 p-6 ${showAnimation ? 'animate-bounce' : ''}`}>
                        <BadgeCheck className="w-16 h-16 text-green-500" />
                    </div>
                </div>

                {/* Success Message */}
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-bold text-green-600">Payment Successful!</h1>
                    <p className="text-gray-600">Your appointment has been confirmed</p>
                </div>

                {/* Appointment Details Card */}
                <Card className="w-full bg-white shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold">Appointment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Transaction Details */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2 hover:bg-green-50 p-3 rounded-lg transition-colors duration-200">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <CreditCard className="w-5 h-5" />
                                    <span>Transaction ID</span>
                                </div>
                                <p className="font-medium text-lg">{appointment.paymentId}</p>
                            </div>
                            <div className="space-y-2 hover:bg-green-50 p-3 rounded-lg transition-colors duration-200">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <span className="text-lg">₹</span>
                                    <span>Amount Paid</span>
                                </div>
                                <p className="font-medium text-lg">₹{appointment.amount}</p>
                            </div>
                        </div>

                        {/* Date and Time */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2 hover:bg-green-50 p-3 rounded-lg transition-colors duration-200">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <Calendar className="w-5 h-5" />
                                    <span>Appointment Date</span>
                                </div>
                                <p className="font-medium text-lg">
                                {slot?.date
                                    ? new Date(slot.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })
                                    : 'Date not available'}
                                </p>
                            </div>
                            <div className="space-y-2 hover:bg-green-50 p-3 rounded-lg transition-colors duration-200">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <Clock className="w-5 h-5" />
                                    <span>Time Slot</span>
                                </div>
                                <p className="font-medium text-lg">{slot?.timeSlot}</p>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2 hover:bg-green-50 p-3 rounded-lg transition-colors duration-200">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <BadgeAlert className="w-5 h-5" />
                                    <span>Patient Id</span>
                                </div>
                                <p className="font-medium text-lg">{appointment.patientId}</p>
                            </div>
                            <div className="space-y-2 hover:bg-green-50 p-3 rounded-lg transition-colors duration-200">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <User className="w-5 h-5" />
                                    <span>Doctor Id</span>
                                </div>
                                <p className="font-medium text-lg">{appointment.doctorId}</p>
                            </div>
                        </div>

                        {/* Mode and Status */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2 hover:bg-green-50 p-3 rounded-lg transition-colors duration-200">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <Aperture className="w-5 h-5" />
                                    <span>Appointment Mode</span>
                                </div>
                                <p className="font-medium text-lg">{slot?.mode}</p>
                            </div>
                            
                            <div className="space-y-2 hover:bg-green-50 p-3 rounded-lg transition-colors duration-200">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <Check className="w-5 h-5" />
                                    <span>Status</span>
                                </div>
                                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium inline-block">
                                    {appointment.paymentStatus}
                                </span>
                            </div>
                        </div>

                       {
                        ( slot?.mode === 'Offline') &&

                        <div className="space-y-2 hover:bg-green-50 p-3 rounded-lg transition-colors duration-200">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <MapPin className="w-5 h-5" />
                                    <span>Location</span>
                                </div>
                                <p className="font-medium text-lg">{doctor?.location}</p>
                        </div>
                       }

                         {/* Additional Actions */}
                         <div className="flex justify-center pt-6 space-x-4">
                            <Button 
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => window.location.href = '/'}
                            >
                                Go to Home page
                            </Button>
                            <Button 
                                variant="outline"
                                className="border-green-600 text-green-600 hover:bg-green-50"
                                onClick={() => window.location.href = '/user/appointments'}
                            >
                                View All Appointments
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;