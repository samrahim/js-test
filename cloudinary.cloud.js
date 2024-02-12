const cloudinary=require("cloudinary").v2;
require("dotenv").config();


cloudinary.config({ 
  cloud_name: process.env.cloud_name, 
  api_key:process.env.api_key , 
  api_secret: process.env.api_secret
});

const uploadFile=async(filePath)=>{
    try {
        const result=await cloudinary.uploader.upload(filePath);
        
        return result;
    } catch (error) {
        
        throw error
    }
}



module.exports={uploadFile}