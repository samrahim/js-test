const express=require("express")
const app=express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const mongo=require("mongoose")
require("dotenv").config();
const userroutes=require("./routes/user.routes")
mongo.connect(`mongodb+srv://${process.env.mongo_userName}:${process.env.mongo_password}@cluster0.53dlfpy.mongodb.net/${process.env.mongo_dbname}?retryWrites=true&w=majority`)

const prodRoutes=require("./routes/product.routes")
const categoryRoutes=require("./routes/category.routes")
app.use("/api",userroutes)
app.use("/api",prodRoutes)
app.use("/api",categoryRoutes)

app.listen(8000,()=>{console.log("server starting ! ")})


