const express=require("express")
const r=express()
const category=require("../models/category.model")

r.post("/create/category",async(req,res)=>{
    const newCategory=new category({
        categoryName:req.body.categoryName
    })
    await newCategory.save().then(re=>{res.send(re)}).catch(e=>{res.send(e)})
})
r.get("/get/category",async(req,res)=>{
    
    await category.find().populate('products').then(re=>{res.send(re)}).catch(e=>{res.send(e)})
})


module.exports=r