import mongoose from "mongoose";

const coursePurchaseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending",
    },
    paymentMethod: {
        type: String,
        enum: ["Credit Card", "Debit Card", "PayPal", "Bank Transfer"],
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
    },
    courseName: {
        type: String,
        required: true,
    },

},{timestamps: true});

export const CoursePurchase = mongoose.model("CoursePurchase", coursePurchaseSchema);
