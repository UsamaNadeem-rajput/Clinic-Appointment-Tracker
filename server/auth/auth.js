const express = require("express");
const  router=  express.Router();
const jwt = require("jsonwebtoken");
const db = require("../model/db");
const bcrypt = require("bcryptjs");
const cookie = require("cookie-parser");
const tokenverify = require("../middlewares/tokenverify");
require("dotenv").config();


router.post("/register", async (req, res) => {
  const { name, email, password, role, specialization } = req.body;

  const hashpassword = await bcrypt.hash(password, 10);

  try {

    const [row] = await db.query(
      "insert into users(name,email,password,role,specialization) values (?,?,?,?,?)",
      [name, email, hashpassword, role, specialization],
    );
    const id=row.insertId

    const token = jwt.sign(
      { id: id, role: role },
      process.env.SECERET_KEY,
      {
        expiresIn: "1h",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Your account is created",
      id:id,
      role:role
    });

  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {

        return res.status(409).json({
            success: false,
            message: "Email already exists"
        });
    }
        res.status(500).json({
        success: false,
        message: "Internal server error",
        });
  }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  try {

    const [row] = await db.query("select * from users where email=?", [email]);

    const hasedpassword = row[0].password;
    const hashedcheck = await bcrypt.compare(password, hasedpassword);
    
    if (!hashedcheck) {
      return res.status(400).json({
                success: false,
                message: "Email and Password are not matched",
      });
    }

    const token = jwt.sign(
      { id: row[0].id, role: row[0].role },
      process.env.SECERET_KEY,
      {
        expiresIn: "1h",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Login Successfull",
        role: row[0].role,
        id:row[0].id
      });

  } catch (err) {
    console.log(err)
     res.status(500).json({
        success: false,
        message: "Internal Server Error"
      });
  }
});



router.get('/logout',tokenverify,async(req,res)=>{
 res.clearCookie("token",{
  httpOnly:true
 })
 console.log("Logout");
})







module.exports = router;
