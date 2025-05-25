import React from 'react'
import Course from './Course';
import { BookOpen, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { useLoadUserQuery } from '@/features/api/authApi';
import { useGetPublishedCoursesQuery } from '@/features/api/courseApi';

const MyLearning = () => {
    const {data, isLoading} = useLoadUserQuery();
    const myLearning = data.user.enrolledCourses || [];
    

    const navigator = useNavigate();
  return (
    <div className='max-w-6xl mx-auto my-24 px-4 md:px-6'>
        <div className="border-b dark:border-gray-800 pb-4 mb-8">
            <h1 className="font-bold text-3xl flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
                My Learning
            </h1>
        </div>
        
        <div className="my-5">
            {isLoading ? (
                <MyLearningSkeleton />
            ) : myLearning.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                    <div className="mb-6 p-6 bg-blue-100 dark:bg-blue-900 rounded-full">
                        <BookOpen className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">No Enrolled Courses</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                        You haven't enrolled in any courses yet. Explore our catalog to start your learning journey!
                    </p>
                    <Button className="gap-2" onClick={() => navigator('/course')}>
                        <PlusCircle className="w-5 h-5" />
                        Browse Courses
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myLearning.map((course, index) => (
                        <Course key={index} course={course} />
                    ))}
                </div>
            )}
        </div>
    </div>
  )
}

export default MyLearning

const MyLearningSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
            <div key={index} className="border dark:border-gray-800 rounded-xl overflow-hidden">
                <Skeleton className="h-48 w-full bg-gray-200 dark:bg-gray-800" />
                <div className="p-5 space-y-4">
                    <Skeleton className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
                            <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-gray-800" />
                        </div>
                        <Skeleton className="h-4 w-16 bg-gray-200 dark:bg-gray-800" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-800" />
                        <Skeleton className="h-4 w-4/5 bg-gray-200 dark:bg-gray-800" />
                    </div>
                </div>
                <div className="p-5 border-t dark:border-gray-800 flex justify-between items-center">
                    <Skeleton className="h-6 w-16 bg-gray-200 dark:bg-gray-800" />
                    <Skeleton className="h-10 w-24 rounded-lg bg-gray-200 dark:bg-gray-800" />
                </div>
            </div>
        ))}
    </div>
);
