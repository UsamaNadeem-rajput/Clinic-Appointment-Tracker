import { useContext, useState } from "react";
import axios from "axios";
import style from "./LoginPage.module.css";
import { Navigate,useNavigate } from "react-router-dom";
import { Authcontext } from "../context/Contextprovider";

const LoginPage = () => {
  const [formdata, setformdata] = useState({
    email: "",
    password: "",
  }); 
  const navigate = useNavigate();
  const {setlogin,setrole,setid} = useContext(Authcontext)

  const handlesubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/login", formdata,{
        withCredentials: true
      });
      if (!res.data.success) {
        return alert(res.data.message);
      }

        alert(res.data.message);
        setformdata({
          email: "",
          password: "",
        });
        setlogin(true);
        setrole(res.data.role);
        setid(res.data.id);
        if(res.data.role === "doctor"){
            navigate("/doctor");
        }
        if(res.data.role === 'patient'){
          navigate("/select-slot")

        }
        
    } catch (err) {
      console.log(err.response.data.message)
      alert( err.response?.data?.message);
    }
  };

  return (
    <div className={style.parent}>
      <div className={style.loginform}>
        <h1>Login Form</h1>
        <form onSubmit={handlesubmit}>
        

          <div className={style.formgrpup}>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formdata.email}
              onChange={(e) =>
                setformdata({ ...formdata, email: e.target.value })
              }
            />
          </div>
          <div className={style.formgrpup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formdata.password}
              onChange={(e) =>
                setformdata({ ...formdata, password: e.target.value })
              }
            />
          </div>


          <button type="submit"> Login </button>
          <button type="button" onClick={()=> navigate("/register")}> Register</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
