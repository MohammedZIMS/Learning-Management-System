import express from "express";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
import upload from "../Utils/multer.js";
import { 
    createCourse,  
    createLecture,  createLectureModule, 
    editCourse,  getCourseById, 
    getCouseLectureModule, getCreatorCourses, getLecturesByModuleId, getLectureById, removeLecture } from "../Controller/courseController.js";

const router = express.Router();

// Course Routes
router.post("/", isAuthenticated, upload.single("courseThumbnail"), createCourse); // Correct field name
router.get("/", isAuthenticated, getCreatorCourses);
router.put("/:courseId", isAuthenticated, upload.single("courseThumbnail"), editCourse); // Correct method (PUT)
router.get("/:courseId", isAuthenticated, getCourseById);

// Module Routes
router.post("/:courseId/lecture-module", isAuthenticated, createLectureModule);
router.get("/:courseId/lecture-module", isAuthenticated, getCouseLectureModule);

// Lecture Routes
router.post("/:courseId/lecture-module/:moduleId/lectures", isAuthenticated, createLecture);
router.get("/:courseId/lecture-module/:moduleId/lectures", isAuthenticated, getLecturesByModuleId);

router.post("/:courseId/lecture-module/:moduleId/lectures/:lectureId", isAuthenticated, editCourse);
router.delete("lecture-module/:moduleId/lectures/:lectureId", isAuthenticated, removeLecture);
router.get("lecture-module/:moduleId/lectures/:lectureId", isAuthenticated, getLectureById);


export default router;
