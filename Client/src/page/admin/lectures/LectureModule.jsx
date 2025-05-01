import { Edit, Video, FileText } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

const LectureModule = ({ module, courseId, index }) => {
  const navigate = useNavigate();

  const goToUpdateModule = () => {
    navigate(`/dashboard/instructor-course/${courseId}/lecture-module/${module?._id}/lecture`);
  };

  return (
    <div className="group flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 my-2 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-4">
        {/* Icon - Modules typically don't have media type, removed video/document differentiation */}
        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>

        {/* Module Details */}
        <div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">
            Module {index + 1}: {module?.title || 'Untitled Module'}
          </h2>
        </div>
      </div>

      {/* Edit Button */}
      <button
        onClick={goToUpdateModule}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Edit module"
      >
        <Edit className="h-5 w-5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" />
      </button>
    </div>
  );
};

LectureModule.propTypes = {
  module: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
  }).isRequired,
  courseId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default LectureModule;
