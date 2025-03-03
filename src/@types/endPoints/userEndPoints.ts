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

   

    // slots 

    getDoctorSlotData: '/booking/patient/slotBooking',

    // Appointment 

    getUserAppointmentData: '/booking/patient/appointments',
    
    getAppointment : '/booking/patient/appointmentData',




     // For Slot details 

     getSlotDetailsById : '/booking/patient/slotDetails/' ,


    // payment -success

    getAppointmentDetails : '/booking/patient/payment-success/'
   
}

export default UserRouters ;