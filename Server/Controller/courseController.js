import { Course } from "../Models/courseModel.js";
import { Lecture } from "../Models/lectureModel.js";
import { Module } from "../Models/moduleModel.js";
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


// Create Lecture Module
export const createLectureModule = async (req, res) => {
  try {
    const { title } = req.body;
    const { courseId } = req.params;

    if (!title || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Module title and course ID are required"
      });
    }

    // Create new module
    const newModule = await Module.create({
      title,
      course: courseId,
      order: await Module.countDocuments({ course: courseId }) + 1
    });

    // Add module to course
    await Course.findByIdAndUpdate(
      courseId,
      { $push: { modules: newModule._id } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      module: newModule,
      message: "Lecture module created successfully!"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create lecture module"
    });
  }
}


// Get Lecture Modules by Course ID
export const getCouseLectureModule = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findById(courseId)
      .populate({
        path: "modules",
        populate: {
          path: "lectures",
          model: "Lecture"
        }
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found!"
      });
    }

    return res.status(200).json({
      success: true,
      modules: course.modules
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get lecture modules"
    });
  }
}


// Create Lecture within Module
export const createLecture = async (req, res) => {
  try {
    const { lectureTitle, moduleId } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId || !moduleId) {
      return res.status(400).json({
        success: false,
        message: "Lecture title, course ID, and module ID are required"
      });
    }

    // Create lecture with module reference
    const lecture = await Lecture.create({
      lectureTitle,
      module: moduleId
    });

    // Add lecture to module
    await Module.findByIdAndUpdate(
      moduleId,
      { $push: { lectures: lecture._id } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      lecture,
      message: "Lecture created successfully!"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create lecture"
    });
  }
}

// Get Lectures by Module ID
export const getLecturesByModuleId = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const module = await Module.findById(moduleId)
      .populate('lectures');

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found!"
      });
    }

    return res.status(200).json({
      success: true,
      lectures: module.lectures
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get lectures"
    });
  }
}

// Edit Lecture
export const editLecture = async (req, res) => {
  try {

    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, moduleId, lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId).populate('module');

    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!"
      });
    }

    // update lecture details
    if (lectureTitle) {
      lecture.lectureTitle = lectureTitle;
    }
    if (videoInfo) {
      lecture.mediaUrl = videoInfo.mediaUrl;
      lecture.publicId = videoInfo.publicId;
    }
    if (isPreviewFree !== undefined) {
      lecture.isPreviewFree = isPreviewFree;
    }
    if (lecture.module._id.toString() !== moduleId || lecture.module.course.toString() !== courseId) {  
      return res.status(400).json({
        message: "Lecture does not belong to this module or course."
      });
    }

    // Save the updated lecture
    await lecture.save();

    //Ensure the lecture is added to the module
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({
        message: "Module not found!"
      });
    }
    if (!module.lectures.includes(lecture._id)) {
      module.lectures.push(lecture._id);
      await module.save();
    }

    res.status(200).json({
      success: true,
      lecture,
      message: "Lecture updated successfully!",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to edit lecture. Please try again."
    });
  }
};

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
    await Module.updateMany(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } }
    );

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

// Get Lecture By ID
export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    
    
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found"
      });
    }

    res.status(200).json({
      success: true,
      lecture
    });
  } catch (error) {
    console.log("Error fetching lecture by ID:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lecture"
    });
  }
};
