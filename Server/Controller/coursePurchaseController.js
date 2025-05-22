import Stripe from 'stripe';
import { Course } from '../Models/courseModel.js';
import { CoursePurchase } from '../Models/puchaseCourseModel.js';
import { User } from '../Models/userModel.js';
import { Module } from '../Models/moduleModel.js';
import { Lecture } from '../Models/lectureModel.js'; // Add Lecture model import

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['courseId', 'courseName', 'amount'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    const userId = req.id;
    const { courseId, courseName, amount } = req.body;

    // Validate amount
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Create purchase record
    const newPurchase = new CoursePurchase({
      userId,
      courseId,
      amount: numericAmount,
      paymentStatus: 'Pending',
      paymentMethod: 'Credit Card', // Default payment method
      courseName,
    });



    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'bdt',
          product_data: { name: courseName },
          unit_amount: Math.round(numericAmount * 100), // Ensure integer value
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `http://localhost:5173/course-progress/${courseId}`,
      cancel_url: `http://localhost:5173/course-detail/${courseId}`,
      metadata: {
        userId: userId.toString(),
        courseId: courseId.toString(),
        purchaseId: newPurchase._id.toString(),
      },
    });

    newPurchase.transactionId = session.id;
    await newPurchase.save();

    // Update purchase with session ID
    await CoursePurchase.findByIdAndUpdate(newPurchase._id, {
      transactionId: session.id
    });

    res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id
    });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({
      error: error.message || 'Payment processing failed'
    });
  }
};


export const stripeWebhook = async (req, res) => {
  let event;

  try {
    const playloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

    const header = stripe.webhooks.generateTestHeaderString({
      payload: req.body,
      secret: secret,
    });

    event = stripe.webhooks.constructEvent(playloadString, header, secret);
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    console.log("Checkout session completed");

    try {
      const session = event.data.object;

      const purchase = await CoursePurchase.findOne({
        transactionId: session.id,
      }).populate({
        path: "courseId",
        populate: {
          path: "modules",
          populate: {
            path: "lectures"
          }
        }
      });

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      // Update amount
      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }

      purchase.paymentStatus = "Completed";

      // Unlock all lectures
      if (purchase.courseId?.modules?.length > 0) {
        const allLectureIds = purchase.courseId.modules.flatMap(m => m.lectures.map(l => l._id));
        await Lecture.updateMany(
          { _id: { $in: allLectureIds } },
          { $set: { isPreviewFree: true } }
        );
      }

      await purchase.save();

      // Add course to user's enrolled list
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } },
        { new: true }
      );

      // Add user to course's student list
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } },
        { new: true }
      );

    } catch (error) {
      console.error("Error handling event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  res.status(200).send();
};


export const getCourseDetailsWithPurchaseStatus = async (req, res) => {
  const userId = req.id;
  const courseId = req.params.courseId;

  try {
    // Find the course
    const course = await Course.findById(courseId).populate({ path: 'creator' }).populate({ path: 'modules', populate: { path: 'lectures' } });

    // Check if the course exists
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the user has purchased the course
    const purchase = await CoursePurchase.findOne({
      userId,
      courseId,
      paymentStatus: 'Completed',
    });
    console.log('Purchase:', purchase);


    return res.status(200).json({
      course,
      purchase: !!purchase, // true if purchase exists, false otherwise
    });
  } catch (error) {
    console.error('Error fetching course details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const getAllPurchasedCourses = async (_, res) => {

  try {
    // Find all purchased courses for the user
    const purchasedCourse = await CoursePurchase.find({ paymentStatus: 'Completed' })
      .populate('courseId');

    if (!purchasedCourse || purchasedCourse.length === 0) {
      return res.status(404).json({
        purchasedCourse: [],
      });
    }

    return res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    console.error('Error fetching purchased courses:', error);
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
