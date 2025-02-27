import express, { Router } from "express";
import upload from "../Utils/multer.js";
import { uploadMedia } from "../Utils/cloudinary.js";

const router = express.Router();

router.route("/upload-video").post(upload.single("file"), async(req, res) => {
    try {
        const result = await uploadMedia(req.file.path);
        res.status(200).json({
            success: true,
            message: "File uploaded successful.",
            data: result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error uploading file"
        })
        
    }
});

export default router;
