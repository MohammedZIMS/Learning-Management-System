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
import { Loader2, UploadCloud, Video, FileText } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lectureType, setLectureType] = useState("video"); // "video" or "document"
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const createLectureHandler = async () => {

  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Lecture created successfully!");
      alert("Lecture created successfully!")
      console.log(lectureTitle, description);
      
    }, 2000);
  };

  return (
    <div className="flex-1 mx-auto max-w-4xl p-8 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="font-bold text-2xl mb-2 dark:text-white">
          Let's Create Your New Lecture
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Add some basic details to get started with your new lecture. You can always edit these later.
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
      
        {/* Section Lecture Title Module or Create Lecture Title Module */}

        {/* Lecture Title */}
        <div className="space-y-2">
          <Label className="text-sm font-medium dark:text-gray-300">Lecture Title</Label>
          <Input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Enter Lecture Title"
            className="w-full p-3 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800"
            required
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Make it descriptive and engaging to attract students.
          </p>
        </div>

        {/* Lecture Description */}
        <div className="space-y-2">
          <Label className="text-sm font-medium dark:text-gray-300">Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a brief description of the lecture"
            className="w-full p-3 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800"
            rows={4}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Provide a detailed overview of what students will learn in this lecture.
          </p>
        </div>

        {/* Lecture Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium dark:text-gray-300">Lecture Type</Label>
          <Select value={lectureType} onValueChange={setLectureType}>
            <SelectTrigger className="w-full p-3 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800">
              <SelectValue placeholder="Select lecture type" />
            </SelectTrigger>
            <SelectContent className="rounded-lg shadow-lg dark:bg-gray-800">
              <SelectGroup>
                <SelectLabel>Lecture Type</SelectLabel>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="document">Document</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose the type of content for this lecture.
          </p>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label className="text-sm font-medium dark:text-gray-300">
            {lectureType === "video" ? "Upload Video" : "Upload Document"}
          </Label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              {previewUrl ? (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {lectureType === "video" ? (
                    <video
                      src={previewUrl}
                      controls
                      className="w-64 my-2 rounded-md shadow"
                    />
                  ) : (
                    <FileText className="w-12 h-12 text-gray-400 mb-3" />
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {file?.name || "File uploaded successfully"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click to change file
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {lectureType === "video" ? (
                    <Video className="w-12 h-12 text-gray-400 mb-3" />
                  ) : (
                    <FileText className="w-12 h-12 text-gray-400 mb-3" />
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {lectureType === "video" ? "MP4, AVI, or MOV (Max: 100MB)" : "PDF, DOCX (Max: 50MB)"}
                  </p>
                </div>
              )}
              <input
                type="file"
                accept={lectureType === "video" ? "video/*" : "application/pdf, .doc, .docx"}
                onChange={handleFileChange}
                className="hidden"
                required
              />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/instructor-course/${courseId}`)}
            disabled={isLoading}
          >
            Back to Course
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            onClick={createLectureHandler}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create Lecture"
            )}
          </Button>


          {/* Show  Lecture Module */}
        </div>
      </form>
    </div>
  );
};

export default CreateLecture;