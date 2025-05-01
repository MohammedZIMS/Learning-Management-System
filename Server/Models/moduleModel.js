import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Ensure that the title is required
    trim: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true, // Ensure that the course is required
  },
  lectures: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture"
  }],
  order: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual population
moduleSchema.virtual('lectureCount').get(function() {
  return this.lectures?.length || 0;
});

export const Module = mongoose.model("Module", moduleSchema);
