
const authentictaionRoutes = {

    // Users

    signup_user:"/api/auth/user/signup",
    verifyOtp_user:'/api/auth/user/verify_otp',
    resendOtp_user:'/api/auth/user/resendOtp',

    googleLogin_User : '/api/auth/user/googleLogin',

    login_user:'/api/auth/user/login',
    verifyEmail_user:'/api/auth/user/verifyEmail',
    verifyResetOtp_user:'/api/auth/user/verifyResetOtp',
    forgotResendOtp_user:'/api/auth/user/forgotResendOtp',
    resetPassword_user:'/api/auth/user/resetPassword',
    
    logout_user:'/api/auth/user/logout',
    
    
    
    





    // doctor 

    

    signup_Doctor:"/api/auth/doctor/register",
    resendOtp_Doctor:'/api/auth/doctor/resendOtp',
    verifyOtp_Doctor:'/api/auth/doctor/createUser',

    googleLogin_doctor : "/api/auth/doctor/googleLogin" ,
    
    login_Doctor:'/api/auth/doctor/login',
    verifyEmail_doctor:'/api/auth/doctor/verifyEmail',
    verifyResetOtp_doctor:'/api/auth/doctor/verifyResetOtp',
    forgotResendOtp_doctor:'/api/auth/doctor/forgotResendOtp',
    resetPassword_doctor:'/api/auth/doctor/resetPassword', 
    logout_Doctor:'/api/auth/doctor/logout',
    Get_All_Department : "/api/user/patient/department_list",


    //admin
    adminLogin:'/api/auth/admin/login',
    adminLogout:'/api/auth/admin/logout',

    
}






export default authentictaionRoutes;



