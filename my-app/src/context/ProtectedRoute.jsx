import { useContext } from "react";
import { Authcontext } from "./Contextprovider";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute=()=>{

    const {islogin,isloading} = useContext(Authcontext);
    if(isloading){
        return <h2>Loading....</h2>
    }
    
    if(!islogin){
        console.log("You are not login");
        return <Navigate to="/login" />
    }

    if(islogin){
        return <Outlet/>
    }

    

}


export default ProtectedRoute;