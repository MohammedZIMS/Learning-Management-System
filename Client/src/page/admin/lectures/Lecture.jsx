import React from 'react';
import { Edit, Video, FileText } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

const Lecture = ({ lecture, courseId, moduleId, index }) => {
  const navigate = useNavigate();

  const goToUpdateLecture = () => {
    navigate(
      `/dashboard/courses/${courseId}/modules/${moduleId}/lectures/${lecture?._id}`
    );
  };

  return (
    <div className="group flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 my-2 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-4">
        {/* Icon based on lecture type */}
        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          {lecture?.videoUrl ? (
            <Video className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          ) : (
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          )}
        </div>

        {/* Lecture Details */}
        <div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">
            Lecture {index + 1}: {lecture?.lectureTitle || 'Untitled Lecture'}
          </h2>
        </div>
      </div>

      {/* Edit Button */}
      <button
        onClick={goToUpdateLecture}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Edit lecture"
      >
        <Edit className="h-5 w-5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" />
      </button>
    </div>
  );
};

Lecture.propTypes = {
  lecture: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    lectureTitle: PropTypes.string,
    videoUrl: PropTypes.string,
  }).isRequired,
  courseId: PropTypes.string.isRequired,
  moduleId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default Lecture;
