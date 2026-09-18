const express = require("express");
const app = express();
const cors = require("cors");
const tokenverify = require("./middlewares/tokenverify");
const authroute = require("./auth/auth");
const cookie = require("cookie-parser");
const schedule = require("./controller/scheduale")
const showdoctor = require("./controller/showdoctor")
const appointment = require("./controller/appointment")

require("dotenv").config();

const corsoption = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
  allowedHeaders: ["content-Type"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsoption));
app.use(cookie());

app.get('/api/session',tokenverify,(req,res)=>{
  
  if(req.user){
    res.status(200).json({
      islogin : true,
      id:req.user.id,
      role:req.user.role
    })
  }

})

app.use('/',authroute);
app.use('/api/doctor',schedule);
app.use('/api/show',showdoctor)
app.use('/api/patient',appointment);






app.listen(3000, () => {
  console.log("Server is running on 3000");
});
