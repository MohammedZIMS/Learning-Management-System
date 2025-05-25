import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetCouseLectureModuleQuery } from '@/features/api/courseApi';
import { useCompleteCourseMutation, useGetCourseProgressQuery, useInCompleteCourseMutation, useUpdateLectureProgressMutation } from '@/features/api/courseProgressApi';
import { CheckCircle2, CirclePlay, ChevronDown, CheckCircle, Clock, BookOpen, Video } from 'lucide-react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import CourseRatings from '@/components/CourseRatings';
import axios from 'axios';

const CourseProgress = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState({});
  const [currentLecture, setCurrentLecture] = useState(null);

  const [searchParams] =useSearchParams();
  const sessionId = searchParams.get('sessionId');

  useEffect(() => {
    const confirmPurchase = async () => {
      if (sessionId){
        confirmPurchase();
      }
    }
  }, [sessionId])

  // Data fetching
  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);
  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [completeCourse] = useCompleteCourseMutation();
  const [inCompleteCourse] = useInCompleteCourseMutation();
  const { data: moduleData, isLoading: modulesLoading } = useGetCouseLectureModuleQuery(courseId);

  useEffect(() => {
    if (data?.data?.Completed) {
      toast.success("Course completed successfully!");
    }
  }, [data?.data?.Completed]);

  if (isLoading || modulesLoading) return <div className="text-center mt-20">Loading course...</div>;
  if (isError || !data?.data) return <div className="text-center mt-20 text-red-500">Course not found.</div>;

  const { courseDetails, progress, Completed: completed } = data.data;
  const modules = moduleData?.modules || [];
  const totalLectures = modules.reduce((acc, m) => acc + (m.lectures?.length || 0), 0);

  // Helper functions
  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
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
    try {
      await completeCourse(courseId).unwrap();
      toast.success("Course marked as completed!");
    } catch (error) {
      toast.error("Failed to complete course");
    }
  };

  const handleInCompleteCourse = async () => {
    try {
      await inCompleteCourse(courseId).unwrap();
      toast.success("Course marked as incomplete");
    } catch (error) {
      toast.error("Failed to update course status");
    }
  };

  const current = currentLecture || modules[0]?.lectures[0];
  const lectureIndex = modules.flatMap(m => m.lectures).findIndex(l => l._id === current?._id);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Course Header */}
      <div className="mb-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {courseDetails.courseTitle}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <BookOpen size={18} />
                <span>{modules.length} Modules</span>
              </div>
              <div className="flex items-center gap-2">
                <Video size={18} />
                <span>{totalLectures} Lectures</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{courseDetails.duration}h Total</span>
              </div> */}
            </div>
          </div>
          
          <Button
            onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
            variant={completed ? "outline" : "default"}
            className="gap-2 shadow-lg hover:shadow-xl"
          >
            {completed ? (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                <span>Mark Complete</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        {/* Video Player Section */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
            <video
              src={current?.mediaUrl}
              controls
              className="w-full aspect-video object-cover"
              onPlay={() => handleLectureProgress(current?._id)}
            />
            <div className="p-6 bg-white dark:bg-gray-800">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  {current?.lectureTitle || "Select a lecture"}
                </h3>
                <Badge variant="outline">
                  Lecture {lectureIndex + 1}/{modules.flatMap(m => m.lectures).length}
                </Badge>
              </div>
            </div>
          </div>

          {/* Course Ratings */}
          <div className="mt-8">
            <CourseRatings courseId={courseId} />
          </div>
        </div>

        {/* Curriculum Sidebar */}
        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-100px)] lg:overflow-y-auto">
          <Card className="shadow-xl">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Course Content</h2>
              
              {/* Modules Accordion */}
              <div className="space-y-3">
                {modules.map((module) => (
                  <div key={module._id} className="border rounded-lg overflow-hidden dark:border-gray-700">
                    <button
                      onClick={() => toggleModule(module._id)}
                      className="w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center"
                    >
                      <div className="text-left">
                        <h3 className="font-semibold">{module.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {module.lectures?.length} lectures 
                        </p>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${
                        expandedModules[module._id] ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {/* Lectures List */}
                    {expandedModules[module._id] && (
                      <div className="border-t dark:border-gray-700">
                        {module.lectures?.map((lecture) => (
                          <div
                            key={lecture._id}
                            onClick={() => handleSelectLecture(lecture)}
                            className={`p-4 cursor-pointer transition-all ${
                              lecture._id === current?._id 
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {isLectureCompleted(lecture._id) ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                ) : (
                                  <CirclePlay className="h-5 w-5 text-muted-foreground shrink-0" />
                                )}
                                <span className="text-sm">
                                  {lecture.lectureTitle}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                play
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
