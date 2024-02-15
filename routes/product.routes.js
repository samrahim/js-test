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
const userroute=require("./user.routes")



r.post("/create/prod",userroute.isAuthenticated,upload.array("file"),async(req,res)=>{
const token = req.headers.authorization;
const decodedToken=jwt.decode(token)
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
            userRef:decodedToken.userId,
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
    
})

r.get("/get/prods",userroute.isAuthenticated,async(req,res)=>{
await prodModel.find().populate({path:'category',select:{ 'products': 0 }}).then(prods=>{
  return  res.send(prods)
}).catch((e)=>{
   return res.send('server side err '+e)})           
})

r.get("/get/prods/:id",userroute.isAuthenticated,async(req,res)=>{
          await prodModel.findById({_id:req.params.id},{ projection: { 'category.products': 0 }}).populate({path:'category',select:{ 'products': 0 }}).then(prods=>{
                res.send(prods)
            }).catch((e)=>{res.send('server side err '+e)})         
})

r.delete("/delete/prod/:id",userroute.isAuthenticated,async(req,res)=>{
    const token = req.headers.authorization;
  const decodedToken=  jwt.decode(token)
  const prodUserId =prodModel.findOne(req.params.id).populate({path:"userref"})
  if (prodUserId.userref._id==decodedToken.userId) {
    const prod=await prodModel.findOneAndDelete(req.params.id)
            const user = await userModel.findByIdAndUpdate(decodedToken.userId, { $pull: { products: req.params.id } }, { new: true });
            const cate = await category.findByIdAndUpdate(prod.category, { $pull: { products: req.params.id } }, { new: true });
            return res.json({msg:"item deleted success"})
          }else{
return res.send("cant delete it")
  }
})

r.post("/addProdToCart/:id",userroute.isAuthenticated,async(req,res)=>{
  const token = req.headers.authorization;
  const decodedToken=  jwt.decode(token)
const user=await userModel.findById(decodedToken.userId)
 await user.cardList.push(req.params.id)
await user.save().then(s=>{return res.send("added to cart")}).catch(e=>{return res.send("we have err in cart "+ e)})
})

r.delete("/deleteprodfromCart/:id",userroute.isAuthenticated,async(req,res)=>{
  const token = req.headers.authorization;
  const decodedToken=  jwt.decode(token)
  const user = await userModel.findByIdAndUpdate(decodedToken.userId, { $pull: { cardList: req.params.id } }, { new: true });
 await user.save().then(s=>{res.json(
  {"newcard":user.cardList}
 )})
})


module.exports=r