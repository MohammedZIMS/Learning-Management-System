import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
dotenv.config({});

cloudinary.config({
    api_key: process.env.API_key,
    api_secret: process.env.API_secret,
    cloud_name: process.env.Cloud_NAME,
});

export const uploadMedia = async (file) => {
    try {
        const uploadResponse = await cloudinary.uploader.upload(file, {
            resource_type: "auto",
        });
        return uploadResponse;
    } catch (error) {
        console.log(error);
    }
};

export const deleteMediaFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log(error);
    }
};

export const deleteVideoFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    } catch (error) {
        console.log(error);

    }
};
