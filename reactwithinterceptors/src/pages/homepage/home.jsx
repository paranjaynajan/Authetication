import React,{useContext, useEffect} from "react";
import { useAuthPrivate } from "../../utils/axiosinstance";
import useRefereshtoken from "../../utils/useRefreshtoken";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../../utils/provider";


function Home() {
  const {auth,setAuth}=useContext(AuthContext)
  const privateInstance = useAuthPrivate();
  const newAcessToken = useRefereshtoken();
  const navigate = useNavigate();
  const location = useLocation();
  const logoutFunction = async () => {

    const res = await privateInstance.get("/user/signout");
    console.log(res);
  
      localStorage.clear()
      setAuth("")
      navigate("/", { state: { from: location }, replace: true });
  
  };
useEffect(()=>{
  console.log(auth,">>>>>>")
},[auth])
  return (
    <>
      {/* <button onClick={async () => {
      const res = await newAcessToken()
    }}>
      click
    </button> */}
      <button onClick={() => logoutFunction()}>Logout</button>
    </>
  );
}

export default Home;
