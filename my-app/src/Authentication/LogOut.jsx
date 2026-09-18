import axios from "axios"
import { useContext } from "react";
import { Authcontext } from "../context/Contextprovider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogOut() {
    const {setlogin} = useContext(Authcontext);
    const navigate = useNavigate();
  useEffect(() => {

    async function logout() {
      try {
        const res = axios.get('http://localhost:3000/logout',{
            withCredentials:true
        })
        setlogin(false);
        return navigate("/login");


      } catch (error) {
        console.log(error)
      }
    }

    logout();
  }, []);
}
