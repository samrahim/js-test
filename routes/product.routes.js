const express=require("express")
const r=express()
const prodModel=require("../models/product.model")
const userModel=require("../models/user.model")
const multer=require("multer")
const cloud=require("../cloudinary.cloud")
const upload = multer({ dest: 'uploads/' })
const category=require("../models/category.model")
require("dotenv").config();
const jwt = require('jsonwebtoken');

r.post("/create/prod",upload.array("file"),async(req,res)=>{
 
 const token = req.headers.authorization;
 jwt.verify(token,process.env.secret_key_jsw ,async (err, decodedToken) => {
  
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    } else {
        const uploadPromises = req.files.map(element => cloud.uploadFile(element.path));

    try {
       
        const uploadedFiles = await Promise.all(uploadPromises);
    
   
        const secureUrls = uploadedFiles.map(file => file.secure_url);
    
        const prod = new prodModel({
            prodName: req.body.prodName,
            prodDesc: req.body.prodDesc,
            prodPrice: req.body.prodPrice,
            prodImages: secureUrls,
            category:req.body.category,
        });
        console.log(prod.prodDesc);
  const savedProduct = await prod.save();
  if (savedProduct) {
   const user=await userModel.findById(decodedToken.userId);
   console.log(user)
  await user.products.push(savedProduct._id)
  await  user.save();
  const cat = await category.findById(req.body.category);
  await cat.products.push(savedProduct._id);
  await cat.save();
  return res.send(savedProduct);
  }else{
    return res.send("some server side errors")
  }

    }catch(error) {
        return res.send(error) ;
    }
    }
  });


   
})

r.get("/get/prods",(req,res)=>{
    const token = req.headers.authorization;
    
    jwt.verify(token,process.env.secret_key_jsw ,async (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ error: 'Invalid token' });
        } else {
            await prodModel.find().populate({path:'category',select:{ 'products': 0 }}).then(prods=>{
              return  res.send(prods)
            }).catch((e)=>{
               return res.send('server side err '+e)})
         
        }
      });
})

r.get("/get/prods/:id",async(req,res)=>{
    await prodModel.findById({_id:req.params.id},{ projection: { 'category.products': 0 }}).populate({path:'category',select:{ 'products': 0 }}).then(prods=>{
        res.send(prods)
    }).catch((e)=>{res.send('server side err '+e)})
})

module.exports=r