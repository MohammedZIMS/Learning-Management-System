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

const CreateLectureTab = () => {
  // Local state for lecture form fields
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  // const [description, setDescription] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);
  const [lectureType, setLectureType] = useState("video"); // "video" or "document"
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const params = useParams();
  const { courseId, moduleId, lectureId } = params;

  const navigate = useNavigate();

  // API mutations
  const [editLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation();
  const [removeLecture] = useRemoveLectureMutation();

  // handlers for API calls
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Add file type validation
    const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    const validDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (
      (lectureType === "video" && !validVideoTypes.includes(file.type)) ||
      (lectureType === "document" && !validDocTypes.includes(file.type))
    ) {
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
        setUploadVideoInfo({
          mediaUrl: res.data.data.url,  // Keep consistent field name
          publicId: res.data.data.public_id
        });
        setFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        toast.success("File uploaded successfully");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Failed to upload ${lectureType}`);
    } finally {
      setMediaProgress(false);
    }
  };
  
  const editLectureHandler = async () => {

    await editLecture({
      lectureId,
      moduleId,
      courseId,
      lectureTitle,
      mediaType: lectureType,
      videoInfo: uploadVideoInfo,
      isPreviewFree: isFree,
    }).unwrap();
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Lecture created successfully!");
    }
    if (error) {
      toast.error("Error creating lecture");
    }
  }
  , [data, error, isSuccess]);

  return (
    <div className="flex-1 mx-auto max-w-4xl p-8 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
      <div className="mb-8">
        <h1 className="font-bold text-2xl mb-2 dark:text-white">
           Create New Lecture
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

          {mediaProgress && (
            <div className="my-4">
              <Progress className="text-green-600" value={uploadProgress} />
              <p>{uploadProgress}% uploaded</p>
            </div>
          )}

          {uploadVideoInfo && (
            <div className="my-4">
              <p className="text-green-600">Video uploaded successfully!</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse md:flex-row justify-between gap-2 mt-8">
          <Button
            variant="destructive"
            // onClick={removeLectureHandler}
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

export default CreateLectureTab;
