import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BadgeInfo, Clock, Star, Users, PlayCircle, Lock, ChevronDown } from 'lucide-react';
import ReactPlayer from 'react-player';
import BuyCourseButton from '@/components/BysCourseButton'; // Ensure correct import path
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  useGetCouseLectureModuleQuery
} from '@/features/api/courseApi';
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
  console.log("Purchase Data:", purchase);

  
  const modules = moduleData?.modules || course.modules || [];
  const totalLectures = modules.reduce((acc, m) => acc + (m.lectures?.length || 0), 0);

  const toggleModule = (index) => {
    setExpandedModules(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className='mt-20 space-y-5'>
      {/* Header */}
      <div className='bg-gradient-to-r from-[#2D2F31] to-[#3E4042] text-white p-5 rounded-lg shadow-lg'>
        <div className='max-w-7xl mx-auto py-8 px-4 md:px-8'>
          <h1 className='text-3xl md:text-4xl font-bold'>{course.courseTitle}</h1>
          <p className="text-base md:text-lg text-gray-300">{course.subTitle}</p>
          <p>Created by <span className='text-[#C0C4FC] underline italic'>{course.creator?.name || "ZIMS Academy"}</span></p>
        </div>

        {/* Meta Info */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-wrap items-center gap-4 text-sm text-gray-300 mt-4">
          <div className='flex items-center gap-2'><BadgeInfo size={16} /><span>Last updated: {new Date(course.updatedAt).toLocaleDateString()}</span></div>
          <div className='flex items-center gap-2'><Clock size={16} /><span>{course.duration || "N/A"} hours</span></div>
          <div className='flex items-center gap-2'><Star size={16} className='text-yellow-400' /><span>{course.rating || "4.5"}/5</span></div>
          <div className='flex items-center gap-2'><Users size={16} /><span>{course.enrolledStudents?.length || 0} students</span></div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col lg:flex-row gap-8'>
        {/* Left - Course Content */}
        <div className='flex-1'>
          {/* Description */}
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>Course Description</h2>
            <p className='text-base md:text-lg text-gray-700'>{course.description}</p>
          </section>

          {/* Modules */}
          <section>
            <h2 className='text-2xl font-bold mb-4'>Course Content</h2>
            <Card>
              <CardHeader className='pb-0'>
                <div className='flex justify-between items-center'>
                  <CardDescription>
                    {modules.length} modules • {totalLectures} lectures
                  </CardDescription>
                  <span className='text-sm text-gray-500'>{course.duration || 0} total hours</span>
                </div>
              </CardHeader>
              <CardContent className='p-0'>
                {modules.map((module, index) => (
                  <div key={index} className='border-b'>
                    <div className='p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer' onClick={() => toggleModule(index)}>
                      <div className='flex justify-between items-center'>
                        <h3 className='font-semibold'>Module {index + 1}: {module.title}</h3>
                        <ChevronDown className={`h-5 w-5 transition-transform ${expandedModules[index] ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    {expandedModules[index] && (
                      <div className='divide-y'>
                        {(module.lectures || []).map((lecture, lIdx) => (
                          <div key={lIdx} className='p-4 flex justify-between items-center hover:bg-gray-50'>
                            <div className='flex items-center gap-3'>
                              {lecture.isPreviewFree || purchasedCourse ? (
                                <PlayCircle size={18} className='text-green-500' />
                              ) : (
                                <Lock size={18} className='text-gray-400' />
                              )}
                              <span className='text-sm md:text-base'>{lecture.lectureTitle}</span>
                            </div>
                            <span className='text-sm text-gray-500'>{lecture.duration || "N/A"}</span>
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

        {/* Right - Sidebar */}
        <div className='lg:w-80 xl:w-96 flex-shrink-0'>
          <Card className='sticky top-24 shadow-xl'>
            <div className='aspect-video'>
              <ReactPlayer
                url={course.modules[0]?.lectures[0].mediaUrl || course.courseVideoUrl}
                width="100%"
                height="100%"
                controls
                light={course.courseThumbnail || "https://res.cloudinary.com/ddy6jvgr4/image/upload/v1740411754/xfn4jilb36jnjjplfxne.jpg"}
                playIcon={<PlayCircle className='text-white w-16 h-16' />}
              />
            </div>
            <CardContent className='p-6'>
              <div className='flex justify-between items-start mb-4'>
                <h3 className='text-xl font-bold'>${course.coursePrice?.toFixed(2) || 0}</h3>
              </div>

              {purchase ? (
                <>
                  <Button className='w-full' onClick={() => navigate(`/course-progress/${courseId}`)}>
                    Continue Course
                  </Button>
                  <Button variant='outline' className='w-full mt-2' onClick={() => navigate(-1)}>
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
                  <Button variant='outline' className='w-full mt-2'>Add to Cart</Button>
                </>
              )}

              <div className='text-sm mt-6 space-y-3'>
                <div className='flex justify-between'><span>Level</span><span>{course.courseLevel || "N/A"}</span></div>
                <div className='flex justify-between'><span>Access</span><span>Lifetime</span></div>
                <div className='flex justify-between'><span>Lectures</span><span>{totalLectures}</span></div>
              </div>
              <Separator className='my-6' />
              <div className='text-sm space-y-2'>
                <h4 className='font-medium text-lg'>Includes</h4>
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
