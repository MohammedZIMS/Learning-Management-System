import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  useGetCouseLectureModuleQuery
} from '@/features/api/courseApi';
import {
  useGetCourseProgressQuery
} from '@/features/api/courseProgressApi';
import {
  CheckCircle2,
  CirclePlay,
  Clock,
  ChevronDown
} from 'lucide-react';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CourseProgress = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState({});
  const [currentLecture, setCurrentLecture] = useState(null);

  // Fetch course progress and module structure
  const { data, isLoading, isError } = useGetCourseProgressQuery(courseId);
  const {
    data: moduleData,
    isLoading: modulesLoading,
    error: modulesError
  } = useGetCouseLectureModuleQuery(courseId);

  // Show loading and error states
  if (isLoading || modulesLoading) return <div className="text-center mt-20">Loading course...</div>;
  if (isError || modulesError || !data?.data) return <div className="text-center mt-20 text-red-500">Course not found.</div>;

  const courseDetails = data.data.courseDetails;
  const progress = data.data.progress || [];
  const completed = data.data.Completed || false;
  const modules = moduleData?.modules || [];

  const initialLecture = currentLecture || modules?.[0]?.lectures?.[0];

  const toggleModule = (index) => {
    setExpandedModules(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const isLectureCompleted = (lectureId) => {
    return progress.some(prog => prog.lectureId === lectureId && prog.viewed);
  };

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    // TODO: call API to update progress if needed
  };

  const allLectures = modules.flatMap(mod => mod.lectures || []);
  const current = currentLecture || initialLecture;
  const lectureIndex = allLectures.findIndex((lec) => lec._id === current?._id);

  return (
    <div className='max-w-7xl mx-auto py-8 px-4 md:px-8 mt-20'>
      {/* Course Header */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{courseDetails.courseTitle}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{courseDetails.duration || 0}h total length</span>
            </div>
            <Badge variant="outline" className="capitalize">
              {courseDetails.courseLevel || "Beginner"}
            </Badge>
          </div>
        </div>
        <Button className="mt-4 md:mt-0">
          <CheckCircle2 className="h-5 w-5 mr-2" />
          Mark as Completed
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left - Video Section */}
        <div className="lg:w-[65%]">
          <Card className="shadow-lg">
            <div className="aspect-video bg-black">
              <video
              src={currentLecture?.mediaUrl || initialLecture.mediaUrl}
              controls
              className="w-full h-auto md:rounded-lg"
              onPlay={() =>
                handleLectureProgress(currentLecture?._id || initialLecture._id)
              }
            />
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                Lecture {lectureIndex + 1}: {current?.lectureTitle || "Untitled"}
              </h3>
            </CardContent>
          </Card>
        </div>

        {/* Right - Sidebar */}
        <div className="lg:w-[34.5%] h-[calc(100vh-200px)] overflow-y-auto">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h2 className='text-2xl font-bold mb-6'>Course Curriculum</h2>
              <div className='space-y-4'>
                {modules.map((module, index) => (
                  <Card key={index} className='hover:shadow-md transition-shadow'>
                    <div
                      className="cursor-pointer"
                      onClick={() => toggleModule(index)}
                    >
                      <CardHeader className="flex flex-row items-center justify-between">
                        <h2 className='text-lg font-semibold'>{module.title}</h2>
                        <ChevronDown className={`h-5 w-5 transition-transform ${expandedModules[index] ? 'rotate-180' : ''}`} />
                      </CardHeader>
                    </div>

                    {expandedModules[index] && (
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {module.lectures?.map((lecture, lIdx) => (
                            <div
                              key={lIdx}
                              className={`flex items-center justify-between p-3 hover:bg-accent rounded-lg cursor-pointer ${lecture._id === currentLecture?._id ? "bg-gray-200 " : "dark:dark:bg-gray-800"} `}
                              onClick={() => handleSelectLecture(lecture)}
                            >
                              <div className="flex items-center gap-2">
                                {isLectureCompleted(lecture._id) ? (
                                  <CheckCircle2 size={20} className='text-green-500' />
                                ) : (
                                  <CirclePlay size={20} className='text-gray-500' />
                                )}
                                <span className="text-sm">{lecture.lectureTitle}</span>
                              </div>
                              {isLectureCompleted(lecture._id) && (
                                <Badge variant="outline" className="bg-green-200 text-green-600">
                                  Completed
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
