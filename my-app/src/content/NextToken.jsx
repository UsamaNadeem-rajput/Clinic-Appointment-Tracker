import { useParams } from "react-router-dom"
import style from "./NextToken.module.css"
import NavBar from "../Navbar/NavBar";
import { useEffect, useState } from "react";
import axios from "axios";


function NextToken() {
  const {schedualeId} = useParams();
  const [data,setdata]=useState();
  const [count,setcount] = useState(0);

  useEffect(()=>{

    async function currentscheduale(){
      try {

        const res = await axios.get(`http://localhost:3000/api/doctor/schedules/availables/${schedualeId}`,{
          withCredentials:true
        });

        if(res.data.success){
          setdata(res.data.data)

        }

      
    } catch (error) {
      alert(error.response?.data?.message)
    }

    }
    currentscheduale();

  },[count])

  async function nextpatient(){

    try {

        const res = await axios.patch(`http://localhost:3000/api/doctor/schedules/${schedualeId}/next-token`,{},{
          withCredentials:true
        });

        if(res.data.success){
          setcount(res.data.token)

        }
    } catch (error) {
      setcount(error?.response?.data?.Token)
      alert(error.response?.data?.message)
      
      console.log(error)
    }

  }



  return (
    <div>
      <NavBar/>
        <h1 className={style.heading}>Token Dashboard</h1>

        <div className={style.nexttokenbody}>
          <button className={style.nexttoken} onClick={nextpatient}>{count}</button>
        </div>

        <div>
          <div>
            {
              data ? (
                data.map((value,index)=>(
                  <ul key={index}>
                    <li>Patient Name: {value.patient_name}</li>
                    <li>Patient Email: {value.patient_email}</li>
                    <li>Token Number: {value.token_number}</li>
                    <li>Time Slot: {value.time_slot}</li>
                    <li>Status: {value.status}</li>
                  </ul>

                ))
              ):" "
            }
          </div>
        </div>


    </div>

  )
}

export default NextToken