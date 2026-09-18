const express = require("express");
const router = express.Router();
const db = require("../model/db");
const tokenverify = require('../middlewares/tokenverify')


const slotCalculation=(start_time,end_time)=>{

    const [hourstr, mintstr] = start_time.split(':')
    const [hoursend,mintend] = end_time.split(':')
    const allslot=[];

    const startMinutes =(Number(hourstr)*60)+Number(mintstr);
    const endMinutes = (Number(hoursend)*60)+Number(mintend);



    let current = startMinutes;
    const flagend = endMinutes;

    const interval = 15;

    while(current<flagend){

        const stringhours= parseInt((current/60),10)
        const stringmint=Number(current%60)
       
        const addinterval= current+interval;

        
        const addintervalstringhours= parseInt((addinterval/60),10)
        const addintervalstringmint=parseInt((addinterval%60),10)

        const final = `${stringhours}:${stringmint}-${addintervalstringhours}:${addintervalstringmint}`;

        allslot.push(final)

        current+=interval;
    }

    return allslot;


}

router.use(tokenverify,(req,res,next)=>{
  if(req.user.role !=='patient'){
         return res.status(403).json({ message: "Access denied your not patient" });
    }
    next();
})



router.post('/addappointment',tokenverify, async(req,res)=>{
  const {schedualeId,slot,doctorId} = req.body
  const {id} = req.user
  console.log(id,schedualeId,slot,doctorId);
  
  try{

    const [row] = await db.query("SELECT * FROM appointments WHERE schedule_id = ? AND time_slot = ? AND status != 'cancelled'",[schedualeId,slot]);
  
    if(row.length>0){
      return res.status(409).json({
        message:"Slot already booked"
      })
    }

    const [token_number]=await db.query("SELECT IFNULL(MAX(token_number), 0) + 1 AS next_token FROM appointments WHERE schedule_id = ?",[schedualeId])
    const tokenNumber = token_number[0].next_token;

    const [appointment]=await db.query("INSERT INTO appointments (patient_id, schedule_id, token_number, time_slot, status) VALUES (?, ?, ?, ?, 'booked')",[id,schedualeId,tokenNumber,slot])

    console.log(appointment);
    

    res.status(201).json({
      success:true,
      message: "Booked successfully ",tokenNumber,slot
    })

  }catch(err){
    if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
            success: false,
            message: "This slot was just taken by someone else"
        });
    }
    console.log(err)
    res.status(500).json({
      message:"Internal Server Error"
    })

  }
})

router.get('/appointment/my-appointment',tokenverify, async(req,res)=>{

  const {id} = req.user
  
  try {

    const [row] = await db.query('SELECT a.id, a.token_number, a.time_slot, a.status, ds.schedule_date, u.name AS doctor_name, u.specialization FROM appointments a JOIN doctor_schedules ds ON a.schedule_id = ds.id JOIN users u ON ds.doctor_id = u.id WHERE a.patient_id = ? ORDER BY ds.schedule_date DESC, a.id DESC;',[id])
    if(row.length<=0){
      return res.status(404).json({
        message:"There is no any Appointment"
      })
    }
    console.log(row)
    res.status(200).json({
      success:true,
      appointment:row
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:"Nothing Finded"
    })
  }
})

router.get("/appointment/:doctorId", tokenverify,async(req, res) => {
  try {
    const { doctorId } = req.params;
    const {date,SchedualeId} = req.query;
   
    const [row] =await db.query(
      "select * from doctor_schedules where doctor_id = ?  AND schedule_date = ?",[doctorId,date]
    );

    if (row.length === 0) {
      return res.status(401).json({
        message: "Doctor is not available",
      });
    }


    const start_time = row[0].start_time;
    const end_time = row[0].end_time;

    const allslots=slotCalculation(start_time,end_time);

    const [slots] =await db.query(
      "SELECT time_slot FROM appointments WHERE schedule_id = ? AND status != 'cancelled'",[SchedualeId]
    );

    const commonSlots = allslots.filter((item) => !slots.some((s) => s.time_slot === item));

    res.status(200).json({
        success:true,
        message: "Doctor Selected",
        slots:commonSlots
    })


  } catch (err) {
    res.json({
        message:err
    })
  }
});


module.exports = router;


