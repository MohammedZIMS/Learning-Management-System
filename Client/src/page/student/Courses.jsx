import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import Course from './Course';
import { useGetPublishedCoursesQuery } from '@/features/api/courseApi';

const Courses = () => {
    const {data, isLoading, isSuccess, isError} = useGetPublishedCoursesQuery();

    if (isError) return <h2 className='text-center text-red-500'>Error fetching courses</h2>;

    return (
        <div className='bg-gray-50 dark:bg-gray-900 min-h-screen'>
            <div className="max-w-7xl mx-auto p-6">
                {/* Section Title */}
                <div className="border-b dark:border-gray-800 pb-8 mb-12">
                    <h1 className="font-bold text-4xl text-center text-gray-800 dark:text-gray-100 mt-12">
                        Explore Our Courses
                    </h1>
                    <p className="text-center text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
                        Discover a wide range of professional courses to enhance your skills
                    </p>
                </div>
                
                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, index) => (
                            <CourseSkeleton key={index} />
                        ))
                    ) : (
                        data?.courses?.map((course, index) => 
                            <Course key={course._id || index} course={course} />
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Courses;

const CourseSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
            <Skeleton className="w-full h-36 dark:bg-gray-700" />
            <div className="px-4 py-5 space-y-3">
                <Skeleton className="h-6 w-3/4 dark:bg-gray-700" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-6 rounded-full dark:bg-gray-700" />
                        <Skeleton className="h-4 w-20 dark:bg-gray-700" />
                    </div>
                    <Skeleton className="h-4 w-16 dark:bg-gray-700" />
                </div>
                <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-1/4 dark:bg-gray-700" />
                    <Skeleton className="h-8 w-20 rounded-md dark:bg-gray-700" />
                </div>
            </div>
        </div>
    );
};
