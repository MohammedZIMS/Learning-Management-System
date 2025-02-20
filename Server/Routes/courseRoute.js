import express from "express";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
import { createCourse, editCourse, getCreatorCourses } from "../Controller/courseController.js";
import upload from "../Utils/multer.js";

const router = express.Router();

router.route("/").post(isAuthenticated, createCourse);
router.route("/").get(isAuthenticated, getCreatorCourses);
router.route("/").post(isAuthenticated, upload.single("courseThumbnail"), editCourse);

export default router;
