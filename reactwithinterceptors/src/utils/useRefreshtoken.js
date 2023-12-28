import axios from "axios";
import { React, useState } from "react";
import { useContext } from "react";
import AuthContext from "./provider";
axios.defaults.withCredentials = true;

function useRefreshtoken() {
    const {auth,setAuth}=useContext(AuthContext)
  const newAcessToken = async () => {
    try {
      const res = await axios
        .get("http://localhost:5000/api/auth/refresh-token", {
          withCredentials: true,
        })
     

      const data = await res.data;

      setAuth(data.token)
    localStorage.setItem("auth", data.token)
      console.log(data,">>>>>>>>>>>>new newAcessToken  aa gaya hai aur state me set bhi ho gaya");
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return newAcessToken;
}
export default useRefreshtoken;
