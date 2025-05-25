import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";

const Course = ({ course }) => {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < fullStars ? "currentColor" : "none"}
        className={i < fullStars ? "text-yellow-500" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="w-full max-w-sm">
      <Card className="overflow-hidden rounded-xl dark:bg-gray-900 bg-white shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
        {/* Course Thumbnail */}
        <div className="relative">
          <img
            src={course?.courseThumbnail}
            alt={course?.courseTitle}
            title={course?.courseTitle}
            className="w-full h-44 object-cover rounded-t-xl"
          />
          <Badge className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-md shadow-md text-sm">
            {course?.courseLevel}
          </Badge>
        </div>

        {/* Course Content */}
        <CardContent className="p-5 space-y-4">
          <h1
            title={course?.courseTitle}
            className="font-bold text-xl hover:text-blue-600 transition-colors cursor-pointer truncate"
          >
            <Link to={`/course-detail/${course?._id}`}>
              {course?.courseTitle || "Course Title"}
            </Link>
          </h1>

          {/* Instructor + Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={course?.creator?.photoUrl || "https://github.com/shadcn.png"}
                  alt={course?.creator?.name}
                />
                <AvatarFallback>
                  {course?.creator?.name?.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <h2 className="font-medium text-sm text-gray-600 dark:text-gray-300">
                {course?.creator?.name || "Instructor"}
              </h2>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center text-yellow-500">
              {renderStars(course?.averageRating || 0)}
              <span className="ml-1 text-sm text-gray-500">
                ({course?.averageRating?.toFixed(1) || "0.0"})
              </span>
            </div>
          </div>

          {/* Description */}
          <Link to={`/course-detail/${course?._id}`}>
            <div
              className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: course?.description }}
            />
          </Link>
        </CardContent>

        {/* Price and Button */}
        <CardFooter className="flex justify-between items-center p-5 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-1">
            <span className="text-xl font-bold text-blue-600">
              ৳{course?.coursePrice}
            </span>
            <p className="text-sm text-gray-500">
              Price
            </p>
          </div>
          <Link to={`/course-detail/${course?._id}`}>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-lg transition-all hover:scale-105">
              More Details
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Course;
