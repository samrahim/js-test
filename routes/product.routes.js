const express=require("express")
const r=express()
const prodModel=require("../models/product.model")
const multer=require("multer")
const cloud=require("../cloudinary.cloud")
const upload = multer({ dest: 'uploads/' })
const category=require("../models/category.model")
r.post("/create/prod",upload.array("file"),async(req,res)=>{
 const cat = await category.findById(req.body.category);


    const uploadPromises = req.files.map(element => cloud.uploadFile(element.path));

    try {
       
        const uploadedFiles = await Promise.all(uploadPromises);
    
   
        const secureUrls = uploadedFiles.map(file => file.secure_url);
    
        const prod = new prodModel({
            prodName: req.body.prodName,
            prodDesc: req.body.prodDesc,
            prodPrice: req.body.prodPrice,
            prodImages: secureUrls,
            category:req.body.category
        });
  const savedProduct = await prod.save();
  cat.products.push(savedProduct._id);
  await cat.save();
  res.send(savedProduct);
    
    
    }catch(error) {
       
        res.send(error);
    }

})

r.get("/get/prods",async(req,res)=>{
    await prodModel.find().populate({path:'category',select:{ 'products': 0 }}).then(prods=>{
        res.send(prods)
    }).catch((e)=>{res.send('server side err '+e)})
    
})

r.get("/get/prods/:id",async(req,res)=>{
    await prodModel.findById({_id:req.params.id},{ projection: { 'category.products': 0 }}).populate({path:'category',select:{ 'products': 0 }}).then(prods=>{
        res.send(prods)
    }).catch((e)=>{res.send('server side err '+e)})
})

module.exports=r