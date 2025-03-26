import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Card,
  CardContent,
} from "../../../components/Common/card/Card2";
import { Button } from "../../../components/Common/button/Button2";
import { Calendar, Clock, X, UserRound, CircleCheckBig, ArrowRight, FileText, AlertCircle, MapPin, IndianRupee } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import { format } from "date-fns";

import AlertDialog2 from "../../../components/UserComponents/common/AlertDialogBox2";

import {
  slotBooking,
  getSlotDetails,
  deleteSlot,
  getDoctorData,
} from "../../../api/action/DoctorActionApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AppointmentData {
  date: string;
  day: string;
  timeSlot: string;
  mode: string;
}

const validationSchema = Yup.object({
  date: Yup.string()
    .required("Date is required")
    .test(
      'is-future',
      'Selected date cannot be in the past',
      function(value) {
        return new Date(value) >= new Date(new Date().setHours(0, 0, 0, 0));
      }
    ),
  day: Yup.string().required("Day is required"),
  timeSlot: Yup.string().required("Time slot is required"),
  mode: Yup.string().required("Mode is required"),
});

interface Doctor {
  _id: string;
  name: string;
  consultationType: "Both" | "Online" | "In-Person";
  status: string;
  location: string;
  consultationFee: string;
}

const initialValues: AppointmentData = {
  date: "",
  day: "",
  timeSlot: "",
  mode: "",
};

