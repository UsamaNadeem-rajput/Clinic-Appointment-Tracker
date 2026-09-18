import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "../Navbar/NavBar";



export default function PatientDashboard() {
  const [data,setdata]=useState();
  const [message, setmessage] = useState();

  useEffect(()=>{

    const controller = new AbortController();

     async function patientdata(){
      try {

        const res = await axios.get("http://localhost:3000/api/patient/appointment/my-appointment",{
          withCredentials:true
        })

        if(res.data.success){
          setdata(res.data.appointment)
        }
        
      } catch (error) {
        alert(error?.response?.data?.message)
        setmessage(error?.response?.data?.message);
      }
    }

    patientdata();

    return () => controller.abort();
  },[])
  

  return(
    <div>
      <NavBar/>
      <h1>Dashboard</h1>
      {data ?  
        data.map((value,index)=>(
          <div>
            <ul>
              <li>Token Number:  <span style={{color:"blue"}}>{value.token_number}</span> </li>
              <li>Time Slot:     <span style={{color:"blue"}}>{value.time_slot} </span></li>
              <li>Scheduale Date:<span style={{color:"blue"}}>{value.schedule_date}</span></li>
              <li>Doctor Name:   <span style={{color:"blue"}}>{value.doctor_name}</span></li>
              <li>Specialization:<span style={{color:"blue"}}>{value.specialization}</span></li>
              <li>Status:        <span style={{color:"blue"}}>{value.status} </span></li>
            </ul>
          </div>
        ))
        : <h1>{message}</h1>
      }

    </div>
  )
}
