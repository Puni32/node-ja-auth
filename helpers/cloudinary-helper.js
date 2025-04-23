const { fileURLToPath } = require('url');
const cloudinary = require('../config/cloudinary');

const uploadtocloudinary = async(filePath) => {
    try{
        const result = await cloudinary.uploader.upload(filePath);

        return{
            url : result.secure_url,
            publicId : result.public_id,
        };
         
    }catch(error){
        console.error('error got while uploading to cloudinary',error)
        throw new Error('error while uploading to cloudinary')
    }

}
module.exports ={
    uploadtocloudinary
}