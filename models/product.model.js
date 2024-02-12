const mongo=require("mongoose")
const Schema = mongo.Schema;

const prodSchema=mongo.Schema({
    prodName:String,
    prodDesc:String,
    prodPrice:Number,
    prodImages:[String],
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
},{
    timestamps:true
})

module.exports=mongo.model("Product",prodSchema)