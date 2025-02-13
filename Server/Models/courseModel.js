import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseTitle: { // Fixed typo from 'curseTitle'
        type: String,
        required: [true, "Course title is required"],
    },
    subTitle: {
        type: String,
        required: [true, "Subtitle is required"],     
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: ["Web Development", "Mobile Development", "Data Science", "Design", "Business"]
    },
    courseLevel: {
        type: String,
        required: true,
        enum: ["Beginner", "Intermediate", "Advanced"], // Fixed typo
        default: "Beginner"
    },
    coursePrice: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    courseThumbnail: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    lectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture'
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String
    }],
    slug: {
        type: String,
        unique: true,
        required: true
    },
    duration: {
        type: Number,
        required: [true, "Duration is required"],
        min: [1, "Duration must be at least 1 hour"]
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true } 
});

// Virtual for average rating
courseSchema.virtual('averageRating').get(function() {
    if (this.ratings.length === 0) return 0;
    const total = this.ratings.reduce((acc, item) => acc + item.rating, 0);
    return total / this.ratings.length;
});

// Virtual for students count
courseSchema.virtual('studentsCount').get(function() {
    return this.enrolledStudents.length;
});

export const Course = mongoose.model("Course", courseSchema);