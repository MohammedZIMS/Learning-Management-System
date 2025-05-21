import React, { useState } from 'react'
import Filter from './Filter'
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SearchResult from './SearchResult';
import { useGetSearchCourseQuery } from '@/features/api/courseApi';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortByPrice, setSortByPrice] = useState("");

    const { data, isLoading } = useGetSearchCourseQuery({
        searchQuery: query,
        categories: selectedCategories,
        sortByPrice
    });

    const isEmpty = !isLoading && data?.courses.length === 0;

    const handleFilterChange = (categories, price) => {
        setSelectedCategories(categories);
        setSortByPrice(price);
    }

    return (
        <div className='max-w-7xl mx-auto p-4 md:p-8 mt-10 space-y-8'>
            {/* Search Header */}
            <div className="space-y-2">
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>
                <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>
                    Search Results for "<span className="text-primary">{query}</span>"
                </h1>
                <p className="text-muted-foreground">
                    {data?.courses?.length || 0} courses found
                </p>
            </div>

            {/* Main Content Grid */}
            <div className='grid md:grid-cols-[280px_1fr] gap-8'>
                {/* Filter Sidebar */}
                <div className="md:sticky md:top-20 md:h-[calc(100vh-160px)] md:overflow-y-auto">
                    <Filter handleFilterChange={handleFilterChange} />
                </div>

                {/* Results Section */}
                <div className='space-y-6'>
                    {isLoading ? (
                        <div className="space-y-6">
                            {Array.from({ length: 3 }).map((_, idx) => (
                                <CourseSkeleton key={idx} />
                            ))}
                        </div>
                    ) : isEmpty ? (
                        <CourseNotFound searchQuery={query} />
                    ) : (
                        data?.courses?.map((course) => (
                            <SearchResult key={course._id} course={course} />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default SearchPage

const CourseNotFound = ({ searchQuery }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 rounded-xl bg-muted/50">
            <div className="mb-6">
                <AlertCircle className="h-16 w-16 text-primary/80 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                    No courses found for "<span className="text-primary">{searchQuery}</span>"
                </h2>
                <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button asChild>
                    <Link to="/courses">
                        Browse All Courses
                    </Link>
                </Button>
            </div>
        </div>
    );
};

const CourseSkeleton = () => {
    return (
        <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg animate-pulse">
            <Skeleton className="aspect-video w-full md:w-48 rounded-lg" />
            <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
            </div>
            <Skeleton className="h-6 w-16 self-end md:self-center" />
        </div>
    );
};
