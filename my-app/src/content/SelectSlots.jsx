import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Navbar/NavBar";



export default function SelectSlots() {
  const [doctors, setdoctors] = useState();
  const [slots, setslots] = useState();
  const [selecteddoctor, setselecteddoctor] = useState();
  const navigate = useNavigate();


  const handlesubmit = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/show/doctors", {
        withCredentials: true,
      });
      if (res.data.success) {
        alert("Fetched data");
        setdoctors(res.data.info);
      }
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const slotcalculation = async (slot) => {
    const payload={
      schedualeId:selecteddoctor.id,
      slot:slot,
      doctorId:selecteddoctor.doctor_id
      
    }
    try {

      const res = await axios.post('http://localhost:3000/api/patient/addappointment',payload,{
        withCredentials:true
      })
      if (res.data.success) {
        alert(res.data.message);
        navigate('/patient')
      }

      
    } catch (err) {
      alert(err.response?.data?.message);
      
    }
  };

  const oppointment = async (value) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/patient/appointment/${value.doctor_id}`,
        {
          params: {
            date: value.schedule_date,
            SchedualeId: value.id,
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        alert(res.data.message);
        setselecteddoctor(value);
        setslots(res.data.slots);
        return;
      }
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };
  return (
    <div>
      <NavBar/>
      <h1>Dashboard</h1>
      <button onClick={handlesubmit}>Show all doctor's</button>

      <div style={{ display: "flex" }}>
        {doctors
          ? doctors.map((value, index) => (
              <div style={{ border: "2px black" }}>
                <ul key={index}>
                  <li>Doctor Name: {value.name}</li>
                  <li>Specialization: {value.specialization}</li>
                  <li>Scheduale Date: {value.schedule_date}</li>
                  <div>
                    <li>Start Time: {value.start_time}</li>
                    <li>End Time: {value.end_time}</li>
                  </div>
                  <button onClick={() => oppointment(value)}>
                    Check Slots
                  </button>
                </ul>
              </div>
            ))
          : " "}
      </div>

      {selecteddoctor && (
        <div>
          <h3>
            Available Slots for {selecteddoctor.name}:
            <span>
              From {selecteddoctor.start_time} To {selecteddoctor.end_time}
            </span>
          </h3>
          {slots
            ?<div style={{ display: "flex", marginRight:"10px" }}>
              {
             slots.map((value, key)=> (
                
                  <div style={{ marginRight:"10px"}}>
                    <button onClick={()=>slotcalculation(value)}>{value}</button>
                  </div>
                
              ))
            }
            
            </div>: " "}
        </div>
      )}
    </div>
  );
}
