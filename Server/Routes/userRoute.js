import express from "express";
import { getUserProfile, login, logout, register, updateProfile } from "../Controller/userController.js"
import isAuthenticated from "../Middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile").get(isAuthenticated, getUserProfile);
router.route("/profile/update").put(isAuthenticated, updateProfile);

export default router;
