import { Course } from "../Models/courseModel.js";

// Create a new course
export const createCourse = async (req, res) => {
  try {
    // Extract all required fields from the request body.
    const { courseTitle, category, description } = req.body;
    
    // Validate that required fields are provided.
    if (!courseTitle || !category) {
      return res.status(400).json({
        message: "Course title, category are required."
      });
    }

    // Use req.file for single file uploads using multer.
    const courseThumbnail = req.file ? req.file.path : req.body.thumbnail || "";


    // Create the course with all the required fields.
    const course = await Course.create({
      courseTitle,
      category,
      description,
      courseThumbnail,
      creator: req.id
    });

    return res.status(201).json({
      course,
      message: "Course created successfully!"
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({
      message: "Failed to create course. Please try again."
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
        await deleteMediaFromCloudinary(publicId); // delete image
      }
      // upload a thumbnail on clourdinary
      courseThumbnail = await uploadMedia(thumbnail.path);
    }

    // 
    const updateData = { courseTitle, subTitle, description, category, courseLevel, coursePrice, courseThumbnail: courseThumbnail?.secure_url };

    course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

    return res.status(200).json({
      course,
      message: "Course updated successfully!"
    })

  } catch (error) {
    console.error("Error edit courses:", error);
    return res.status(500).json({
      message: "Failed to edit courses. Please try again."
    });
  }
};