const SlotBooking = () => {
  const timeSlots = [
    "09:00 - 10:00 am",
    "10:00 - 11:00 am",
    "11:00 - 12:00 pm",
    "01:00 - 02:00 pm",
    "02:00 - 03:00 pm",
    "03:00 - 04:00 pm",
    "04:00 - 05:00 pm",
    "05:00 - 06:00 pm",
    "06:00 - 07:00 pm",
    "07:00 - 08:00 pm",
    "08:00 - 09:00 pm",
  ];

  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0]; 

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [slotsPerPage] = useState(2);

  const totalPages = Math.ceil(slots.length / slotsPerPage);
  const indexOfLastSlot = currentPage * slotsPerPage;
  const indexOfFirstSlot = indexOfLastSlot - slotsPerPage;
  const currentSlots = slots.slice(indexOfFirstSlot, indexOfLastSlot);

  // Check if profile is complete based on consultation type
  const isProfileIncomplete = () => {
    if (!doctor) return true;
    
    if (!doctor.consultationFee) return true;
    
    if (doctor.consultationType === "Online") {
      return false; // Only fee is required for online
    }
    
    // For "Both" or "In-Person", location is also required
    if (!doctor.location) return true;
    
    return false;
  };

  useEffect(() => {
    const fetchSlots = async () => {
      const doctorDataString = localStorage.getItem("doctor");
      if (doctorDataString) {
        const doctorData = JSON.parse(doctorDataString);
        let email = doctorData.email;
        const slot = await getSlotDetails(email);
        setSlots(slot.data);
      }
    };

    fetchSlots();
  }, []);


  console.log(selectedDate);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorDataString = localStorage.getItem("doctor");
        if (doctorDataString) {
          const doctor = JSON.parse(doctorDataString);
          const email = doctor?.email;
          if (email) {
            const data = await getDoctorData(email);
            setDoctor(data);
          }
        }
      } catch (error) {
        console.log("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleDelete = async (slotId: string) => {
    try {
      const response = await deleteSlot(slotId);
      if (response) {
        toast.success("Slot deleted successfully");
        setSlots((prevSlots) =>
          prevSlots.filter((slot) => slot._id !== slotId)
        );
      } else {
        toast.error("Slot not deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete the slot");
    }
  };

  const handleSubmit = async (
    values: AppointmentData,
    { setSubmitting }: any
  ) => {
    try {
      const formData = new FormData();
      const doctorDataString = localStorage.getItem("doctor");

      if (doctorDataString) {
        const doctorData = JSON.parse(doctorDataString);
        formData.append("name", doctorData.name);
        formData.append("email", doctorData.email);
      }

      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await slotBooking(formData);

      if (response.success) {
        toast.success("Slot booked successfully");
        setSlots((prevSlots) => [...prevSlots, response.data]);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8 mt-32">
      <div className="max-w-4xl mx-auto space-y-8">
        {doctor?.status === "approved" ? (
          isProfileIncomplete() ? (
            <div className="mt-40">
              <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">
                        Profile Information Required
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {!doctor?.consultationFee && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <IndianRupee className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-700">
                            Consultation fee is not set. This is required for all consultation types.
                          </p>
                        </div>
                      </div>
                    )}

                    {(doctor?.consultationType === "Both" || doctor?.consultationType === "In-Person") && 
                    !doctor?.location && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <MapPin className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-700">
                            Practice location is required for {doctor?.consultationType === "Both" ? "in-person consultations" : "your consultation type"}.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => navigate("/doctor/profile/edit-profile")}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <span>Update Profile Information</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Card className="bg-white shadow-xl rounded-xl overflow-hidden border-t-4 border-blue-500">
                <CardContent className="p-6">
                  <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-blue-500" />
                    Schedule Your Slots
                  </h1>

                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting, setFieldValue, values }) => (
                      <Form className="space-y-6">
                        {/* Date Selection */}
                        <div className="space-y-2 bg-gradient-to-r from-blue-100 to-indigo-50 p-4 rounded-lg">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            Select Date
                          </label>
                          <Field
                            type="date"
                            name="date"
                            min={today}
                            className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const selectedDate = new Date(e.target.value);
                              const dayName = format(selectedDate, "EEEE");
                              setFieldValue("date", e.target.value);
                              setFieldValue("day", dayName);
                              setSelectedDate(selectedDate);
                            }}
                          />
                          <ErrorMessage
                            name="date"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                          {values.date && (
                            <div className="text-sm text-gray-700 mt-1 bg-white px-3 py-1 rounded-md inline-block">
                              {format(
                                new Date(values.date),
                                "EEEE, MMMM do yyyy"
                              )}
                            </div>
                          )}
                        </div>

                        {/* Time Slot Selection */}
                        <div className="space-y-4 bg-gradient-to-r from-blue-100 to-indigo-50 p-4 rounded-lg">
                          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-purple-500" />
                            Available Time Slots
                          </h2>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {timeSlots.map((slot) => (
                              <Button
                                key={slot}
                                type="button"
                                variant={
                                  values.timeSlot === slot ? "default" : "outline"
                                }
                                className={`
                                  ${
                                    values.timeSlot === slot
                                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white transform scale-105 transition-all duration-200"
                                      : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:scale-105 transition-all duration-200"
                                  } text-xs md:text-sm h-auto py-2 rounded-lg
                                `}
                                onClick={() => setFieldValue("timeSlot", slot)}
                              >
                                {slot}
                              </Button>
                            ))}
                          </div>
                          <ErrorMessage
                            name="timeSlot"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>

                        {/* Mode Selection */}
                        <div className="space-y-2 bg-gradient-to-r from-blue-100 to-indigo-50 p-4 rounded-lg">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <UserRound className="w-5 h-5 text-pink-500" />
                            Consultation Mode
                          </label>
                          {doctor?.consultationType === "Both" && (
                            <div className="grid grid-cols-2 gap-4">
                              {["Online", "Offline"].map((mode) => (
                                <Button
                                  key={mode}
                                  type="button"
                                  variant={
                                    values.mode === mode ? "default" : "outline"
                                  }
                                  className={`
                                    ${
                                      values.mode === mode
                                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white transform scale-105 transition-all duration-200"
                                        : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:scale-105 transition-all duration-200"
                                    } rounded-lg
                                  `}
                                  onClick={() => setFieldValue("mode", mode)}
                                >
                                  {mode}
                                </Button>
                              ))}
                            </div>
                          )}
                          {doctor?.consultationType === "Online" && (
                            <div className="grid grid-cols-2 gap-4">
                              {["Online"].map((mode) => (
                                <Button
                                  key={mode}
                                  type="button"
                                  variant={
                                    values.mode === mode ? "default" : "outline"
                                  }
                                  className={`
                                    ${
                                      values.mode === mode
                                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white transform scale-105 transition-all duration-200"
                                        : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:scale-105 transition-all duration-200"
                                    } rounded-lg
                                  `}
                                  onClick={() => setFieldValue("mode", mode)}
                                >
                                  {mode}
                                </Button>
                              ))}
                            </div>
                          )}
                          {doctor?.consultationType === "In-Person" && (
                            <div className="grid grid-cols-2 gap-4">
                              {["Offline"].map((mode) => (
                                <Button
                                  key={mode}
                                  type="button"
                                  variant={
                                    values.mode === mode ? "default" : "outline"
                                  }
                                  className={`
                                    ${
                                      values.mode === mode
                                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white transform scale-105 transition-all duration-200"
                                        : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:scale-105 transition-all duration-200"
                                    } rounded-lg
                                  `}
                                  onClick={() => setFieldValue("mode", mode)}
                                >
                                  {mode}
                                </Button>
                              ))}
                            </div>
                          )}
                          <ErrorMessage
                            name="mode"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>

                        <div className="mt-6 flex justify-center">
                          <Button
                            type="submit"
                            className={`
                              bg-gradient-to-r from-blue-600 to-purple-600 
                              hover:from-blue-700 hover:to-purple-700 
                              text-white px-8 py-3 rounded-lg
                              transform hover:scale-105 transition-all duration-200
                              ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}
                            `}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Scheduling..." : "Schedule Slot"}
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </CardContent>
              </Card>

              {/* Available Slots */}
              <div className="space-y-4 mt-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800 pl-1">
                    Available Slots
                  </h2>
                  <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                    Showing{" "}
                    {currentPage === 1 ? 1 : (currentPage - 1) * slotsPerPage + 1}{" "}
                    - {Math.min(currentPage * slotsPerPage, slots.length)} of{" "}
                    {slots.length} slots
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {currentSlots.map((slot, index) => (
                    <Card
                      key={slot._id || slot.id}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-md transition-shadow hover:from-blue-100 hover:to-indigo-100"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-sm font-medium text-gray-500">
                            # Slot No:{" "}
                            {(currentPage - 1) * slotsPerPage + index + 1}
                          </span>

                          {!slot.avaliable ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <CircleCheckBig className="w-4 h-4 mr-2" />
                              <p>Slot Booked</p>
                            </Button>
                          ) : (
                            <AlertDialog2
                              title="Confirm Delete"
                              alert="Are you sure you want to delete your slot?"
                              onConfirm={() => handleDelete(slot._id)}
                            >
                              <Button
                                variant="destructive"
                                size="sm"
                                className="bg-red-500 hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </AlertDialog2>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Schedule Date:
                            </span>
                            <span className="text-sm font-medium">
                              {new Date(slot.date).toLocaleDateString("en-GB")}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Schedule Day:
                            </span>
                            <span className="text-sm font-medium">
                              {slot.day}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Slot Timing:
                            </span>
                            <span className="text-sm font-medium">
                              {slot.timeSlot}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Slot mode:
                            </span>
                            <span className="text-sm font-medium">
                              {slot.mode}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination Controls */}
                {slots.length > slotsPerPage && (
                  <div className="flex justify-center mt-6">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        variant="outline"
                        size="sm"
                        className="flex items-center px-3 py-2"
                      >
                        <ChevronLeft className="h-5 w-5" />
                        <span className="ml-1">Previous</span>
                      </Button>

                      <div className="flex space-x-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <Button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                variant={
                                  currentPage === pageNum ? "default" : "outline"
                                }
                                size="sm"
                                className={`w-10 h-10 ${
                                  currentPage === pageNum
                                    ? "bg-blue-500 text-white"
                                    : "hover:bg-blue-50"
                                }`}
                              >
                                {pageNum}
                              </Button>
                            );
                          }
                        )}

                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <>
                            <span className="flex items-center justify-center">
                              ...
                            </span>
                            <Button
                              onClick={() => setCurrentPage(totalPages)}
                              variant="outline"
                              size="sm"
                              className="w-10 h-10 hover:bg-blue-50"
                            >
                              {totalPages}
                            </Button>
                          </>
                        )}
                      </div>

                      <Button
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        variant="outline"
                        size="sm"
                        className="flex items-center px-3 py-2"
                      >
                        <span className="mr-1">Next</span>
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        ) : (
          <div className="mt-40">
            <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">
                      Account Verification Required
                    </h3>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 mt-1">
                    <FileText className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700">
                      Your account is still pending verification. To
                      complete the verification process, please upload your
                      medical certificates.
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => navigate("/doctor/profile/verify-profile")}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <span>Upload Verification Certificates</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotBooking;