const express = require("express")
const router= express.Router();
const db = require('../model/db');


router.get('/doctors', async(req,res)=>{

    try{
        const [row] = await db.query('select * from users as u inner join doctor_schedules as d on u.id = d.doctor_id');
        console.log(row)
        if(row.length >=0){
            res.status(200).json({
                success:true,
                message:"Fetched",
                info:row
            })
        }
    }catch(err){
        console.log(err)
    }
})

module.exports = router;