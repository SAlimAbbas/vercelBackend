const jwt=require("jsonwebtoken")
const auth=(req,res,next)=>{
   try {
    const token=req.header("Authorization").split(" ")[1]
    // console.log("token is", token);
    if(!token){
        return res.status(403).send("token is missing")
    }

    try {
        const decode=jwt.verify(token,process.env.SECRET)
        console.log(decode);
        //  res.send("Succes")
    } catch (error) {
        return res.status(401).send("Invalid Token")
    }
    return next()
   } catch (error) {
   return res.status(400).send("user not verified")
   }
}
module.exports=auth;