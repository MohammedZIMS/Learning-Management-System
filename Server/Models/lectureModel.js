import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    lectureTitle: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["video", "document"], // Defines allowed types
    //   required: true,
    },
    mediaUrl: {
      type: String,
    //   required: true, // Ensures a file is always uploaded
    },
    publicId: {
      type: String, // Cloudinary or other storage ID
    },
    isPreviewFree: {
      type: Boolean,
      default: false, // Defaults to not being free preview
    },
  },
  { timestamps: true }
);

export const Lecture = mongoose.model("Lecture", lectureSchema);
