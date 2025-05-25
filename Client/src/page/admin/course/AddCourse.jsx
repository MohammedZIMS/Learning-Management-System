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
import RichTextEditor from '@/components/RichTextEditor';

const AddCourse = () => {
  const navigate = useNavigate();

  // Initialize mutation hook
  const [createCourse, { data, isLoading, error, isSuccess }] = useCreateCourseMutation();

  // State for course data
  const [input, setInput] = useState({
    courseTitle: "",
    category: "",
    description: "",
    courseThumbnail: null,
  });

  // State for thumbnail preview
  const [previewThumbnail, setPreviewThumbnail] = useState("");

  // Handler for input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  // Handler for category selection
  const handleCategoryChange = (value) => {
    setInput({ ...input, category: value });
  };

  // Handler for thumbnail upload
  const handleThumbnailSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setInput({ ...input, courseThumbnail: file });

      // Preview thumbnail
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  // Function to handle course creation
  const createCourseHandler = async () => {
    if (!input.courseTitle || !input.category || !input.description || !input.courseThumbnail) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("category", input.category);
    formData.append("description", input.description);
    formData.append("courseThumbnail", input.courseThumbnail);

    // Call the mutation
    await createCourse(formData);
  };

  // Handle API response
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course created successfully.");
      navigate("/dashboard/instructor-course");
    }
    if (error) {
      toast.error(error?.data?.message || "Failed to create course.");
    }
  }, [isSuccess, error, data, navigate]);

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
            name="courseTitle"
            value={input.courseTitle}
            onChange={handleInputChange}
            placeholder="Enter Course Title"
            className="w-full p-3 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800"
          />
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
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Course Description */}
        <div className="space-y-2">
          <Label className="text-sm font-medium dark:text-gray-300">Course Description</Label>
          {/* <RichTextEditor input={input} setInput={setInput} /> */}
          <Textarea
            name="description"
            value={input.description}
            onChange={handleInputChange}
            placeholder="Describe what students will learn in this course..."
            className="w-full p-3 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 min-h-[150px]"
          />
        </div>

        {/* Course Thumbnail Upload */}
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300">Course Thumbnail</Label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              {previewThumbnail ? (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="text-sm text-green-500 mt-2">
                    {input.courseThumbnail?.name} uploaded
                  </p>
                  <img
                    src={previewThumbnail}
                    className="w-64 h-32 my-2 rounded-md shadow"
                    alt="Course Thumbnail"
                    height={130}
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click to change thumbnail
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, or JPEG (Max: 5MB)
                  </p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleThumbnailSelect} className="hidden" />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => navigate("/dashboard/instructor-course")} disabled={isLoading}>
            Back
          </Button>
          <Button onClick={createCourseHandler} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-all">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Course"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
