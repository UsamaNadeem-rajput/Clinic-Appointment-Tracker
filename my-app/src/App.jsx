import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom"
import LoginPage from "./Authentication/LoginPage"
import Register from "./Authentication/Register"
import DoctorDashboard from "./content/DoctorDashboard"
import PatientDashboard from "./content/PatientDashboard"
import SelectSlots from "./content/SelectSlots"
import NextToken from "./content/NextToken"
import { Contextprovider } from "./context/Contextprovider"
import ProtectedRoute from "./context/ProtectedRoute"
import LogOut from "./Authentication/LogOut"

function App() {

  return (
    <>
    <Contextprovider>
    <BrowserRouter>

    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/logout" element={<LogOut/>}/>

      <Route element={<ProtectedRoute/>}>
      <Route path="/doctor" element={<DoctorDashboard/>}/>
      <Route path="/patient" element={<PatientDashboard/>}/>
      <Route path="/select-slot" element={<SelectSlots/>} />
      <Route path="/next-token/:schedualeId" element={<NextToken/>} />
      </Route>
    </Routes>
    
    </BrowserRouter>
    </Contextprovider>

    

    </>
  )
}

export default App
