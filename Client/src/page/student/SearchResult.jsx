import { Badge } from '@/components/ui/badge'
import React from 'react'
import { Link } from 'react-router-dom'

const SearchResult = ({ course }) => {
  return (
    // Main container with improved spacing and hover effects
    <article className="group grid grid-cols-1 md:grid-cols-[240px_1fr_120px] gap-4 p-4 border-b hover:bg-muted/50 transition-colors">
      {/* Course thumbnail with aspect ratio preservation */}
      <Link 
        to={`/course-detail/${course._id}`}
        className="relative block overflow-hidden rounded-lg aspect-video"
      >
        <img
          src={course.courseThumbnail}
          alt={`${course.courseTitle} thumbnail`}
          className="object-cover w-full h-full transition-transform group-hover:scale-105"
        />
      </Link>

      {/* Course details section */}
      <div className="space-y-2">
        {/* Title with hover underline effect */}
        <Link 
          to={`/course-detail/${course._id}`} 
          className="inline-block"
        >
          <h2 className="text-lg font-semibold hover:underline">
            {course.courseTitle}
          </h2>
        </Link>
        
        {/* Subtitle with line clamp for overflow */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.subTitle}
        </p>

        {/* Instructor info with semantic markup */}
        <div className="text-sm">
          <span className="text-muted-foreground">Instructor: </span>
          <span className="font-medium">{course.creator.name}</span>
        </div>

        {/* Course level badge with dynamic variant */}
        <Badge 
          className="w-fit capitalize"
        >
          {course.courseLevel}
        </Badge>
      </div>

      {/* Price section with proper currency formatting */}
      <div className="flex flex-col items-end justify-center">
        <p className="text-lg font-semibold">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BDT'
          }).format(course.coursePrice)}
        </p>
      </div>
    </article>
  )
}

export default SearchResult
