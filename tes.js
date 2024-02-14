const express=require("express")
const r=express()
const jwt=require("jsonwebtoken")


function isAuthenticated(req,res,next){
    const id=req.params.id;
    console.log("fotna men"+id)
    return next()
}


r.get("/a/:id",isAuthenticated,(req,res)=>{
    token=req.headers.authorization
  const taf=  jwt.decode(token)
    res.send(taf.userId)
})




module.exports=r