import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BadgeInfo, Clock, Star, Users, PlayCircle, Lock, ChevronDown, Award, BookOpen } from 'lucide-react';
import ReactPlayer from 'react-player';
import BuyCourseButton from '@/components/BysCourseButton';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetCourseRatingsQuery, useGetCouseLectureModuleQuery } from '@/features/api/courseApi';
import { useGetCourseDetailsWithPurchaseStatusQuery } from '@/features/api/purchaseApi';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState({});

  const { data, isLoading, isError } = useGetCourseDetailsWithPurchaseStatusQuery(courseId);
  const { data: moduleData, isLoading: modulesLoading, error: modulesError } = useGetCouseLectureModuleQuery(courseId);
  const { data: ratingsData, isLoading: ratingsLoading } = useGetCourseRatingsQuery(courseId);

  if (isLoading || modulesLoading) return <CourseDetailSkeleton />;
  if (isError || modulesError || !data?.course) return <p className="text-center mt-20 text-red-500">Course not found.</p>;

  const { course, purchase } = data;
  const modules = moduleData?.modules || course.modules || [];
  const totalLectures = modules.reduce((acc, m) => acc + (m.lectures?.length || 0), 0);
  const averageRating = course.ratings?.reduce((acc, curr) => acc + curr.rating, 0) / course.ratings?.length || 0;

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
        className={`${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} dark:text-yellow-500`}
      />
    ));
  };

  return (
    <div className="dark:bg-gray-900 min-h-screen">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 dark:from-gray-800 dark:to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl space-y-6">
            <Badge variant="secondary" className="text-sm bg-white/70 backdrop-blur-sm">
              {course.courseLevel} Level
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{course.courseTitle}</h1>
            <p className="text-xl text-gray-200 dark:text-gray-300">{course.subTitle}</p>
            
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={course.creator?.photoUrl} />
                <AvatarFallback>{course.creator?.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Created by</p>
                <p className="text-lg">{course.creator?.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white/10 rounded-lg">
                <p className="text-gray-300">Total Modules</p>
                <p className="text-2xl font-bold">{modules.length}</p>
              </div>
              <div className="p-4 bg-white/10 rounded-lg">
                <p className="text-gray-300">Lectures</p>
                <p className="text-2xl font-bold">{totalLectures}</p>
              </div>
              
              <div className="p-4 bg-white/10 rounded-lg">
                <p className="text-gray-300">Rating</p>
                <div className="flex items-center gap-1">
                  {renderStars(averageRating)}
                  <span>({course.ratings?.length || 0})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid lg:grid-cols-[1fr_400px] gap-8">
        {/* Left Content */}
        <div className="space-y-12">
          {/* Course Description */}
          <section className="prose dark:prose-invert max-w-none">
            <h2 className="text-3xl font-bold mb-6">Course Description</h2>
            <div className="text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: course.description }} />
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
                  {/* <span className='text-sm text-gray-500 dark:text-slate-400'>{course.duration || 0} total hours</span> */}
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

          {/* Reviews Section */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold">Student Reviews</h2>
            {ratingsData?.ratings?.length > 0 ? (
              <div className="space-y-6">
                {ratingsData.ratings.map((rating) => (
                  <div key={rating._id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={rating.user.photoUrl} />
                        <AvatarFallback>{rating.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{rating.user.name}</p>
                        <div className="flex items-center gap-1">
                          {renderStars(rating.rating)}
                        </div>
                      </div>
                    </div>
                    {rating.comment && (
                      <p className="text-gray-600 dark:text-gray-300">{rating.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No reviews yet. Be the first to review this course!
              </div>
            )}
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8 lg:sticky lg:top-24 lg:h-fit">
          <Card className="shadow-xl dark:border-gray-700">
            <ReactPlayer
              url={course.modules[0]?.lectures[0]?.mediaUrl}
              width="100%"
              height="220px"
              controls
              light={course.courseThumbnail}
              playIcon={<PlayCircle className="text-white w-16 h-16" />}
            />
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">৳{course.coursePrice}</span>
                </div>

                {purchase ? (
                  <Button 
                    size="lg" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => navigate(`/course-progress/${courseId}`)}
                  >
                    Continue Learning
                  </Button>
                ) : (
                  <>
                    <BuyCourseButton
                      courseId={course._id}
                      courseName={course.courseTitle}
                      amount={course.coursePrice}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    />
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="w-full"
                    >
                      Add to Cart
                    </Button>
                  </>
                )}
              </div>

              <Separator className="dark:bg-gray-700" />

              <div className="space-y-4">
                <h3 className="text-xl font-bold">Course Includes</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <PlayCircle className="text-green-500" size={18} />
                    <span>{totalLectures} on-demand videos</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Award className="text-blue-500" size={18} />
                    <span>Certificate of completion</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <BookOpen className="text-purple-500" size={18} />
                    <span>Lifetime access</span>
                  </li>
                  {/* <li className="flex items-center gap-3">
                    <Clock className="text-yellow-500" size={18} />
                    <span>{course.duration} hours of content</span>
                  </li> */}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const CourseDetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
    <div className="space-y-8">
      <Skeleton className="h-12 w-48 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-96 rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-64" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

export default CourseDetail;
