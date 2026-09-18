import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import axios from "axios";


const Authcontext = createContext();

const Contextprovider = ({children})=>{

    const [islogin, setlogin]= useState(false);
    const [isloading, setloading]= useState(true);
    const [role , setrole] = useState("");
    const [id, setid]=useState();

    useEffect(()=>{
        const sessioncheck= async()=>{
            try{
            const res = await axios.get("http://localhost:3000/api/session",{
                withCredentials:true
            })
            setlogin(res.data.islogin);
            setrole(res.data.role)
            setid(res.data.id);
        }catch(err){
             if (err.response?.status === 401 || err.response?.status === 404) {
                setlogin(false);
            } else {
                alert( err.response.data.message);
            }
        }
        finally{
            setloading(false)
        }
        }
        sessioncheck();


    },[])

    return (
        <Authcontext.Provider value={{setlogin,setrole, setid, id,isloading,islogin,role}}>
            {children}
        </Authcontext.Provider>
    )

}

export {Authcontext,Contextprovider}



