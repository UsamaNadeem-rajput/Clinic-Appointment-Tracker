

const rolecheck = (req,res,next)=>{
    if(req.user.role !== "doctor"){
         return res.status(403).json({ message: "Access denied your not doctor" });
    }
    next();

}

module.exports = rolecheck;
