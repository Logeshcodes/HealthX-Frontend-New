const DoctorRoutes={

    // profile
    getDoctorData:"/user/doctor/",
    updateProfile:'/user/doctor/profile/edit-profile' ,
    updatePassword:'/user/doctor/profile/change-password',
    getAllBanner : '/user/doctor/banner_list',
    
    //verification
    sendVerification:'/verification/doctor/verificationRequest',

    // Booking
    SlotBooking : '/booking/doctor/slotBooking' ,
    getDoctorSlotData: '/booking/doctor/slotBooking',
    deleteSlot : 'booking/doctor/slotBooking',
    getDoctorAppointmentData: '/booking/doctor/appointments',
    getAppointmentById : "booking/doctor/appointmentData",
    addPrescription:"booking/doctor/addPrescription",
    // Review
    addReview : '/user/review/addReview',
    getReview : '/user/review/',
    likeReview : 'user/review/likeReview',
    addReply : 'user/review/addReply',
    likeReply : 'user/review/likeReply',

}
export default DoctorRoutes 