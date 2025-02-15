const DoctorRoutes={

    // profile
    getDoctorData:"/user/doctor/",
    updateProfile:'/user/doctor/profile/edit-profile' ,
    updatePassword:'/user/doctor/profile/change-password',
    

    //verification
    sendVerification:'/verification/doctor/verificationRequest',

    sendReVerifyRequest : '/verification/reVerifyRequest',

    appointmentBooking : '/booking/doctor/slotBooking'
}
export default DoctorRoutes 