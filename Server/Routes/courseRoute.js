import express from "express";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
import upload from "../Utils/multer.js";
import { 
    createCourse,  createLecture,  createLectureModule, 
    editCourse,  getCourseById, 
    getCouseLectureModule, getCreatorCourses, 
    getLecturesByModuleId, getLectureById, 
    removeLecture, editLecture,
    togglePublishCourse,
    getPublishedCourses,
    searchCourse} from "../Controller/courseController.js";

const router = express.Router();

// Course Routes
router.post("/", isAuthenticated, upload.single("courseThumbnail"), createCourse); // Correct field name
router.get("/search", isAuthenticated, searchCourse); // Search Course
router.get("/published-courses", isAuthenticated, getPublishedCourses); // Corrected route for published courses
router.get("/", isAuthenticated, getCreatorCourses); // Corrected route for creator courses
router.put("/:courseId", isAuthenticated, upload.single("courseThumbnail"), editCourse); // Correct method (PUT)
router.get("/:courseId", isAuthenticated, getCourseById);

// Module Routes
router.post("/:courseId/modules", isAuthenticated, createLectureModule);
router.get("/:courseId/modules", isAuthenticated, getCouseLectureModule);

// Lecture Routes
router.post("/:courseId/modules/:moduleId/lectures", isAuthenticated, createLecture);
router.get("/:courseId/modules/:moduleId/lectures", isAuthenticated, getLecturesByModuleId);

// Lecture Edit and Delete Routes
router.post("/:courseId/modules/:moduleId/lecture/:lectureId", isAuthenticated, editLecture);
router.delete("/lecture/:lectureId", isAuthenticated, removeLecture);
router.get("/lecture/:lectureId", isAuthenticated, getLectureById);

// Toggle publish status of a course
router.patch("/:courseId", isAuthenticated, togglePublishCourse); 


export default router;
