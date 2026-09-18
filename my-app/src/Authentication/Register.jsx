import { useState } from "react";
import axios from "axios";
import style from "./Register.module.css";
import { useNavigate } from "react-router-dom";
import { Authcontext } from "../context/Contextprovider";
import { useContext } from "react";

const Register = () => {
  const {setlogin,setrole,setid} = useContext(Authcontext);
  const navigate = useNavigate();
  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: "",
    role: "doctor",
    specialization: "",
  });

  const handlesubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/register", formdata,{
        withCredentials: true
      });


      if (res.data.success) {
        alert(res.data.message);
        setlogin(true);
        setrole(res.data.role);
        setid(res.data.id);

        setformdata({
          name: "",
          email: "",
          password: "",
          role: "doctor",
          specialization: "",
        });
        if(res.data.role === "doctor"){
            navigate("/doctor");
        }
        if(res.data.role === 'patient'){
          navigate("/select-slot")

        }

      
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className={style.parent}>
      <div className={style.loginform}>
        <h1>Registration Form</h1>
        <form onSubmit={handlesubmit}>
          <div className={style.formgrpup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formdata.name}
              onChange={(e) =>
                setformdata({ ...formdata, name: e.target.value })
              }
            />
          </div>

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
              type="text"
              id="password"
              name="password"
              value={formdata.password}
              onChange={(e) =>
                setformdata({ ...formdata, password: e.target.value })
              }
            />
          </div>

          <div className={style.formgrpup}>
            <label htmlFor="role">Role</label>

            <select
              style={{ marginRight: "40px" }}
              name="role"
              id="role"
              value={formdata.role}
              onChange={(e) =>
                setformdata({ ...formdata, role: e.target.value })
              }
            >
              <option value="doctor" selected>
                Doctor
              </option>
              <option value="patient">Patient</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <div className={style.formgrpup}>
            <label htmlFor="specialization">Specialization</label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formdata.specialization}
              onChange={(e) =>
                setformdata({ ...formdata, specialization: e.target.value })
              }
            />
          </div>

          <button type="submit"> Register </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
