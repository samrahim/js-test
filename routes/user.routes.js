const express = require('express');
 const r = express.Router();
const userModel=require("../models/user.model")
 const jwt = require('jsonwebtoken');
require("dotenv").config()


const createToken=(userId,username)=>{

const secretKey =process.env.secret_key_jsw ; 
const payload = { userId: userId, username:username }; 
const token = jwt.sign(payload, secretKey, { expiresIn: 3*24*60*60 }); 
return token

}
r.post("/signup",async(req,res)=>{
    
    try {
        const user=new userModel({
            userName:req.body.userName,
            userPhoneNumber:req.body.userPhoneNumber,
            userPassword:req.body.userPassword,
            products: []
        })
        await user.save().then(data=>{
            res.json({msg:"user saved",token:createToken(user._id,req.body.userName)})
        }).catch(e=>{
         return   res.send({msg:"server side err",error:e})
        })
    } catch (error) {
        res.json({msg:error})
    }
})
r.post("/login",async(req,res)=>{
  const userName=req.body.userName
  const userPassword=req.body.userPassword
  
  try {
  const user=await userModel.login(userName,userPassword)
 const token=  createToken(user._id,userName)
    res.json({msg:"succees",token:token,userData:user})
  } catch (error) {
    res.json({msg:"please verify you info ?"})
  }
})


r.get("/getMyInfo",isAuthenticated,async(req,res)=>{
    const token = req.headers.authorization;
    const id=token.userId
    const user=await userModel.findOne(id)
    if (user) {
       return  res.send(user)
    }else{
       return res.send("undefind user")
    }
})


function isAuthenticated(req,res,next) {
    const token = req.headers.authorization;
    jwt.verify(token,process.env.secret_key_jsw,async(err,decodedToken)=>{
        if (err) {
            return res.status(201).json({ msg: 'Invalid token' });
        }else{
            return next()
        }
    })
}




module.exports={r,isAuthenticated}




