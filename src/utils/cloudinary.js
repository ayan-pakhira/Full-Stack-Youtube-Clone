import { v2 as cloud } from "cloudinary";
import fs from "fs";

// Configuration
cloud.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null;
        
        //upload the file on the cloudinary
       const response = await cloud.uploader.upload(localFilePath, 
            {
                resource_type:"auto"
            })

            //file has been successfully uploaded
            console.log("file successfully uploaded on cloudinary", response.url)
            fs.unlinkSync(localFilePath)
            return response //need to check the response by printing it in the console.
    }catch(error){
        fs.unlinkSync(localFilePath)
        return null;
        //this code will remove the locally saved temporary file as the upload 
        //operation got failed.
    }

}

export  {uploadOnCloudinary}
 

    // // Upload an image
    //  const uploadResult = await cloudinary.uploader
    //    .upload(
    //        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
    //            public_id: 'shoes',
    //        }
    //    )
    //    .catch((error) => {
    //        console.log(error);
    //    });
    
    // console.log(uploadResult);
    
    