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
import { Loader2, Video, FileText, Trash2, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lectureType, setLectureType] = useState("video");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFree, setIsFree] = useState(false);

  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > (lectureType === "video" ? 100000000 : 50000000)) {
        toast.error(`File size must be less than ${lectureType === "video" ? "100MB" : "50MB"}`);
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleAddAnotherLecture = () => {
    setLectureTitle("");
    setDescription("");
    setLectureType("video");
    setFile(null);
    setPreviewUrl("");
    setIsFree(false);
    toast.success("Form cleared for new lecture!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulated API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Lecture created successfully!");
      handleAddAnotherLecture(); // Clear form after submission
    }, 2000);
  };

  return (
    <div className="flex-1 mx-auto max-w-4xl p-8 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
      <div className="mb-8">
        <h1 className="font-bold text-2xl mb-2 dark:text-white">
          Create New Lecture
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Build engaging learning content with multimedia support
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Lecture Title Section */}
        <div className="space-y-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="space-y-2">
            <Label>Lecture Title *</Label>
            <Input
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              placeholder="Enter lecture title"
              className="bg-white dark:bg-gray-900"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lecture Type */}
            <div className="space-y-2">
              <Label>Content Type *</Label>
              <Select value={lectureType} onValueChange={setLectureType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Media Type</SelectLabel>
                    <SelectItem value="video">Video Lesson</SelectItem>
                    <SelectItem value="document">Document/PDF</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Free Content Toggle */}
            <div className="space-y-2">
              <Label>Access Type</Label>
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-md">
                <Switch 
                  id="free-content" 
                  checked={isFree}
                  onCheckedChange={setIsFree}
                />
                <Label htmlFor="free-content" className="!mt-0">
                  Free Preview Content
                </Label>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>{lectureType === "video" ? "Upload Video" : "Upload Document"} *</Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <label className="flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                {previewUrl ? (
                  <div className="text-center">
                    {lectureType === "video" ? (
                      <video src={previewUrl} controls className="w-full max-h-64 rounded-lg mb-4" />
                    ) : (
                      <FileText className="h-16 w-16 text-blue-500 mb-4 mx-auto" />
                    )}
                    <p className="text-sm font-medium">{file?.name}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Click to replace file
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    {lectureType === "video" ? (
                      <Video className="h-16 w-16 text-blue-500 mb-4 mx-auto" />
                    ) : (
                      <FileText className="h-16 w-16 text-blue-500 mb-4 mx-auto" />
                    )}
                    <div>
                      <p className="text-blue-600 dark:text-blue-400">Browse computer</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {lectureType === "video" 
                          ? "Supported formats: MP4, MOV, AVI (Max 100MB)"
                          : "Supported formats: PDF, DOCX (Max 50MB)"}
                      </p>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept={lectureType === "video" ? "video/*" : "application/pdf,.doc,.docx"}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Lecture Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the lecture content"
              className="min-h-[120px] bg-white dark:bg-gray-900"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse md:flex-row justify-between gap-4 mt-8">
          <div className="flex gap-4">
            <Button
              variant="destructive"
              onClick={() => navigate(`/dashboard/instructor-course/${courseId}/lecture-module`)}
              className="gap-2"
            >
              <Trash2 className="h-5 w-5" />
              Remove
            </Button>
            <Button
              variant="outline"
              onClick={handleAddAnotherLecture}
              className="gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Another
            </Button>
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="gap-2 bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Create Lecture
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateLecture;
