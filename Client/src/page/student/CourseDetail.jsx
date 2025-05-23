import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BadgeInfo, Clock, Star, Users, PlayCircle, Lock, ChevronDown } from 'lucide-react';
import ReactPlayer from 'react-player';
import BuyCourseButton from '@/components/BysCourseButton';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetCouseLectureModuleQuery } from '@/features/api/courseApi';
import { useGetCourseDetailsWithPurchaseStatusQuery } from '@/features/api/purchaseApi';
import { Button } from '@/components/ui/button';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState({});

  const { data, isLoading, isError } = useGetCourseDetailsWithPurchaseStatusQuery(courseId);
  const { data: moduleData, isLoading: modulesLoading, error: modulesError } = useGetCouseLectureModuleQuery(courseId);

  if (isLoading || modulesLoading) return <p className="text-center mt-20">Loading course...</p>;
  if (isError || modulesError || !data?.course) return <p className="text-center mt-20 text-red-500">Course not found.</p>;

  const { course, purchase } = data;
  const modules = moduleData?.modules || course.modules || [];
  const totalLectures = modules.reduce((acc, m) => acc + (m.lectures?.length || 0), 0);

  // Fixed module toggle using module IDs instead of indexes
  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  return (
    <div className='mt-20 space-y-5 dark:bg-slate-900 min-h-screen'>
      {/* Header with dark mode support */}
      <div className='bg-gradient-to-r from-[#2D2F31] to-[#3E4042] dark:bg-slate-800 text-white p-5 rounded-lg shadow-lg'>
        <div className='max-w-7xl mx-auto py-8 px-4 md:px-8'>
          <h1 className='text-3xl md:text-4xl font-bold dark:text-white'>{course.courseTitle}</h1>
          <p className="text-base md:text-lg text-gray-300 dark:text-slate-400">{course.subTitle}</p>
          <p className='dark:text-slate-300'>
            Created by <span className='text-[#C0C4FC] underline italic'>{course.creator?.name || "ZIMS Academy"}</span>
          </p>
        </div>

        {/* Meta Info with dark mode */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-wrap items-center gap-4 text-sm text-gray-300 dark:text-slate-400 mt-4">
          {/* ... meta items ... */}
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col lg:flex-row gap-8'>
        {/* Left - Course Content */}
        <div className='flex-1'>
          {/* Description */}
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4 dark:text-white'>Course Description</h2>
            <p className='text-base md:text-lg text-gray-700 dark:text-slate-300'>{course.description}</p>
          </section>

          {/* Modules with dark mode support */}
          <section>
            <h2 className='text-2xl font-bold mb-4 dark:text-white'>Course Content</h2>
            <Card className='dark:bg-slate-800 dark:border-slate-700'>
              <CardHeader className='pb-0 dark:bg-slate-800'>
                <div className='flex justify-between items-center dark:text-slate-300'>
                  <CardDescription className='dark:text-slate-400'>
                    {modules.length} modules • {totalLectures} lectures
                  </CardDescription>
                  <span className='text-sm text-gray-500 dark:text-slate-400'>{course.duration || 0} total hours</span>
                </div>
              </CardHeader>
              <CardContent className='p-0 dark:bg-slate-800'>
                {modules.map((module, index) => (
                  <div key={module._id} className='border-b dark:border-slate-700'>
                    <div 
                      className='p-4 bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer transition-colors'
                      onClick={() => toggleModule(module._id)}
                    >
                      <div className='flex justify-between items-center'>
                        <h3 className='font-semibold dark:text-slate-300'>
                          Module {index + 1}: {module.title}
                        </h3>
                        <ChevronDown className={`h-5 w-5 transition-transform ${
                          expandedModules[module._id] ? 'rotate-180' : ''
                        } dark:text-slate-300`} />
                      </div>
                    </div>
                    {expandedModules[module._id] && (
                      <div className='divide-y dark:divide-slate-700'>
                        {(module.lectures || []).map((lecture) => (
                          <div 
                            key={lecture._id}
                            className='p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors'
                          >
                            <div className='flex items-center gap-3'>
                              {lecture.isPreviewFree || purchase ? (
                                <PlayCircle size={18} className='text-green-500 dark:text-green-400' />
                              ) : (
                                <Lock size={18} className='text-gray-400 dark:text-slate-500' />
                              )}
                              <span className='text-sm md:text-base dark:text-slate-300'>
                                {lecture.lectureTitle}
                              </span>
                            </div>
                            <span className='text-sm text-gray-500 dark:text-slate-400'>
                              {lecture.duration || "N/A"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Right - Sidebar with dark mode */}
        <div className='lg:w-80 xl:w-96 flex-shrink-0'>
          <Card className='sticky top-24 shadow-xl dark:bg-slate-800 dark:border-slate-700'>
            <div className='aspect-video'>
              <ReactPlayer
                url={course.modules[0]?.lectures[0].mediaUrl || course.courseVideoUrl}
                width="100%"
                height="100%"
                controls
                light={course.courseThumbnail}
                playIcon={<PlayCircle className='text-white dark:text-slate-300 w-16 h-16' />}
              />
            </div>
            <CardContent className='p-6 dark:bg-slate-800'>
              <div className='flex justify-between items-start mb-4'>
                <h3 className='text-xl font-bold dark:text-white'>
                  ${course.coursePrice?.toFixed(2) || 0}
                </h3>
              </div>

              {/* Purchase buttons with dark mode */}
              {purchase ? (
                <>
                  <Button 
                    className='w-full dark:bg-blue-600 dark:hover:bg-blue-700'
                    onClick={() => navigate(`/course-progress/${courseId}`)}
                  >
                    Continue Course
                  </Button>
                  <Button 
                    variant='outline' 
                    className='w-full mt-2 dark:border-slate-600 dark:text-slate-300'
                    onClick={() => navigate(-1)}
                  >
                    Back to Home
                  </Button>
                </>
              ) : (
                <>
                  <BuyCourseButton
                    courseId={course._id}
                    courseName={course.courseTitle}
                    amount={course.coursePrice}
                  />
                  <Button 
                    variant='outline' 
                    className='w-full mt-2 dark:border-slate-600 dark:text-slate-300'
                  >
                    Add to Cart
                  </Button>
                </>
              )}

              {/* Course info with dark mode */}
              <div className='text-sm mt-6 space-y-3 dark:text-slate-300'>
                {/* ... course info items ... */}
              </div>
              <Separator className='my-6 dark:bg-slate-700' />
              <div className='text-sm space-y-2 dark:text-slate-300'>
                <h4 className='font-medium text-lg dark:text-white'>Includes</h4>
                <ul className='space-y-1'>
                  <li>✅ Full lifetime access</li>
                  <li>✅ Certificate of completion</li>
                  <li>✅ Downloadable resources</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
