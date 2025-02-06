import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const Course = () => {
  return (
    <div className="w-full max-w-sm">
      {/* Course Card */}
      <Card className="overflow-hidden rounded-xl dark:bg-gray-900 bg-white shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
        {/* Course Thumbnail */}
        <div className="relative">
          <img
            src="https://mulan.co.ke/wp-content/uploads/2023/01/HTML-Complete-Course-Thumbnail.jpg"
            alt="HTML Course"
            className="w-full h-44 object-cover rounded-t-xl"
          />
          <Badge className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-md shadow-md text-sm">
            Advanced
          </Badge>
        </div>

        {/* Course Content */}
        <CardContent className="p-5 space-y-4">
          {/* Course Title */}
          <h1 className="font-bold text-xl hover:text-blue-600 transition-colors cursor-pointer">
            HTML Complete Course in 2025
          </h1>

          {/* Instructor Details */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>AR</AvatarFallback>
              </Avatar>
              <h2 className="font-medium text-sm text-gray-600 dark:text-gray-300">
                Ankan Roy
              </h2>
            </div>

            {/* Star Rating */}
            <div className="flex items-center text-yellow-500">
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} className="text-gray-300" />
              <span className="ml-1 text-sm text-gray-500">(4.0)</span>
            </div>
          </div>

          {/* Course Description */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Master HTML from scratch with this comprehensive course. Perfect for beginners and advanced learners alike.
          </p>
        </CardContent>

        {/* Course Footer (Price & Buy Button) */}
        <CardFooter className="flex justify-between items-center p-5 border-t border-gray-200 dark:border-gray-700">
          <span className="text-xl font-bold text-blue-600">৳500</span>
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-lg transition-all hover:scale-105">
            Buy Course
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Course;