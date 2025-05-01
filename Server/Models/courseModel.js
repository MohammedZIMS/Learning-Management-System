import mongoose from "mongoose";
import slugify from "slugify";

const courseSchema = new mongoose.Schema(
  {
    courseTitle: {
      type: String,
      required: true,
      trim: true,
    },
    subTitle: String,
    description: String,
    category: {
      type: String,
      required: true,
      trim: true,
    },
    courseLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    coursePrice: {
      type: Number,
      min: 0,
    },
    courseThumbnail: String,
    enrolledStudents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    modules: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true
    }],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    ratings: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
      comment: String
    }],
    slug: {
      type: String,
      unique: true,
    },
    duration: {
      type: Number,
      min: [1, "Duration must be at least 1 hour"],
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtuals
courseSchema.virtual("averageRating").get(function() {
  return this.ratings.length 
    ? this.ratings.reduce((acc, item) => acc + item.rating, 0) / this.ratings.length
    : 0;
});

courseSchema.virtual("studentsCount").get(function() {
  return this.enrolledStudents.length;
});

// Pre-save hook for slug
courseSchema.pre("save", function(next) {
  if (!this.slug && this.courseTitle) {
    const baseSlug = slugify(this.courseTitle, { lower: true, strict: true });
    this.slug = `${baseSlug}-${Date.now()}`;
  }
  next();
});

export const Course = mongoose.model("Course", courseSchema);
