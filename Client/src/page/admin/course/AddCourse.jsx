import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, UploadCloud } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCreateCourseMutation } from '@/features/api/courseApi'; // Correct hook name

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  const navigate = useNavigate();

  // Initialize the mutation hook
  const [createCourse, { data, isLoading, error, isSuccess }] = useCreateCourseMutation();

  // Handler to set the selected category
  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  // Handler to update thumbnail from file input
  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size must be less than 5MB");
        return;
      }
      setThumbnail(file);
    }
  };

  // Function to handle course creation
  const createCourseHandler = async () => {

    await createCourse({ courseTitle, category });
  };

  // Listen for success or error changes from the mutation
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course created.");
      navigate("/dashboard/instructor-course");

    }
  }, [isSuccess, error])

  return (
    <div className="flex-1 mx-auto max-w-4xl p-8 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="font-bold text-2xl mb-2 dark:text-white">
          Let's Create Your New Course
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Add some basic details to get started with your new course. You can always edit these later.
        </p>
      </div>

      {/* Form Section */}
      <div className="space-y-6">
        {/* Course Title */}
        <div className="space-y-2">
          <Label className="text-sm font-medium dark:text-gray-300">Course Title</Label>
          <Input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Enter Course Title"
            className="w-full p-3 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Make it descriptive and engaging to attract students.
          </p>
        </div>

        {/* Course Category */}
        <div className="space-y-2">
          <Label className="text-sm font-medium dark:text-gray-300">Category</Label>
          <Select onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full p-3 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="rounded-lg shadow-lg dark:bg-gray-800">
              <SelectGroup>
                <SelectLabel className="text-gray-500 dark:text-gray-400">Categories</SelectLabel>
                <SelectItem value="data-science">Data Science</SelectItem>
                <SelectItem value="artificial-intelligence">Artificial Intelligence</SelectItem>
                <SelectItem value="frontend">Frontend Development</SelectItem>
                <SelectItem value="fullstack">Fullstack Development</SelectItem>
                <SelectItem value="mern">MERN Stack Development</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="docker">Docker</SelectItem>
                <SelectItem value="mongodb">MongoDB</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose the most relevant category for your course.
          </p>
        </div>

        {/* Course Description */}
        <div className="space-y-2">
          <Label className="text-sm font-medium dark:text-gray-300">Course Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what students will learn in this course..."
            className="w-full p-3 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 min-h-[150px]"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Be clear and concise. Highlight the key takeaways.
          </p>
        </div>

        {/* Course Thumbnail Upload */}
        <div className="space-y-2">
          <Label className="text-sm font-medium dark:text-gray-300">Course Thumbnail</Label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 text-gray-400 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, or JPEG (Max: 5MB)
                </p>
                {thumbnail && (
                  <p className="text-sm text-green-500 mt-2">{thumbnail.name} uploaded</p>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/instructor-course")}
            disabled={isLoading}
          >
            Back
          </Button>
          <Button
            disabled={isLoading}
            onClick={createCourseHandler}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create Course"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
