import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { UploadCloud } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const AddCourse = () => {
  const navigate = useNavigate();
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
          <Select>
            <SelectTrigger className="w-full p-3 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="rounded-lg shadow-lg dark:bg-gray-800">
              <SelectGroup>
                <SelectLabel className="text-gray-500 dark:text-gray-400">Categories</SelectLabel>
                <SelectItem value="data-science">Data Science</SelectItem>
                <SelectItem value="frontend">Frontend Development</SelectItem>
                <SelectItem value="fullstack">Fullstack Development</SelectItem>
                <SelectItem value="mern">MERN Stack Development</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="docker">Docker</SelectItem>
                <SelectItem value="mongodb">MongoDB</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
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
                  PNG, JPG, or JPEG
                </p>
              </div>
              <input type="file" accept="image/*" />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => navigate("/dashboard/instructor-course")}>
            Back
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-all">
            Create Course
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddCourse
