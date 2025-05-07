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
import { Button } from '@/components/ui/button';
import { Loader2, Video, FileText, Trash2, Plus } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { data, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import axios from 'axios';
import { Progress } from '@/components/ui/progress';
import { useEditLectureMutation, useRemoveLectureMutation, useGetLectureByIdQuery } from '@/features/api/courseApi';

const MEDIA_API = "http://localhost:8081/api/v1/media";

const CreateLectureTab = () => {
  // Local state for lecture form fields
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadMediaInfo, setUploadMediaInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lectureType, setLectureType] = useState("video");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const { courseId, moduleId, lectureId } = useParams();
  const navigate = useNavigate();
  

  // API mutations
  const { data:lectureData, isLoading: lectureLoading, error: lectureError } = useGetLectureByIdQuery({lectureId}, { skip: !lectureId });
  const [editLecture, { isLoading, error, isSuccess }] = useEditLectureMutation();
  const [removeLecture, { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess }] = useRemoveLectureMutation();

  // Set initial state if editing an existing lecture
  const lecture = lectureData?.lecture;  

  // Set initial values for lecture title and free preview based on existing lecture data
  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);
      setUploadMediaInfo(lecture.mediaInfo);
    }
  }, [lecture]);

  

  // File upload handler
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File validation
    const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    const validDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if ((lectureType === "video" && !validVideoTypes.includes(file.type)) ||
      (lectureType === "document" && !validDocTypes.includes(file.type))) {
      toast.error("Invalid file format");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setMediaProgress(true);

    try {
      const endpoint = lectureType === "video" ? "upload-video" : "upload-document";
      const res = await axios.post(`${MEDIA_API}/${endpoint}`, formData, {
        onUploadProgress: ({ loaded, total }) => {
          setUploadProgress(Math.round((loaded * 100) / total));
        }
      });

      if (res.data.success) {
        setUploadMediaInfo({
          mediaUrl: res.data.data.url,
          publicId: res.data.data.public_id
        });
        setFile(file);

        // Handle preview based on file type
        if (lectureType === "document" && file.type === "application/pdf") {
          const reader = new FileReader();
          reader.onload = (e) => setPreviewUrl(e.target.result);
          reader.readAsDataURL(file);
        } else {
          setPreviewUrl(URL.createObjectURL(file));
        }

        toast.success("File uploaded successfully");
      }
    } catch (error) {
      toast.error(`Failed to upload ${lectureType}`);
      console.error("Upload error:", error);
    } finally {
      setMediaProgress(false);
    }
  };

  // Handle lecture submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!lectureTitle || !uploadMediaInfo) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const mediaField = lectureType === "video" ? "videoInfo" : "documentInfo";
      await editLecture({
        lectureId,
        moduleId,
        courseId,
        lectureTitle,
        mediaType: lectureType,
        [mediaField]: uploadMediaInfo,
        isPreviewFree: isFree,
      }).unwrap();

      toast.success(lectureId ? "Lecture updated!" : "Lecture created!");
      navigate(`/dashboard/instructor-course/${courseId}/modules/${moduleId}/lecture`);
    } catch (error) {
      toast.error(error.data?.message || "Operation failed");
    }
  };

  // Handle lecture deletion
  const handleDelete = async () => {
    await removeLecture(lectureId).unwrap();
  };

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Handle error and success states
  useEffect(() => {
    if (error) {
      toast.error(error.data?.message || "Operation failed");
    }
    if (isSuccess) {
      toast.success("Lecture updated successfully!");

    }
  }, [error, isSuccess]);

  // Handle remove success
  useEffect(() => {
    if (removeSuccess) {
      toast.success(removeData.message || "Lecture deleted successfully!");
      navigate(`/dashboard/instructor-course/${courseId}/modules/${moduleId}/lecture`);
    }
  }
    , [removeSuccess, removeData, navigate, courseId, moduleId]);

  
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

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Lecture Title Section */}
        <div className="space-y-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="space-y-2">
            <Label>Lecture Title <span className="text-red-500">*</span></Label>
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
            {/* Lecture Type Selector */}
            <div className="space-y-2">
              <Label>Content Type <span className="text-red-500">*</span></Label>
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

            {/* Free Preview Toggle */}
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

          {/* File Upload Section */}
          <div className="space-y-2">
            <Label>
              {lectureType === "video" ? "Upload Video" : "Upload Document"}
              <span className="text-red-500">*</span>
            </Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <label className="flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                {previewUrl ? (
                  <div className="text-center">
                    {lectureType === "video" ? (
                      <video src={previewUrl} controls className="w-full max-h-64 rounded-lg mb-4" />
                    ) : (
                      <iframe
                        src={previewUrl}
                        className="w-full h-64 rounded-lg mb-4"
                        title="Document preview"
                      />
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
                          ? "Supported formats: MP4, MOV, AVI (Max 1GB)"
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

          {/* Upload Progress */}
          {mediaProgress && (
            <div className="my-4">
              <Progress value={uploadProgress} />
              <p className="text-sm text-gray-500 mt-1">
                {uploadProgress}% uploaded
              </p>
            </div>
          )}

          {/* Upload Success Message */}
          {uploadMediaInfo && (
            <div className="my-4">
              <p className="text-green-600">
                {lectureType === "video" ? "Video" : "Document"} uploaded successfully!
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse md:flex-row justify-between gap-2 mt-8">
          {lectureId && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              className="gap-2"
            >
              {removeLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Trash2 className="h-5 w-5" />
                </>
              )}
              {removeLoading ? "Deleting..." : "Delete Lecture"}
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="gap-2 bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {lectureId ? "Saving..." : "Creating..."}
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                {lectureId ? "Save Changes" : "Create Lecture"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateLectureTab;
