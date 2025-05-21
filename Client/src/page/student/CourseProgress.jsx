import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  useGetCouseLectureModuleQuery
} from '@/features/api/courseApi';
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation
} from '@/features/api/courseProgressApi';
import {
  CheckCircle2,
  CirclePlay,
  Clock,
  ChevronDown,
  CheckCircle
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CourseProgress = () => {
  // Router hooks
  const { courseId } = useParams();
  const navigate = useNavigate();

  // State management
  const [expandedModules, setExpandedModules] = useState({});
  const [currentLecture, setCurrentLecture] = useState(null);

  // Data fetching hooks
  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);
  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [completeCourse, { data: markCompleteData, isSuccess: completedSuccess }] = useCompleteCourseMutation();
  const [inCompleteCourse, { data: markIncompleteData, isSuccess: incompletedSuccess }] = useInCompleteCourseMutation();
  const {
    data: moduleData,
    isLoading: modulesLoading,
    error: modulesError
  } = useGetCouseLectureModuleQuery(courseId);

  // Effect for handling completion status changes
  useEffect(() => {
    if (completedSuccess) {
      refetch();
      toast.success(markCompleteData.message);
    }
    if (incompletedSuccess) {
      refetch();
      toast.success(markIncompleteData.message);
    }
  }, [completedSuccess, incompletedSuccess]);

  // Loading and error states
  if (isLoading || modulesLoading) return <div className="text-center mt-20">Loading course...</div>;
  if (isError || modulesError || !data?.data) return <div className="text-center mt-20 text-red-500">Course not found.</div>;

  // Extracted data
  const courseDetails = data.data.courseDetails;
  const progress = data.data.progress || [];
  const completed = data.data.Completed || false;
  const modules = moduleData?.modules || [];

  // Helper functions
  const toggleModule = (index) => {
    setExpandedModules(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const isLectureCompleted = (lectureId) => {
    return progress.some(prog => prog.lectureId === lectureId && prog.viewed);
  };

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    handleLectureProgress(lecture._id);
  };

  const handleCompleteCourse = async () => {
    await completeCourse(courseId);
  };

  const handleInCompleteCourse = async () => {
    await inCompleteCourse(courseId);
  };

  // Derived values
  const allLectures = modules.flatMap(mod => mod.lectures || []);
  const current = currentLecture || modules?.[0]?.lectures?.[0];
  const lectureIndex = allLectures.findIndex((lec) => lec._id === current?._id);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 mt-20">
      {/* Course Header Section */}
      <div className="grid gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            {courseDetails.courseTitle}
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>{courseDetails.duration || 0}h total duration</span>
            </div>
            <Badge variant="secondary" className="capitalize shadow-sm">
              {courseDetails.courseLevel || "Beginner"}
            </Badge>
          </div>
        </div>
        
        {/* Completion Status Button */}
        <div className="flex justify-end">
          <Button
            onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
            variant={completed ? "outline" : "default"}
            className="gap-2 shadow-md hover:shadow-lg transition-shadow"
          >
            {completed ? (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>Course Completed</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                <span>Mark as Completed</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Video Player Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-xl border-0">
            <div className="aspect-video bg-gray-900 rounded-t-lg overflow-hidden">
              <video
                src={current?.mediaUrl}
                controls
                className="w-full h-full object-cover"
                onPlay={() => handleLectureProgress(current?._id)}
              />
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-semibold">
                  {current?.lectureTitle || "Select a lecture"}
                </h3>
                <Badge variant="outline" className="text-sm">
                  Lecture {lectureIndex + 1} of {allLectures.length}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {current?.description || "No description available"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Curriculum Sidebar */}
        <div className="lg:col-span-1">
          <Card className="shadow-xl border-0 sticky top-28 max-h-[calc(100vh-200px)] overflow-y-auto">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Course Content</h2>
              
              {/* Modules Accordion */}
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <Card key={index} className="overflow-hidden">
                    <button
                      onClick={() => toggleModule(index)}
                      className="w-full p-4 hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <h3 className="font-semibold">{module.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {module.lectures?.length || 0} lectures
                          </p>
                        </div>
                        <ChevronDown className={`h-5 w-5 transition-transform ${
                          expandedModules[index] ? 'rotate-180' : ''
                        }`} />
                      </div>
                    </button>

                    {/* Lectures List */}
                    {expandedModules[index] && (
                      <div className="border-t">
                        {module.lectures?.map((lecture, lIdx) => (
                          <div
                            key={lIdx}
                            onClick={() => handleSelectLecture(lecture)}
                            className={`p-4 cursor-pointer transition-colors ${
                              lecture._id === current?._id 
                                ? 'bg-primary/10 border-l-4 border-primary'
                                : 'hover:bg-accent'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {isLectureCompleted(lecture._id) ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                  <CirclePlay className="h-5 w-5 text-muted-foreground" />
                                )}
                                <span className="text-sm">
                                  {lecture.lectureTitle}
                                </span>
                              </div>
                              {lecture._id === current?._id && (
                                <Badge variant="secondary" className="animate-pulse">
                                  Playing
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
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
