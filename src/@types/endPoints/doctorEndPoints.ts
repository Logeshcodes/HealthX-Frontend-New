const DoctorRoutes={

    // profile
    getDoctorData:"/user/doctor/",
    updateProfile:'/user/doctor/profile/edit-profile' ,
    updatePassword:'/user/doctor/profile/change-password',
    

    //verification
    sendVerification:'/verification/doctor/verificationRequest',
    sendReVerifyRequest : '/verification/reVerifyRequest',

    // Booking

    SlotBooking : '/booking/doctor/slotBooking' ,
    getDoctorSlotData: '/booking/doctor/slotBooking',
    deleteSlot : 'booking/doctor/slotBooking'
}
export default DoctorRoutes 