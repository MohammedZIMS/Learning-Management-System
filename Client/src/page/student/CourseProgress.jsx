import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, CheckCircle2, Clock, ListVideo, ChevronLeft } from 'lucide-react';
import { 
  useGetCourseByIdQuery, 
  useGetCouseLectureModuleQuery, 
  useGetLectureByIdQuery 
} from '@/features/api/courseApi';

const CourseProgress = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { courseId, lectureId } = useParams();
  
  // API Calls
  const { data, isLoading, error } = useGetCourseByIdQuery(courseId);
  const { 
    data: moduleData, 
    isLoading: modulesLoading,
    error: modulesError 
  } = useGetCouseLectureModuleQuery(courseId);
  const { data: lectureData } = useGetLectureByIdQuery(lectureId);

  const course = data?.course;
  const lecture = lectureData?.lecture;
  const modules = moduleData?.modules || course?.modules || [];

  if (isLoading || modulesLoading) return <div>Loading...</div>;
  if (error || modulesError) return <div>Error loading course</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 mt-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{course.courseTitle}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-5 w-5" />
            <span>{course.progress}% Complete</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="default" className="gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Mark as Completed
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex gap-2"
          >
            <ChevronLeft className={`h-5 w-5 transition-transform ${isSidebarOpen ? '' : 'rotate-180'}`} />
            Syllabus
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={course.progress} className="h-3" />

      {/* Main Content */}
      <div className={`flex gap-3 transition-all duration-300`}>
        {/* Collapsible Sidebar */}
        {isSidebarOpen && (
          <div className="w-full lg:w-80 flex-shrink-0">
            <Card className="h-[calc(100vh-200px)] overflow-y-auto">
              <CardHeader className="bg-muted/50 p-4">
                <CardTitle className="flex items-center gap-2">
                  <ListVideo className="h-6 w-6" />
                  <span>Curriculum</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="space-y-2">
                    <h3 className="font-semibold text-lg">
                      Module {moduleIndex + 1}: {module.title}
                    </h3>
                    <div className="space-y-2">
                      {module.lectures.map((lecture, lectureIndex) => (
                        <div
                          key={lectureIndex}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {lecture.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                            )}
                            <div>
                              <p className="font-medium">{lecture.lectureTitle}</p>
                              <p className="text-sm text-muted-foreground">
                                {lecture.duration}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <PlayCircle className="h-4 w-4" />
                            Play
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Video Content */}
        <div className={`flex-1 ${isSidebarOpen ? 'lg:w-[calc(100%-920px)]' : 'w-full'}`}>
          <div className="space-y-6">
            <Card className="aspect-video bg-black border-0">
              <CardContent className="h-full flex flex-col items-center justify-center text-white gap-4">
                <PlayCircle className="h-12 w-12" />
                <p className="text-xl font-medium text-center">
                  {lecture?.lectureTitle || 'Select a lecture to begin'}
                </p>
                <Badge variant="secondary">Lecture Video Player</Badge>
              </CardContent>
            </Card>

            {/* Lecture Notes Section */}
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Lecture Notes</CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-muted-foreground">
                <p className="text-sm">
                  {lecture?.notes || 'No notes available for this lecture'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
