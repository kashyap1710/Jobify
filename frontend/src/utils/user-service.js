import axios from "axios";
import toast from "react-hot-toast";
const BASE_URL = 'http://localhost:8080/api';
export const myAxios = axios.create({
    baseURL : BASE_URL,
    withCredentials: true
})

myAxios.interceptors.response.use(
    (response)=>response,
    (error)=>{
        console.log(error);
        
        const {status = 500, message = "An error occurred"} = error.response?.data || {}                                        
        console.log("Interceptor");
        console.log(status);
        console.log(message);
        
        if (status === 400 && message.trim() === "Your role has been upgraded.Please log in again."){
            toast.error(message)
            console.log(message);
            
            console.log("Inceptor:",message)            
        }
        return Promise.reject(error);
    }
)