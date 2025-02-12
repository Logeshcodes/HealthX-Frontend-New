const AdminRoutes = {

    // adminGetUsers:'/user/patient/getStudents',
    
    
    
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

    adminGetDoctorByEmail : '/user/admin/getDoctorByEmail'

}

export default AdminRoutes ;