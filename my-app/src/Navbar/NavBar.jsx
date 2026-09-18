import { useContext } from "react";
import { Authcontext } from "../context/Contextprovider";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  const { role } = useContext(Authcontext);

  return (
    <div style={style.main_div}>
      <div style={style.first_item}>Hosipitam Management System</div>
      <nav style={style.second_item}>
        {role == "doctor" ? (
          <div>
            <NavLink  to="/next-token" style={({isActive})=>(isActive?style.Activepageslink:style.pageslink)} >Token Generation</NavLink>
            <NavLink  to="/doctor"     style={({isActive})=>(isActive?style.Activepageslink:style.pageslink)} >Dashboard</NavLink>
            <NavLink  to="/logout"     style={({isActive})=>(isActive?style.Activepageslink:style.pageslink)} >Log-out</NavLink>

          </div>
        ) : (
          <div>
            <NavLink style={({isActive})=>(isActive?style.Activepageslink:style.pageslink)} to="/select-slot">Selected Slot</NavLink>
            <NavLink  style={({isActive})=>(isActive?style.Activepageslink:style.pageslink)} to="/logout">Log-out</NavLink>
          </div>
        )}
      </nav>
    </div>
  );
}

const style = {
  main_div: {
    display: "flex",
    backgroundColor: "skyblue",
    color: "black",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
  },
  first_item: {
    paddingLeft:"30px"

  },
  second_item: {
    paddingRight:"30px"
  },
  pageslink:{
    marginRight:"20px",
    color:"blue"
    
  },
  Activepageslink:{
    marginRight:"20px",
    textDecoration: "underline",
    backgroundColor:"black",
    color:"white"
  }
};
