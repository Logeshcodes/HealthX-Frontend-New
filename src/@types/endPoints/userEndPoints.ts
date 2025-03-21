const UserRouters = {

    GetDoctorsList :'/api/user/patient/getDoctors',

    


    // profile

    getUserData:"/api/user/patient/",
    updateProfile:'/api/user/patient/profile/updateProfile',
    
    updatePassword:'/api/user/patient/profile/change-password',

    // doctor filter - user side 

    Get_All_Department : '/api/user/patient/department_list',

    getAllDoctors : '/api/user/patient/doctor_list',

    getAllBanner : '/api/user/patient/banner_list',

   

     // For Doctor Details Page

    getDoctorDetails:"/api/user/patient/doctor_details/",
    getDoctorDetailsById:"/api/booking/patient/doctor/",

   

    // slots 

    getDoctorSlotData: '/api/booking/patient/slotBooking',

    // Appointment 

    getUserAppointmentData: '/api/booking/patient/appointments',
    

    walletPayment : '/api/booking/patient/walletPayment',

    appointmentCancel : '/api/booking/patient/cancelAppointment',


     // For Slot details 

     getSlotDetailsById : '/api/booking/patient/slotDetails/' ,


    // payment -success

    getAppointmentDetails : '/api/booking/patient/payment-success/',
    getPrescriptionById : '/api/booking/patient/prescription/',
    addReport : '/api/user/patient/addReport', // mark
   
}

export default UserRouters ;