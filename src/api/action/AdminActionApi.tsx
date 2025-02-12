import { API } from "../../service/axios";

import AdminRoutes from "../../@types/endPoints/adminEndPoints";

import { deptData } from "../../@types/DeptDataType";



  // Admin Side - UserList

  export const getAllUser = async (): Promise<any> => {
    try {
      console.log("response getAllUser")
      const response = await API.get(AdminRoutes.adminGetAllusers,{
        headers:{ "Content-Type":"application/json"},
        withCredentials:true
      });
      console.log(response.data.users,"response getAllUser")
      return response?.data?.users;
    } catch (error) {
      console.error("Error in updateProfile API call:", error);
    }
  };
  

  // Admin - Block User
  
  export const blockUser = async (email: string | null): Promise<any> => {
    try {
      const response = await API.get(`${AdminRoutes.adminBlockUser}/${email}`,{
        headers:{ "Content-Type":"application/json"},
        withCredentials:true
      });
      console.log(`Calling API with URL: ${AdminRoutes.adminBlockUser}/${email}`);
      return response?.data;
    } catch (error) {
      console.log('Error blocking/unblocking user:', error);
      throw error;
    }
  };


  export const getAllDoctors = async (): Promise<any> => {
    try {
      console.log("response getAllDoctors")
      const response = await API.get(AdminRoutes.adminGetDoctors ,{
        withCredentials:true
      });
      console.log(response?.data?.doctors,"response getAllDoctors")
      return response?.data?.doctors;
    } catch (error) {
      console.error("Error in updateProfile API call:", error);
    }
  };
  
  
  

  export const blockDoctor = async (email: string | null): Promise<any> => {
    try {
      const response = await API.get(`${AdminRoutes.adminBlockDoctor}${email}`,{
        headers:{ "Content-Type":"application/json"},
        withCredentials:true
      });
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };


  // reject documents 

  export const rejectDoctorDocuments = async (email: string  , rejectReason : string ): Promise<any> => {
    try {
      const response = await API.post(`${AdminRoutes.adminRejectDouments}${email}`, {rejectReason},{
        headers:{ "Content-Type":"application/json"},
        withCredentials:true
      });
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };

  // reject documents 

  export const approveDoctorDocuments = async (email: string  ): Promise<any> => {
    try {
      const response = await API.post(`${AdminRoutes.adminApproveDouments}${email}`,{
        headers:{ "Content-Type":"application/json"},
        withCredentials:true
      });
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };




  // Admin Side - Dept List


  export const getAllDepartment = async (): Promise<any> => {
    try {
      console.log("response getAlldept")
      const response = await API.get(AdminRoutes.adminGetAllDepartment,{
        headers:{
          "Content-Type":"application/json"
        },
        withCredentials:true
      });
      console.log(response,"response getAlldept")
      return response;
    } catch (error) {
      console.error("Error in updateProfile API call:", error);
    }
  };



  // Add new Department

export const addDepartment = async (deptData: deptData): Promise<any> => {
  try {
    console.log("users data..", deptData)

    const response = await API.post(
      AdminRoutes.adminAddDepartment,
      deptData,{
        withCredentials:true
      }
    );
    console.log(response.data, "response");
    return response.data;
  } catch (error: any) {
    if (error.response.status === 404) {
      throw error;
    }
    console.log(error.message);
  }
};


// Fetch department details by name - Admin

export const getDepartmentByName = async (departmentName: string): Promise<any> => {
  try {
    console.log("_________", departmentName)
    const response = await API.get(`${AdminRoutes.adminGetDepartmentByName}/${departmentName}`,{
      withCredentials:true
    });
    console.log(".....",response)
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error('Department not found');
    }
    throw error;
  }
};

export const getDoctorByEmail = async (email: string): Promise<any> => {
  try {
    console.log("_________", email)
    const response = await API.get(`${AdminRoutes.adminGetDoctorByEmail}/${email}`,{
      withCredentials:true
    });
    console.log(".....",response)
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error('Department not found');
    }
    throw error;
  }
};

// Update department by name - Admin 

export const updateDepartment = async (departmentName: string, deptData: { departmentName: string }): Promise<any> => {
  try {
    const response = await API.put( `${AdminRoutes.adminUpdateDepartment}/${departmentName}`, {deptData },{
      withCredentials:true
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error('Department not found');
    }
    throw error;
  }
};




