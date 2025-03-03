
const authentictaionRoutes = {

    // Users


   

    signup_user:"/auth/user/signup",
    verifyOtp_user:'/auth/user/verify_otp',
    resendOtp_user:'/auth/user/resendOtp',

    googleLogin_User : '/auth/user/googleLogin',

    login_user:'/auth/user/login',
    verifyEmail_user:'/auth/user/verifyEmail',
    verifyResetOtp_user:'/auth/user/verifyResetOtp',
    forgotResendOtp_user:'/auth/user/forgotResendOtp',
    resetPassword_user:'/auth/user/resetPassword',
    
    logout_user:'/auth/user/logout',
    
    
    
    





    // doctor 

    

    signup_Doctor:"/auth/doctor/register",
    resendOtp_Doctor:'/auth/doctor/resendOtp',
    verifyOtp_Doctor:'/auth/doctor/createUser',

    googleLogin_doctor : "/auth/doctor/googleLogin" ,
    
    login_Doctor:'/auth/doctor/login',
    verifyEmail_doctor:'/auth/doctor/verifyEmail',
    verifyResetOtp_doctor:'/auth/doctor/verifyResetOtp',
    forgotResendOtp_doctor:'/auth/doctor/forgotResendOtp',
    resetPassword_doctor:'/auth/doctor/resetPassword', 
    logout_Doctor:'/auth/doctor/logout',
    Get_All_Department : "/user/patient/department_list",


    //admin
    adminLogin:'/auth/admin/login',
    adminLogout:'/auth/admin/logout',

    
}






export default authentictaionRoutes;



