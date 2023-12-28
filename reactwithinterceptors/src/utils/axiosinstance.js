import { useContext, useEffect } from "react";
import AuthContext from "./provider";
import axios from "axios";
import useRefereshtoken from "../utils/useRefreshtoken";
import { useNavigate, useLocation } from "react-router-dom";
axios.defaults.withCredentials = true;

export const useAuthPrivate = () => {
    const {auth,setAuth}=useContext(AuthContext)
    const navigate = useNavigate();
    const location = useLocation();
    const refresh = useRefereshtoken()
    let newAuth
    const instance = axios.create({
        baseURL: "http://localhost:5000/api",
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
    });
 
    const requestIntercept = instance.interceptors.request.use(
        (config) => {
            let auth= localStorage.getItem("auth")
            
            if (auth) {
                console.log(auth,"ye interceptor ka auth hai")
                config.headers.Authorization = `Bearer ${auth}`;
            
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    const responseIntercept = instance.interceptors.response.use(
        (response) => response,
        async (error) => {
    
            const originalRequest = error.config;
            if (error.response.status === 403 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const newAccessToken = await refresh(); 
                    return instance(originalRequest);
                } catch (error) {
    
                    console.error('Refresh token error:', error);
                }
            } 
            navigate('/', { state: { from: location }, replace: true });

            return Promise.reject(error);
    })

    return instance 

   
};
