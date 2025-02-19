import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";
import React from 'react';
import { useGetCreatorCoursesQuery } from "@/features/api/courseApi";
import { Edit } from "lucide-react";

const CourseTable = () => {
  const { data, isLoading } = useGetCreatorCoursesQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  console.log("data ->", data);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Your Courses</h1>
        <Button onClick={() => navigate(`/dashboard/instructor-course/create-course`)}>
          Create a New Course
        </Button>
      </div>

      <Table className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <TableCaption className="text-gray-500 dark:text-gray-400">
          A list of your recent courses.
        </TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px] text-gray-700 dark:text-gray-300">Price</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Title</TableHead>
            <TableHead className="text-right text-gray-700 dark:text-gray-300">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.courses.map((course) => (
            <TableRow key={course._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <TableCell className="font-medium text-gray-800 dark:text-gray-200">
                {course?.coursePrice ? `$${course.coursePrice}` : "NA"}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    course.isPublished
                      ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                  }`}
                >
                  {course.isPublished ? "Published" : "Draft"}
                </span>
              </TableCell>
              <TableCell className="text-gray-800 dark:text-gray-200">
                {course.courseTitle}
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" className="text-gray-600 dark:text-gray-400">
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} className="text-gray-700 dark:text-gray-300">
              Total
            </TableCell>
            <TableCell className="text-right text-gray-800 dark:text-gray-200">
              $2,500.00
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default CourseTable;
