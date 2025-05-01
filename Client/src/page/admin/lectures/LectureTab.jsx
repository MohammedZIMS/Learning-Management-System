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
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import axios from 'axios';
import { Progress } from '@/components/ui/progress';
import { useEditLectureMutation, useRemoveLectureMutation } from '@/features/api/courseApi';

const MEDIA_API = "http://localhost:8081/api/v1/media";

const CreateLecture = () => {
  // Local state for lecture form fields
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [description, setDescription] = useState("");
  const [lectureType, setLectureType] = useState("video"); // "video" or "document"
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);

  // API Mutation hook from RTK Query for editing lecture
  const [editLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation();

  const [removeLecture, {data:removedata, isLoading:removeLoading, isSuccess:removeSuccess}] = useRemoveLectureMutation();

  // Get courseId and lectureId from URL parameters
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();

  // Function to handle editing the lecture
  const editLectureHandler = async (e) => {
    e.preventDefault();
    if (!lectureTitle || !uploadVideoInfo) {
      toast.error("Please fill in all required fields.");
      return;
    }
    

    await editLecture({
      lectureTitle,
      videoInfo: uploadVideoInfo,
      description,
      lectureType,
      isPreviewFree: isFree,
      courseId,
      lectureId,
    });
  };

  const removeLectureHandler = async () => {
    await removeLecture(lectureId);
  }

  // Effect to handle API responses
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Lecture updated successfully!");
      navigate(`/dashboard/instructor-course/${courseId}/lecture-module`);
    }
    if (error) {
      toast.error(error?.data?.message || "Failed to update lecture.");
    }
  }, [isSuccess, error, data, navigate, courseId]);

  useEffect(() => {
    if(removeSuccess){
      toast.success(removeLecture.message);
    }
  }, [removeSuccess])

  // File upload handler
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const maxFileSize = lectureType === "video" ? 100 * 1024 * 1024 : 50 * 1024 * 1024;
    if (selectedFile.size > maxFileSize) {
      toast.error(`File size must be less than ${lectureType === "video" ? "100MB" : "50MB"}`);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setMediaProgress(true);
    try {
      const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
        onUploadProgress: ({ loaded, total }) => {
          setUploadProgress(Math.round((loaded * 100) / total));
        },
      });

      if (res.data.success) {
        // Fixed typo: "videpUrl" is corrected to "videoUrl"
        setUploadVideoInfo({ 
          videoUrl: res.data.data.url, 
          publicId: res.data.data.public_id 
        });
        setBtnDisable(false);
        toast.success("File uploaded successfully.");
      }
    } catch (err) {
      console.error(err);
      toast.error("File upload failed.");
    } finally {
      setMediaProgress(false);
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  

  // Function to reset the form for a new lecture
  const resetForm = () => {
    setLectureTitle("");
    setDescription("");
    setLectureType("video");
    setFile(null);
    setPreviewUrl("");
    setUploadVideoInfo(null);
    setIsFree(false);
    setBtnDisable(true);
    setUploadProgress(0);
    toast.info("Form Reset");
  };

  return (
    <div className="flex-1 mx-auto max-w-4xl p-8 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
      <div className="mb-8">
        <h1 className="font-bold text-2xl mb-2 dark:text-white">
          {lectureId ? "Edit Lecture" : "Create New Lecture"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Build engaging learning content with multimedia support.
        </p>
      </div>

      {/* Removed form onSubmit and using button onClick for submission */}
      <form className="space-y-6">
        {/* Lecture Title Section */}
        <div className="space-y-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="space-y-2">
            <Label>
              Lecture Title <span className="text-red-500">*</span>
            </Label>
            <Input
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              placeholder="Enter lecture title"
              className="bg-white dark:bg-gray-900"
              required
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lecture Type */}
            <div className="space-y-2">
              <Label>
                Content Type <span className="text-red-500">*</span>
              </Label>
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
            <Label>
              {lectureType === "video" ? "Upload Video" : "Upload Document"} <span className="text-red-500">*</span>
            </Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <label className="flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                {previewUrl ? (
                  <div className="text-center">
                    {lectureType === "video" ? (
                      <video src={previewUrl} controls className="w-full max-h-64 rounded-lg mb-4" />
                    ) : (
                      <FileText className="h-16 w-16 text-blue-500 mb-4 mx-auto" />
                    )}
                    <p className="text-sm font-medium text-green-600">{file?.name}</p>
                    <p className="text-sm text-gray-500 mt-2">Click to replace file</p>
                  </div>
                ) : (
                  <div className="text-center">
                    {lectureType === "video" ? (
                      <Video className="h-16 w-16 text-blue-500 mb-4 mx-auto" />
                    ) : (
                      <FileText className="h-16 w-16 text-blue-500 mb-4 mx-auto" />
                    )}
                    <div>
                      <p className="text-blue-600 dark:text-blue-400">Click to upload</p>
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
                  required
                />
              </label>
            </div>
          </div>

          {mediaProgress && (
            <div className="my-4">
              <Progress value={uploadProgress} />
              <p>{uploadProgress}% uploaded</p>
            </div>
          )}

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
        <div className="flex flex-col-reverse md:flex-row justify-between gap-2 mt-8">
          <Button
            variant="destructive"
            onClick={removeLectureHandler}
            className="gap-2"
          >
            <Trash2 className="h-5 w-5" />
            Remove
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            className="gap-2 bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
            onClick={editLectureHandler}
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
