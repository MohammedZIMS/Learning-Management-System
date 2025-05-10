import Stripe from 'stripe';
import Course from '../Models/courseModel.js';
import { CoursePurchase } from '../Models/puchaseCourseModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    
    try {
        const  userId  = req.id; // Assuming you have user ID in req.id
        const { courseId, courseName, amount } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Create a new course purchase record
        const newPurchase = new CoursePurchase({
            userId,
            courseId,
            amount:course.coursePrice,
            paymentStatus: 'Pending',
            paymentMethod: 'Credit Card', // Assuming credit card for now
            transactionId: '', // This will be updated after payment
            courseName,
        });
    
        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: courseName,
                        },
                        unit_amount: amount * 100, // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/course-progress/${courseId}`,
            cancel_url: `${process.env.CLIENT_URL}/course-detail/${courseId}`,
            metadata: {
                userId: userId,
                courseId: courseId,
                purchaseId: newPurchase._id.toString(), // Store the purchase ID in metadata
            },
            shipping_address_collection: {
                allowed_countries: ['BAN', 'US', 'CA', 'GB', 'AU', 'UK', 'PK'],
            },
        });

        if (!session.url) {
            return res.status(400).json({ success: false, message: 'Failed to create checkout session' });          
        }

        // Save the purchase record to the database
        newPurchase.transactionId = session.id; // Update with the Stripe session ID
        await newPurchase.save();

        
        return res.status(200).json({
            success: true,
            message: 'Checkout session created successfully',
            url: session.url // Redirect URL for the user
        });

    } catch (error) {
        console.log('Error creating checkout session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
