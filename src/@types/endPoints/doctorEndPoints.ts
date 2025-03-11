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

}
export default DoctorRoutes 