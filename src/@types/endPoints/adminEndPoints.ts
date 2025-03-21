const AdminRoutes = {

    
    GetAdminData:'/api/user/admin/getAdminData',
    adminGetDoctors:'/api/user/admin/getDoctors',
    adminBlockDoctor:'/api/user/admin/blockDoctor/', 

    adminRejectDouments : '/api/user/admin/rejectDocuments/',
    adminApproveDouments : '/api/user/admin/approveDocuments/',


    adminAddDepartment:'/api/user/admin/addDepartment',
    adminGetAllDepartment : '/api/user/admin/department',
    adminGetAllusers : '/api/user/admin/users',
    adminBlockUser: '/api/user/admin/blockUser/',


    adminGetDepartmentByName: '/api/user/admin/editDepartment',
    adminUpdateDepartment: '/api/user/admin/editDepartment',

    adminGetDoctorByEmail : '/api/user/admin/getDoctorByEmail',

    addBanner : '/api/user/admin/banner',
    getAllBanner : '/api/user/admin/banner',
    adminGetBannerById : '/api/user/admin/editBanner',
    adminUpdateBanner : '/api/user/admin/editBanner',
    adminListBanner : '/api/user/admin/listBanner',

    getAllReports :'/api/user/admin/getAllReports',
    getTotalAppointmentDetails :"/api/booking/admin/totalappointments",  // mark
    generateRevenueData : '/api/booking/admin/generateRevenueData' , // mark

}

export default AdminRoutes ;