const jwt = require("jsonwebtoken");
require("dotenv").config();


const tokenverify = async (req, res, next)=>{
    const token = req.cookies?.token;

    if(!token) return res.status(404).json({
        message:"Token missing"
    });

    try{

    const decoded = jwt.verify(token, process.env.SECERET_KEY);

    req.user=decoded;

    next();


    }catch(err){
         res.status(401).json({
            message: "Invalid or expired token"
        });

    }
    
}

module.exports = tokenverify;