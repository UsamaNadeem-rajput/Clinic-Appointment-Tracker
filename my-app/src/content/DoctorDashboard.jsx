import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Authcontext } from "../context/Contextprovider";
import NavBar from "../Navbar/NavBar";
import { useNavigate } from "react-router-dom";

export default function DoctorDashboard() {
  const { role, id } = useContext(Authcontext);
  const [schedule, setschedule] = useState({
    schedule_date: "",
    start_time: "",
    end_time: "",
    slot_duration_minutes: 15,
    doctor_id: id,
  });

  const [Scheduale_data, setSchedualedata] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    async function allscheduales() {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/doctor/schedules/allscheduals",
          {
            withCredentials: true,
          },
        );

        if (res.data.success) {
          setSchedualedata(res.data.schedules);
        }
      } catch (error) {
        alert(error?.response?.data?.message);
        setmessage(error?.response?.data?.message);
      }
    }

    allscheduales();

    return () => controller.abort();
  }, []);

  const selectedscheduale = (schedualeId) => {
    if (schedualeId) {
      navigate(`/next-token/${schedualeId}`);
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/doctor/schedules",
        schedule,
        {
          withCredentials: true,
        },
      );
      if (res.data.success) {
        alert("Scheduale created");
      }
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };
  return (
    <div>
      <NavBar />
      <h1>Dashboard</h1>
      <div>
        <form onSubmit={handlesubmit}>
          <label htmlFor="schedule_date">schedule_date</label>
          <input
            type="date"
            name="schedule_date"
            id="schedule_date"
            placeholder="Add schedule_date"
            onChange={(e) =>
              setschedule({ ...schedule, schedule_date: e.target.value })
            }
          />

          <label htmlFor="start_time">start_time</label>
          <input
            type="time"
            name="start_time"
            id="start_time"
            placeholder="start_time"
            onChange={(e) =>
              setschedule({ ...schedule, start_time: e.target.value })
            }
          />

          <label htmlFor="end_time">end_time</label>
          <input
            type="time"
            name="end_time"
            id="end_time"
            placeholder="end_time"
            onChange={(e) =>
              setschedule({ ...schedule, end_time: e.target.value })
            }
          />
          <label htmlFor="slot_duration_minutes">slot_duration_minutes</label>
          <input
            type="text"
            name="slot_duration_minutes"
            id="slot_duration_minutes"
            placeholder="slot_duration_minutes"
            onChange={(e) =>
              setschedule({
                ...schedule,
                slot_duration_minutes: e.target.value,
              })
            }
          />

          <button type="submit">Submit</button>
        </form>

        <div>
          <h2>Select the Scheduale</h2>
          <div>
            {Scheduale_data ? (
              Scheduale_data.map((value, index) => (
                <div>
                  <ul>
                    <li>Scheduale Date: {value.schedule_date}</li>
                    <li>Scheduale Start Time:{value.start_time}</li>
                    <li>Scheduale End Time: {value.end_time}</li>
                    <li>Current Token: {value.current_token}</li>
                  </ul>
                  <button onClick={() => selectedscheduale(value.id)}>
                    Select Scheduale
                  </button>
                </div>
              ))
            ) : (
              <div>There is no any Scheduale currently</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
