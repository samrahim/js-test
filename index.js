const express=require("express")
const app=express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const mongo=require("mongoose")
mongo.connect("mongodb+srv://userName:0kJ7ByhFtgdTJ5l6@cluster0.53dlfpy.mongodb.net/e-commerce-db?retryWrites=true&w=majority")

const prodRoutes=require("./routes/product.routes")
const categoryRoutes=require("./routes/category.routes")

app.use("/api",prodRoutes)
app.use("/api",categoryRoutes)

app.listen(8000,()=>{console.log("server starting ! ")})