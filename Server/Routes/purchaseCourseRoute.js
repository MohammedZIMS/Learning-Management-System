import express from 'express';
import { createCheckoutSession, getAllPurchasedCourses, getCourseDetailsWithPurchaseStatus, stripeWebhook } from '../Controller/coursePurchaseController.js';
import  isAuthenticated  from "../Middlewares/isAuthenticated.js";

const router = express.Router();

// Secure checkout route
router.post('/checkout/create-checkout-session', isAuthenticated, createCheckoutSession);

// Stripe requires raw body for signature verification
// This middleware gives us the raw request body needed for signature verification
router.post( '/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Route to get course details with purchase status
router.get('/course/:courseId/detail-with-status',isAuthenticated, getCourseDetailsWithPurchaseStatus);

// Route to get all purchased courses
router.get('',isAuthenticated, getAllPurchasedCourses);

export default router;
