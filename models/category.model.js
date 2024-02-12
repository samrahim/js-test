const mongo=require("mongoose")
const Schema = mongo.Schema;


const categorySchema=mongo.Schema({
    categoryName:String,
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
})

module.exports=mongo.model("Category",categorySchema)