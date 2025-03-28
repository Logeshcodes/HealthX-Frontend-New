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
      console.error("Error in getAlldoctor API call:", error);
    }
  };
  
  export const getAdminData = async (): Promise<any> => {
    try {
      console.log("response getAdminData")
      const response = await API.get(AdminRoutes.GetAdminData ,{
        withCredentials:true
      });
      console.log("response getAdminData" , response)
      return response?.data;
    } catch (error) {
      console.error("Error in getAdminData API call:", error);
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
      const response = await API.post(`${AdminRoutes.adminApproveDouments}${email}`,{},{withCredentials:true});
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



export const getBannerById = async (bannerId: string): Promise<any> => {
  try {
    console.log("_________", bannerId)
    const response = await API.get(`${AdminRoutes.adminGetBannerById}/${bannerId}`,{
      withCredentials:true
    });
    console.log(".....",response.data)
    return response;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error('bannerId not found');
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

export const updateBanner = async (bannerId: string, bannerData : FormData ): Promise<any> => {
  try {
   
    const response = await API.put( `${AdminRoutes.adminUpdateBanner}/${bannerId}`, bannerData ,{
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials:true
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error('bannerId not found');
    }
    throw error;
  }
};



export const addBanner = async (formData: FormData): Promise<any> => {
  try {
    console.log("Inside addBanner API call       " , formData);

    const response = await API.post(AdminRoutes.addBanner, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    console.log(response.data, "addBanner response");
    return response?.data;
  } catch (error) {
    console.error("Error in addBanner API call:", error);
  }
};


export const getAllBanner = async (): Promise<any> => {
  try {
   

    const response = await API.get(AdminRoutes.getAllBanner, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    console.log(response.data, "getBannerData response");
    return response?.data;
  } catch (error) {
    console.error("Error in getBannerData API call:", error);
  }
};




  
export const toggleBannerStatus = async (id: string | null): Promise<any> => {
  try {
    const response = await API.get(`${AdminRoutes.adminListBanner}/${id}`,{
      headers:{ "Content-Type":"application/json"},
      withCredentials:true
    });
    console.log(`Calling API with URL: ${AdminRoutes.adminListBanner}/${id}`);
    return response?.data;
  } catch (error) {
    console.log('Error list / unlist banner:', error);
    throw error;
  }
};

export const getAllReports = async ( currentPage: number, limit : number , searchTerm: string | null  ): Promise<any> => {
  try {
    console.log("Fetchin Reports details with pagination....." , searchTerm , currentPage);

    const response = await API.get(`${AdminRoutes.getAllReports}?page=${currentPage}&limit=${limit}&search=${searchTerm}`, { withCredentials: true });

    return response?.data;

  } catch (error) {
    console.error("Error in Reports API call:", error);
    throw error ;
  }
};




export const getTotalAppointmentDetails = async (   ): Promise<any> => {
  try {


    const response = await API.get(`${AdminRoutes.getTotalAppointmentDetails}`, { withCredentials: true });

    console.log("Fetching Appointment details with pagination " , response);
    return response?.data;

  } catch (error) {
    console.error("Error in Appointment API call:", error);
  }
};



export const generateRevenueDataFilter = async (timeFilter: 'day' | 'month' | 'year'): Promise<any> => {
  try {
    const response = await API.get(`${AdminRoutes.generateRevenueData}?timeFilter=${timeFilter}`, { withCredentials: true });
    console.log("Fetching generateRevenueData:", response);
    return response?.data;
  } catch (error) {
    console.error("Error in generateRevenueData API call:", error);
  }
};


