import { Course } from "../Models/courseModel.js";
import { Lecture } from "../Models/lectureModel.js";
import { deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia } from "../Utils/cloudinary.js";

// Create a new course
export const createCourse = async (req, res) => {
  try {
    // Extract all required fields from the request body
    const { courseTitle, category, description } = req.body;

    // Validate that required fields are provided
    if (!courseTitle || !category) {
      return res.status(400).json({
        message: "Course title and category are required.",
      });
    }

    // Handle file upload using Multer (if a thumbnail is provided)
    let courseThumbnail = "";
    if (req.file) {
      const uploadResult = await uploadMedia(req.file.path); // Upload to Cloudinary
      courseThumbnail = uploadResult.secure_url;
    }

    // Create the new course in the database
    const course = await Course.create({
      courseTitle,
      category,
      description,
      courseThumbnail, // Use the uploaded thumbnail URL
      creator: req.id,
    });

    return res.status(201).json({
      course,
      message: "Course created successfully!",
    });

  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({
      message: "Failed to create course. Please try again.",
    });
  }
};

// Get courses created by the authenticated user
export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.id; // Ensure your authentication middleware sets this value

    // Use userId to filter courses
    const courses = await Course.find({ creator: userId });
    if (!courses) {
      return res.status(404).json({
        courses: [],
        message: "Courses not found."
      });
    }

    return res.status(200).json({ courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({
      message: "Failed to get courses. Please try again."
    });
  }
};

// Edit Course
export const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;
    const thumbnail = req.file;

    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found!"
      })
    }
    let courseThumbnail;
    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId); // delete old image
      }
      // upload a thumbnail on clourdinary
      courseThumbnail = await uploadMedia(thumbnail.path);
    }


    const updateData = { courseTitle, subTitle, description, category, courseLevel, coursePrice, courseThumbnail: courseThumbnail?.secure_url };

    course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

    return res.status(200).json({
      course,
      message: "Course updated successfully!"
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to edit course. Please try again."
    })
  }
}

// Get courses Data
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found!"
      })
    }
    return res.status(200).json({
      course
    })

  } catch (error) {
    console.error("Error fetching course:", error);
    return res.status(500).json({
      message: "Failed to get course by id. Please try again."
    })
  }
}

// create lecture Module
export const createLectureModule = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        message: "Lecture title is required"
      })
    };

    // create lecture
    const lecture = await Lecture.create({ lectureTitle });

    const course = await Course.findById(courseId);
    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res.status(201).json({
      lecture,
      message: "Lecture module created successfully!"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create lecture module. Please try again."
    })
  }
}

// Get lecture Module
export const getCouseLectureModule = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");

    if (!course) {
      return res.status(404).json({
        message: "Course not found!"
      })
    }

    return res.status(200).json({
      lectures: course.lectures
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get lecture module. Please try again."
    })
  }
}

// Edit Lecture
export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not fount!"
      })
    }

    // update Lecture
    if (lectureTitle) { lecture.lectureTitle = lectureTitle; }
    if (videoInfo.videoUrl) { lecture.videoUrl = videoInfo.videoUrl; }
    if (videoInfo.publicId) { lecture.publicId = videoInfo.publicId; }
    if (isPreviewFree) { lecture.isPreviewFree = isPreviewFree; }

    await lecture.save();

    // Ensure the course still has the lecture id if it was not aleardy added;
    const course = await Course.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    };
    return res.status(200).json({
      lecture,
      message: "Lecture updated successfully."
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to edit lectures. Please try again."
    })
  }
}

// Remove Lecture
export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);

    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not fount!"
      })
    }

    // delete the lecture from couldinary as well
    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }

    // Remove the lecture reference from the associated course
    await Course.updateOne(
      { lectures: lectureId }, // find the course that contains the lecture
      { $pull: { lectures: lectureId } } // Remove the lectures id from the lectures array
    )

    return res.status(200).json({
      message: "Lecture removed successfully."
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to edit lectures. Please try again."
    })
  }
}
