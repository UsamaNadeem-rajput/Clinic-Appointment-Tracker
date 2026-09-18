const express = require("express");
const routes= express.Router();
const db = require("../model/db");
const rolecheck = require("../middlewares/rolecheck")
const tokenverify = require("../middlewares/tokenverify");


routes.post('/schedules',tokenverify,rolecheck , async(req,res)=>{

    const {doctor_id,schedule_date,start_time,end_time,slot_duration_minutes}= req.body;  
    try{

    const [row] = await db.query("insert into doctor_schedules(doctor_id,schedule_date,start_time,end_time,slot_duration_minutes) values(?,?,?,?,?)",[doctor_id,schedule_date,start_time,end_time,slot_duration_minutes])

    res.status(201).json({
      success:true,
      schedule_id:row.insertId
    })
    
  }catch(err){
    if (err.code === "ER_DUP_ENTRY") {

        return res.status(409).json({
            success: false,
            message: err.sqlMessage
        });
    }

    }
    
})
routes.get('/schedules/allscheduals',tokenverify,rolecheck , async(req,res)=>{
  const {id} = req.user
  
  try {

    const [row] = await db.query('select * from doctor_schedules where doctor_id=?',[id])
    if(row.length<=0){
      return res.status(404).json({
        message:"There is no any Appointment"
      })
    }
    console.log(row)
    res.status(200).json({
      success:true,
      schedules:row
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:"Nothing Finded"
    })
  }
})

routes.get('/schedules/availables/:scheduleId',tokenverify,rolecheck , async(req,res)=>{

  console.log("ya main hon")
   const {id} = req.user
  const {scheduleId} = req.params;

  try {
    const [check] = await db.query('select * from doctor_schedules where id=? AND doctor_id=?',[scheduleId,id])
      if(check.length<=0){
        return res.status(404).json({
          message:"You Don't have scheduales"
        })
      }

    const [row] = await db.query('SELECT a.id, a.token_number, a.time_slot, a.status,u.name AS patient_name, u.email AS patient_email FROM appointments a JOIN users u ON a.patient_id = u.id WHERE a.schedule_id = ? ORDER BY a.token_number ASC',[scheduleId])
    console.log(row);
    
    res.status(200).json({
      success:true,
      data:row
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message:"There is something happen"
    })
    
  }



})

routes.patch('/schedules/:scheduleId/next-token', tokenverify, rolecheck, async (req, res) => {
  const { scheduleId } = req.params;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [scheduleRows] = await connection.query(
      'SELECT current_token FROM doctor_schedules WHERE id = ? FOR UPDATE',
      [scheduleId]
    );

    if (scheduleRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }

    const [appointRows] = await connection.query(
      'SELECT MAX(token_number) AS max_token FROM appointments WHERE schedule_id = ?',
      [scheduleId]
    );

    const maxToken = appointRows[0]?.max_token || 0;
    const currentToken = scheduleRows[0]?.current_token || 0;

    if (maxToken === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'No appointments booked for this schedule',
      });
    }

    if (currentToken >= maxToken) {
      await connection.query(
        'UPDATE appointments SET status = "completed" WHERE schedule_id = ? AND token_number = ?',
        [scheduleId, currentToken]
      );
      await connection.commit();

      return res.status(400).json({
        success: false,
        message: 'All appointments have been completed for this schedule.',
        Token:currentToken
      });
    }

    const nextToken = currentToken + 1;

    await connection.query(
      'UPDATE doctor_schedules SET current_token = ? WHERE id = ?',
      [nextToken, scheduleId]
    );

    if (currentToken > 0) {
      await connection.query(
        'UPDATE appointments SET status = "completed" WHERE schedule_id = ? AND token_number = ?',
        [scheduleId, currentToken]
      );
    }

    await connection.query(
      'UPDATE appointments SET status = "in-consultation" WHERE schedule_id = ? AND token_number = ?',
      [scheduleId, nextToken]
    );

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: 'Next token called successfully',
      token: nextToken,
    });

  } catch (error) {
    console.error(error);
    await connection.rollback();
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  } finally {
    connection.release();
  }
});



module.exports= routes;