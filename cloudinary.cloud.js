const cloudinary=require("cloudinary").v2;


cloudinary.config({ 
  cloud_name: 'djhmrgige', 
  api_key: '896953389935158', 
  api_secret: 'LBS6tEdoLHii-4pmUm_kkKU2VJ0' 
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