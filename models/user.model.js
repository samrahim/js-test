const mongo=require("mongoose")
const Schema = mongo.Schema;
const bcrybt=require("bcrypt")

const userSchema=mongo.Schema({
    userName:String,
    userPhoneNumber:String,
    userPassword:String,
    cardList:[{ type: Schema.Types.ObjectId, ref: 'Product' }],
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
})
userSchema.pre("save",async function (next) {
    const salt=await bcrybt.genSalt();
    this.userPassword=await bcrybt.hash(this.userPassword,salt)
})

userSchema.statics.login=async function(userName,userPassword){
    console.log(userName)
    console.log("stary")
const user=await this.findOne({userName});
console.log(user)
if(user){
const result=await bcrybt.compare(userPassword,user.userPassword)
if (result) {
    return user;
}
throw Error('incrorrect password')
}
throw Error("incrorrect username")
}

module.exports=mongo.model("User",userSchema)