import mongoose from "mongoose";
import slugify from "slugify";

const courseSchema = new mongoose.Schema(
  {
    courseTitle: {
      type: String,
      required: true,
      trim: true,
    },
    subTitle: {
      type: String,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    courseLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    coursePrice: {
      type: Number,
      min: 0,
    },
    courseThumbnail: {
      type: String,
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    // The creator of the course (usually an instructor)
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isPublished: {
      type: Boolean,
      default: false,
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
    // New slug field with unique constraint.
    slug: {
      type: String,
      unique: true,
      // required: true,
    },
    duration: {
      type: Number,
      min: [1, "Duration must be at least 1 hour"],
    }
  },
  { timestamps: true }
);
// Virtual for average rating
courseSchema.virtual('averageRating').get(function () {
  if (this.ratings.length === 0) return 0;
  const total = this.ratings.reduce((acc, item) => acc + item.rating, 0);
  return total / this.ratings.length;
});

// Virtual for students count
courseSchema.virtual('studentsCount').get(function () {
  return this.enrolledStudents.length;
});

// Pre-save hook to generate a slug if not provided.
courseSchema.pre("save", function (next) {
  if (!this.slug && this.courseTitle) {
    const baseSlug = slugify(this.courseTitle, { lower: true, strict: true });
    // Append a timestamp to ensure uniqueness.
    this.slug = `${baseSlug}-${Date.now()}`;
  }
  next();
});

export const Course = mongoose.model("Course", courseSchema);
