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
  const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

  try {
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(req.body, sig, secret);
  } catch (error) {
    console.error("⚠️ Webhook signature verification failed.", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    console.log("✅ Checkout session completed");

    try {
      const session = event.data.object;

      const purchase = await CoursePurchase.findOne({ transactionId: session.id }).populate({
        path: "courseId",
        populate: {
          path: "modules",
          populate: {
            path: "lectures"
          }
        }
      });

      if (!purchase) {
        console.error("❌ Purchase not found for transaction:", session.id);
        return res.status(404).send();
      }

      purchase.amount = session.amount_total / 100;
      purchase.paymentStatus = "Completed";

      if (purchase.courseId?.modules?.length > 0) {
        const allLectureIds = purchase.courseId.modules.flatMap(m =>
          m.lectures.map(l => l._id)
        );
        await Lecture.updateMany(
          { _id: { $in: allLectureIds } },
          { $set: { isPreviewFree: true } }
        );
      }

      await purchase.save();

      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } },
        { new: true }
      );

      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } },
        { new: true }
      );

      console.log("✅ Purchase processed successfully");
    } catch (error) {
      console.error("🔥 Error handling event:", error);
      return res.status(500).send("Internal Server Error");
    }
  }

  res.status(200).send(); // Must always return a 200 to Stripe
};

// ✅ Controller to finalize purchase after success_url redirect
// export const confirmPurchaseAfterSuccessRedirect = async (req, res) => {
//   try {
//     const { sessionId } = req.query;

//     if (!sessionId) {
//       return res.status(400).json({ success: false, message: "Missing sessionId" });
//     }

//     const session = await stripe.checkout.sessions.retrieve(sessionId);

//     const purchase = await CoursePurchase.findOne({ transactionId: sessionId }).populate({
//       path: "courseId",
//       populate: {
//         path: "modules",
//         populate: {
//           path: "lectures"
//         }
//       }
//     });

//     if (!purchase) {
//       return res.status(404).json({ success: false, message: "Purchase not found" });
//     }

//     // Finalize the purchase
//     purchase.amount = session.amount_total / 100;
//     purchase.paymentStatus = "Completed";

//     if (purchase.courseId?.modules?.length > 0) {
//       const allLectureIds = purchase.courseId.modules.flatMap(m =>
//         m.lectures.map(l => l._id)
//       );
//       await Lecture.updateMany(
//         { _id: { $in: allLectureIds } },
//         { $set: { isPreviewFree: true } }
//       );
//     }

//     await purchase.save();

//     // Enroll user
//     await User.findByIdAndUpdate(
//       purchase.userId,
//       { $addToSet: { enrolledCourses: purchase.courseId._id } },
//       { new: true }
//     );

//     await Course.findByIdAndUpdate(
//       purchase.courseId._id,
//       { $addToSet: { enrolledStudents: purchase.userId } },
//       { new: true }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Course purchase finalized.",
//     });

//   } catch (error) {
//     console.error("Error confirming purchase:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };


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

