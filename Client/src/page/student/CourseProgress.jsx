import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetCouseLectureModuleQuery } from '@/features/api/courseApi';
import { useGetCourseDetailsWithPurchaseStatusQuery } from '@/features/api/purchaseApi';
import { CheckCircle2, CirclePlay, Clock, Lock, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CourseProgress = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState({});

  // API hooks
  const { data, isLoading, isError } = useGetCourseDetailsWithPurchaseStatusQuery(courseId || '');
  const { 
    data: moduleData, 
    isLoading: modulesLoading, 
    error: modulesError 
  } = useGetCouseLectureModuleQuery(courseId || '');

  // Destructure data
  const { course, purchasedCourse } = data || {};
  const modules = moduleData?.modules || course?.modules || [];
  const totalLectures = modules.reduce((acc, m) => acc + (m.lectures?.length || 0), 0);

  const toggleModule = (index) => {
    setExpandedModules(prev => ({ ...prev, [index]: !prev[index] }));
  };

  if (isLoading || modulesLoading) return <div className="text-center mt-20">Loading course...</div>;
  if (isError || modulesError) return <div className="text-center mt-20 text-red-500">Course not found.</div>;

  return (
    <div className='max-w-7xl mx-auto py-8 px-4 md:px-8 mt-20'>
      {/* Course Header */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{course?.courseTitle}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{course?.duration || 0}h total length</span>
            </div>
            <Badge variant="outline" className="capitalize">
              {course?.courseLevel}
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
        {/* Video Section - 65% width */}
        <div className="lg:w-[65%]">
          <Card className="shadow-lg">
            <div className="aspect-video bg-black">
              <video className="w-full h-full object-cover rounded-t-lg" controls>
                <source src={course?.previewVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Current Lecture</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => navigate(`/learn/${courseId}`)}
                >
                  Continue Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Content Sidebar - 34.5% width with scroll */}
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
                        <ChevronDown className={`h-5 w-5 transform transition-transform ${
                          expandedModules[index] ? 'rotate-180' : ''
                        }`} />
                      </CardHeader>
                    </div>
                    
                    {expandedModules[index] && (
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {module.lectures?.map((lecture, lIdx) => (
                            <div 
                              key={lIdx} 
                              className="flex items-center justify-between p-3 hover:bg-accent rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                {lecture.isPreviewFree || purchasedCourse ? (
                                  <CirclePlay className="h-5 w-5 text-primary" />
                                ) : (
                                  <Lock className="h-5 w-5 text-muted-foreground" />
                                )}
                                <span className="font-medium">{lecture.lectureTitle}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">
                                  {lecture.duration || 'N/A'}
                                </span>
                                <Badge variant="secondary">Completed</Badge>
                              </div>
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
