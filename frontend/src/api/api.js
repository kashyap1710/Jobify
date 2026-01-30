import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';       

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const fetchUserByEmail = (email) => {
  return fetch(`${BASE_URL}/user/${email}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const setUserRole = (email, role) => {
  // Logic might need adjustment in backend if needed
  // For now assuming role is set at registration or handled differently
  // Since we skipped specific set-role endpoint in index.js, this might 404.
  // We should rely on register for role.
  console.warn("setUserRole not implemented in Node backend yet");
  return Promise.resolve({ ok: true }); 
};

export const fetchMyApplications = (email) => {
  return fetch(`${BASE_URL}/my-applications/${email}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const fetchJobApplicants = (email) => {
  return fetch(`${BASE_URL}/job-applicants/${email}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const applyToJob = (userId, jobId) => {
  return apiClient.post(`/user/${userId}/apply/${jobId}`);
};

export const fetchAllJobs = () => {
  return fetch(`${BASE_URL}/jobs`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const loginUser = (formData) => {
  return apiClient.post('/login', formData);
};

export const fetchPostedJobs = (userId) => {
  return apiClient.get(`/jobs/posted/${userId}`);
};

export const postNewJob = (jobData) => {
  return fetch(`${BASE_URL}/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jobData),
  });
};

export const registerUser = (formData) => {
  return apiClient.post('/register', formData);
};

export const fetchApplicants = (jobId) => {
  return fetch(`${BASE_URL}/jobs/${jobId}/applicants`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const deleteJob = async (jobId) => {
  return await axios.delete(`/jobs/${jobId}`);
};

export const updateJob = async (jobId, jobData) => {
  return await axios.put(`/jobs/${jobId}`, jobData);
};

export const uploadResume = (userId, file) => {
  const formData = new FormData();
  formData.append('resume', file);
  return apiClient.post(`/upload-resume/${userId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data', 
    },
  });
};

export const updateApplicationStatus = (applicationId, status) => {
  return apiClient.put(`/applications/${applicationId}/status`, { status });
};

export const getJobApplicants = async (jobId) => {
    // This uses the new endpoint (note: variable naming in Profile.jsx might mismatch, check consumption)
    // The Profile.jsx currently calls `fetchApplicants` (lines 83), which does a simple fetch.
    // I am leaving that helper as is, but this one uses axios if we prefer.
    const response = await apiClient.get(`/jobs/${jobId}/applicants`);
    return response.data;
};

export default apiClient;













// import { myAxios } from "../utils/user-service";

// export const loginApi = async(values)=>{
//     try {
//         console.log("loginApi:",values);
//         const res = await myAxios.post('/login',values);
//         const token = res.headers['authorization'];
//         if(res.data.statusCode==200 && token){
//             localStorage.setItem("authToken",token)
//             localStorage.setItem("email",values.email)
//             localStorage.setItem("userRole" , res.data.data.role)
//             console.log(res.data.data.role,"res.role");
            
//             console.log(res.data);
//             console.log(token);
//             myAxios.defaults.headers.common['authorization'] = token;
//         }
//         console.log(res);
//         return res.data;
//     } catch (error) {
//         return error.response.data;
//     }
// }

// export const signUpApi = async(values)=>{
//     try {
        
//         const res = await myAxios.post('/register',values);
//         console.log(res);
//         return res.data;
//     } catch (error) {
//         return error.response.data;
//     }
// }
// export const verifyEmailApi = async(token)=>{
//         try {
//             console.log("in verify email api : ", typeof token);
//             const res = await myAxios.post(`/verify`,{otp:token});
//             if(res.data.statusCode==200 && token){
//                 localStorage.setItem("authToken",token)
//                 myAxios.defaults.headers.common['authorization'] = token;
//             }
//             console.log(res);
//             return res.data;
//         } catch (error) {
//             console.log(error);
//             return error.response.data
//         }
// }

// export const resendEmail = async()=>{
//     try {
//         const res = await myAxios.post('/resend-email',{email:JSON.parse(localStorage.getItem("userEmail"))})
//         return res.data;
//     } catch (error) {
//         return error.response.data;
//     }
// }

