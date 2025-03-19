const AdminRoutes = {

    
    GetAdminData:'/user/admin/getAdminData',
    adminGetDoctors:'/user/admin/getDoctors',
    adminBlockDoctor:'/user/admin/blockDoctor/', 

    adminRejectDouments : '/user/admin/rejectDocuments/',
    adminApproveDouments : '/user/admin/approveDocuments/',


    adminAddDepartment:'/user/admin/addDepartment',
    adminGetAllDepartment : '/user/admin/department',
    adminGetAllusers : '/user/admin/users',
    adminBlockUser: '/user/admin/blockUser/',


    adminGetDepartmentByName: '/user/admin/editDepartment',
    adminUpdateDepartment: '/user/admin/editDepartment',

    adminGetDoctorByEmail : '/user/admin/getDoctorByEmail',

    addBanner : '/user/admin/banner',
    getAllBanner : '/user/admin/banner',
    adminGetBannerById : '/user/admin/editBanner',
    adminUpdateBanner : '/user/admin/editBanner',
    adminListBanner : '/user/admin/listBanner',

    getAllReports :'/user/admin/getAllReports',
    getTotalAppointmentDetails :"booking/admin/totalappointments",
    generateRevenueData : 'booking/admin/generateRevenueData'

}

export default AdminRoutes ;