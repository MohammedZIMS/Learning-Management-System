import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BadgeInfo, Lock, PlayCircle, Star, Users, Clock } from 'lucide-react';
import ReactPlayer from 'react-player';
import React from 'react';
import BysCourseButton from '@/components/BysCourseButton';

const CourseDetail = () => {
    const purchasedCourse = true;
    const course = {
        title: "Advanced React Development",
        subtitle: "Master hooks, context, and advanced patterns",
        instructor: "ZIMS Academy",
        lastUpdated: "2023-10-01",
        duration: 10,
        rating: 4.5,
        enrolled: 1243,
        price: 89.99,
        description: "This comprehensive course takes you through advanced React concepts including custom hooks, context API, performance optimization, and state management patterns. You'll build real-world applications and learn best practices from industry experts.",
        thumbnail: "/course-thumbnail.jpg",
        modules: [
            {
                title: "Getting Started with Advanced React",
                lectures: [
                    { title: "Course Introduction", duration: "12:45", preview: true },
                    { title: "Setting Up Your Environment", duration: "18:30", preview: false },
                    { title: "React Fundamentals Recap", duration: "22:15", preview: false }
                ]
            },
            {
                title: "Advanced Hooks Patterns",
                lectures: [
                    { title: "Custom Hooks Deep Dive", duration: "25:20", preview: true },
                    { title: "useReducer vs useState", duration: "19:45", preview: false },
                    { title: "Optimizing with useMemo/useCallback", duration: "28:10", preview: false }
                ]
            },
            {
                title: "State Management Solutions",
                lectures: [
                    { title: "Context API Patterns", duration: "32:15", preview: false },
                    { title: "Introduction to Zustand", duration: "24:50", preview: false },
                    { title: "Redux Toolkit Overview", duration: "29:30", preview: false }
                ]
            }
        ]
    };

    return (
        <div className='mt-20 space-y-5'>
            {/* Course Header Section */}
            <div className='bg-gradient-to-r from-[#2D2F31] to-[#3E4042] text-white p-5 rounded-lg shadow-lg'>
                <div className='max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2'>
                    <h1 className='text-3xl md:text-4xl font-bold'>course title</h1>
                    <p className="text-base md:text-lg text-gray-300">course subtitle</p>
                    <p>Created by{""} <span className='text-[#C0C4FC] underline italic'>course instructor</span></p>
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-wrap items-center gap-4 text-sm text-gray-300 mt-4">
                    <div className='flex items-center gap-2'>
                        <BadgeInfo size={16} />
                        <span>Last updated: course.lastUpdated</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Clock size={16} />
                        <span>course.duration hours</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Star size={16} className='text-yellow-400' />
                        <span>{course.rating}/5 ({Math.floor(course.enrolled / 10)} reviews)</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Users size={16} />
                        <span>enrolled students</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col lg:flex-row gap-8'>
                {/* Left Column - Course Content */}
                <div className='flex-1'>
                    {/* <section className='mb-8'>
                        <h2 className='text-2xl font-bold mb-4'>What you'll learn</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-6'>
                            {[
                                "Master advanced React hooks patterns",
                                "Build performant React applications",
                                "Implement complex state management",
                                "Create reusable component architectures",
                                "Optimize React rendering performance",
                                "Deploy production-ready applications"
                            ].map((item, index) => (
                                <div key={index} className='flex items-start gap-2'>
                                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </section> */}

                    <section className='mb-8'>
                        <h2 className='text-2xl font-bold mb-4'>Course Description</h2>
                        <p className='text-base md:text-lg text-gray-700 leading-relaxed'>course.description</p>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold mb-4'>Course Content</h2>
                        <Card>
                            <CardHeader className='pb-0'>
                                <div className='flex justify-between items-center'>
                                    <CardDescription>
                                        {course.modules.length} modules • {course.modules.reduce((acc, module) => acc + module.lectures.length, 0)} lectures
                                    </CardDescription>
                                    <span className='text-sm text-gray-500'>{course.duration} total hours</span>
                                </div>
                            </CardHeader>
                            <CardContent className='p-0'>
                                {course.modules.map((module, moduleIndex) => (
                                    <div key={moduleIndex} className='border-b last:border-b-0'>
                                        <div className='p-4 bg-gray-50'>
                                            <h3 className='font-semibold'>{moduleIndex + 1}. {module.title}</h3>
                                        </div>
                                        <div className='divide-y'>
                                            {module.lectures.map((lecture, lectureIndex) => (
                                                <div key={lectureIndex} className='p-4 flex items-center justify-between hover:bg-gray-50'>
                                                    <div className='flex items-center gap-3'>
                                                        {lecture.preview || purchasedCourse ? (
                                                            <PlayCircle size={18} className='text-green-500 flex-shrink-0' />
                                                        ) : (
                                                            <Lock size={18} className='text-gray-400 flex-shrink-0' />
                                                        )}
                                                        <span className='text-sm md:text-base'>
                                                            {moduleIndex + 1}.{lectureIndex + 1} {lecture.title}
                                                        </span>
                                                    </div>
                                                    <span className='text-sm text-gray-500'>{lecture.duration}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </section>
                </div>

                {/* Right Column - Purchase/Sidebar */}
                <div className='lg:w-80 xl:w-96 flex-shrink-0'>
                    <Card className='sticky top-24'>
                        <div className='aspect-video bg-gray-200 relative overflow-hidden'>
                            {/* Replace with your video thumbnail */}
                            <div className='aspect-video'>
                                <ReactPlayer url={course.previewVideo} width="100%" height="100%" controls />
                            </div>
                        </div>
                        <CardContent className='p-6'>
                            <div className='flex justify-between items-start mb-4'>
                                <h3 className='text-xl font-bold'>$course.price</h3>
                                {course.price > 50 && (
                                    <span className='bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded'>
                                        SALE
                                    </span>
                                )}
                            </div>

                            <BysCourseButton/>

                            <div className='space-y-3 text-sm'>
                                <div className='flex justify-between'>
                                    <span className='text-gray-600'>Level</span>
                                    <span>Intermediate</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-600'>Duration</span>
                                    <span>{course.duration} hours</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-600'>Lessons</span>
                                    <span>{course.modules.reduce((acc, module) => acc + module.lectures.length, 0)}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-600'>Access</span>
                                    <span>Lifetime</span>
                                </div>
                            </div>

                            <Separator className='my-4' />

                            <div className='text-sm space-y-2'>
                                <h4 className='font-medium'>This course includes:</h4>
                                <div className='flex items-center gap-2'>
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span>Full lifetime access</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span>Certificate of completion</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span>Downloadable resources</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
