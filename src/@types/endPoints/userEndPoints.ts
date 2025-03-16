const UserRouters = {

    GetDoctorsList :'/user/patient/getDoctors',

    


    // profile

    getUserData:"/user/patient/",
    updateProfile:'/user/patient/profile/updateProfile',
    
    updatePassword:'/user/patient/profile/change-password',

    // doctor filter - user side 

    Get_All_Department : '/user/patient/department_list',

    getAllDoctors : '/user/patient/doctor_list',

    getAllBanner : '/user/patient/banner_list',

   

     // For Doctor Details Page

    getDoctorDetails:"/user/patient/doctor_details/",
    getDoctorDetailsById:"/booking/patient/doctor/",

   

    // slots 

    getDoctorSlotData: '/booking/patient/slotBooking',

    // Appointment 

    getUserAppointmentData: '/booking/patient/appointments',
    

    walletPayment : '/booking/patient/walletPayment',

    appointmentCancel : '/booking/patient/cancelAppointment',


     // For Slot details 

     getSlotDetailsById : '/booking/patient/slotDetails/' ,


    // payment -success

    getAppointmentDetails : '/booking/patient/payment-success/',
    getPrescriptionById : '/booking/patient/prescription/',
    addReport : 'user/patient/addReport',
   
}

export default UserRouters ;