import { useState } from 'react';
import { CardContent , Card } from '../../../components/DoctorComponents/Appointments/card';
import { Button } from '../../../components/DoctorComponents/Appointments/button';
import { Calendar, Clock, X } from 'lucide-react';

const SlotBooking = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDay, setSelectedDay] = useState('Wednesday');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('04:00 - 05:00 pm');
  
  const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'
  ];
  
  const timeSlots = [
    '09:00 - 10:00 am', '10:00 - 11:00 am', '11:00 - 12:00 pm',
    '01:00 - 02:00 pm', '02:00 - 03:00 pm', '03:00 - 04:00 pm',
    '04:00 - 05:00 pm', '05:00 - 06:00 pm', '06:00 - 07:00 pm',
    '07:00 - 08:00 pm', '08:00 - 09:00 pm'
  ];

  const availableSlots = [
    {
      id: '01',
      scheduleDate: '30-12-2024',
      scheduleDay: 'Monday',
      slotTiming: '04:00 - 05:00 pm'
    },
    {
      id: '02',
      scheduleDate: '01-01-2025',
      scheduleDay: 'Wednesday',
      slotTiming: '04:00 - 05:00 pm'
    }
  ];

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8 mt-40">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Slot Booking Page
            </h1>

            {/* Date and Day Selection */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  Slot Schedule Date:
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Slot Schedule Day:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {days.map((day) => (
                    <Button
                      key={day}
                      variant={selectedDay === day ? "default" : "outline"}
                      className={`${
                        selectedDay === day 
                          ? "bg-blue-500 text-white" 
                          : "border-gray-200 text-gray-700 hover:bg-blue-50"
                      } text-xs md:text-sm`}
                      onClick={() => setSelectedDay(day)}
                    >
                      {day.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Slot Selection */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Select Time Slot:
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedTimeSlot === slot ? "default" : "outline"}
                    className={`${
                      selectedTimeSlot === slot
                        ? "bg-blue-500 text-white"
                        : "border-gray-200 text-gray-700 hover:bg-blue-50"
                    } text-xs md:text-sm h-auto py-2`}
                    onClick={() => setSelectedTimeSlot(slot)}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                Save Slots
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Available Slots */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 pl-1">
            Available Slots
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {availableSlots.map((slot) => (
              <Card 
                key={slot.id}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-medium text-gray-500">
                      # Slot No: {slot.id}
                    </span>
                    <Button 
                      variant="destructive"
                      size="sm"
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Schedule Date:</span>
                      <span className="text-sm font-medium">{slot.scheduleDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Schedule Day:</span>
                      <span className="text-sm font-medium">{slot.scheduleDay}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Slot Timing:</span>
                      <span className="text-sm font-medium">{slot.slotTiming}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotBooking;