const express=require("express")
const {DoctorModel}=require("../models/doctor.model")
const {auth}=require("../middlewares/auth.middleware")

const doctorRouter=express.Router()

doctorRouter.use(auth)
doctorRouter.post("/appointments",async(req,res)=>{
    try{
        const doctor = new DoctorModel(req.body)
        await doctor.save()
        res.json({msg:"New Doctor has been added",doctor:req.body})
    }catch(err){
        res.json({error:err.message})
    }
})


doctorRouter.get("/",async(req,res)=>{
    try{
        const doctor=await DoctorModel.find({userID:req.body.userID})
        res.send(doctor)
    }catch(err){
        res.json({error:err.message})
    }
})

doctorRouter.patch("/update/:doctorID",async(req,res)=>{
    let ID = req.params.doctorID;
  let payload = req.body;
  let data = await DoctorModel.findOne({ _id: ID });
  let userID_post = data.userID;
  let userID_req = req.body.userID;

  try {
    if (userID_post == userID_req) {
      await DoctorModel.findByIdAndUpdate(
        {
          _id: ID,
        },
        payload
      );
      res.send(`data with ${ID} is updated`);
    } else {
      res.send("Not authorized");
    }
  } catch (error) {
    res.send(error);
  }
})


doctorRouter.delete("/delete/:doctorID",async(req,res)=>{
    const userIDinUserDoc=req.body.userID
    const {doctorID}=req.params
    try{
        const doctor=await DoctorModel.findOne({_id:doctorID})
        const userIDinNoteDoc=doctor.userID
        if(userIDinUserDoc===userIDinNoteDoc){
            await DoctorModel.findByIdAndDelete({_id:doctorID})
            res.json({msg:`${doctor.name} has been deleted`})
        } else {
            res.join({msg:"Not Authorized!!"})
        }
    }catch(err){
        res.json({error:err})
    }
})

module.exports={
    doctorRouter
}