const DoctorRoutes={

    // profile
    getDoctorData:"/api/user/doctor/",
    updateProfile:'/api/user/doctor/profile/edit-profile' ,
    updatePassword:'/api/user/doctor/profile/change-password',
    getAllBanner : '/api/user/doctor/banner_list',
    
    //verification
    sendVerification:'/api/verification/doctor/verificationRequest',

    // Booking
    SlotBooking : '/api/booking/doctor/slotBooking' ,
    getDoctorSlotData: '/api/booking/doctor/slotBooking',
    deleteSlot : '/api/booking/doctor/slotBooking', // mark
    getDoctorAppointmentData: '/api/booking/doctor/appointments',   
    getAppointmentById : "/api/booking/doctor/appointmentData",  // mark
    addPrescription:"/api/booking/doctor/addPrescription", // mark
    // Review
    addReview : '/api/user/review/addReview',
    getReview : '/api/user/review/',
    likeReview : '/api/user/review/likeReview', // mark
    addReply : '/api/user/review/addReply', // mark
    likeReply : '/api/user/review/likeReply',    // mark

}
export default DoctorRoutes 