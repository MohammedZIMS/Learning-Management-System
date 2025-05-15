import express from 'express';
import { createCheckoutSession, stripeWebhook } from '../Controller/coursePurchaseController.js';
import isAuthenticated from "../Middlewares/isAuthenticated.js";

const router = express.Router();

router.post( '/checkout/create-checkout-session', isAuthenticated, createCheckoutSession);

router.post('/webhook', express.json({type: 'application/json'}), stripeWebhook);
// router.get('/course/:courseId/detail-with-status', isAuthenticated, getCoursePurchase);

export default router;
