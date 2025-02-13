import express from "express";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
import { createCourse } from "../Controller/courseController.js";

const router = express.Router();

router.route("/").post(isAuthenticated, createCourse);

export default router;