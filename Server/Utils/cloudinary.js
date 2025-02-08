import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
dotenv.config({});

cloudinary.config({
    api_key: process.env.API_key,
    api_secret: process.env.API_secret,
    cloud_name: process.env.Cloud_NAME,
})