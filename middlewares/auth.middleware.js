const jwt=require("jsonwebtoken")

const auth=(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1]
    console.log(token);
    if(token){
        try{
            const decoded=jwt.verify(token,"masai")
            if(decoded){
                req.body.userID=decoded.userID
                req.body.user=decoded.user
                next()
            } else {
                res.json({msg:"Not Authorizeddd!!"})
            }
        }catch(err){
            res.json({error:err.message})
        }
    } else {
        res.json({msg:"Please Login!!"})
    }
}
module.exports={
   auth
}