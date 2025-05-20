import express from "express";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
import { getCourseProgress, markAsCompleted, markAsIncompleted, updateLectureProgress } from "../Controller/courseProgressController.js";

const router = express.Router()

router.get("/:courseId", isAuthenticated, getCourseProgress);
router.post("/:courseId/lecture/:lectureId/view", isAuthenticated, updateLectureProgress);
router.post("/:courseId/complete", isAuthenticated, markAsCompleted);
router.post("/:courseId/incomplete", isAuthenticated, markAsIncompleted);

//
export default router;
