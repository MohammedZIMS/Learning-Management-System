import express from "express";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
import upload from "../Utils/multer.js";
import { createCourse, createLectureModule, editCourse, getCourseById, getCouseLectureModule, getCreatorCourses } from "../Controller/courseController.js";

const router = express.Router();

router.post("/", isAuthenticated, upload.single("courseThumbnail"), createCourse); // Correct field name
router.get("/", isAuthenticated, getCreatorCourses);
router.put("/:courseId", isAuthenticated, upload.single("courseThumbnail"), editCourse); // Correct method (PUT)
router.get("/:courseId", isAuthenticated, getCourseById);
router.post("/:courseId/lecture-module", isAuthenticated, createLectureModule);
router.get("/:courseId/lecture-module", isAuthenticated, getCouseLectureModule);

export default router;
