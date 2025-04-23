const image = require('../models/image');
const { uploadtocloudinary } = require('../helpers/cloudinary-helper');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

const uploadimagecontroller = async (req, res) => {
    try {
        // check if file exists
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File is required. Please upload an image.',
            });
        }
        // upload to cloudinary
        const { url, publicId } = await uploadtocloudinary(req.file.path);
        // store the image url and public id along with the uploaded user id
        const newlyuploadedimage = new image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId,
        });

        await newlyuploadedimage.save();
        // delete the file from local storage
        fs.unlinkSync(req.file.path);
        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            image: newlyuploadedimage,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again.',
        });
    }
};

const fetchimagescontroller = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 :-1;
        const totalimages = await image.countDocuments();
        const totalpages = Math.ceil(totalimages/limit)

        const sortObj = {};
        sortObj[sortBy] = sortOrder
        const images = await image.find().sort(sortObj).skip(skip).limit(limit);
        if (images) {
            res.status(200).json({
                success: true,
                currentpage : page,
                totalpages : totalpages,
                totalimages : totalimages,
                data: images,
            });
        } else {
            res.status(200).json({
                success: true,
                data: [],
                message: 'No images found.',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong while fetching images!',
        });
    }
};
const imagedeletecontroller = async(req,res)=> {
    try{
        const getcurrentidofimage = req.params.id;
        const userId = req.userInfo.userId;

        const image = await image.findById(getcurrentidofimage);
        if(!image){
            return res.status(404).json({
                success : false,
                message : 'image not found'
            })
        }
        // check if these image is uploaded by current user
        if(image.uploadedBy.toString() == !userId){
            return res.status(403).json({
                success : false,
                message : 'you are not authorized to delete this one'
            })
        }
        // delete this image from first cloudinary storage
        await cloudinary.uploader.destroy(image.publicId);

        //delete this image from mongodb database
        await image.findByIdAndUpdate(getcurrentidofimage);
        res.status(200).json({
            success : true,
            message : "image deletd successfully"

        })


    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong while fetching images!',
        });
    }
}

module.exports = {
    uploadimagecontroller,
    fetchimagescontroller,
    imagedeletecontroller,
};