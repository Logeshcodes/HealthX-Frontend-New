const UserRouters = {

    GetDoctorsList :'/user/patient/getDoctors',


    // profile

    getUserData:"/user/patient/",
    updateProfile:'/user/patient/profile/updateProfile',
    
    updatePassword:'/user/patient/profile/change-password',

    // doctor filter - user side 

    Get_All_Department : '/user/patient/department_list',

    getAllDoctors : '/user/patient/doctor_list',

   

     // For Doctor Details Page

    getDoctorDetails:"/user/patient/doctor_details/",


   
}

export default UserRouters ;