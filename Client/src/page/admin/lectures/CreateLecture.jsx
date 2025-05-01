import React from 'react'
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Lecture from './Lecture';
import { toast } from 'sonner';
import { useCreateLectureMutation, useGetLecturesByModuleQuery } from '@/features/api/courseApi';

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();

  const [createLecture, { isLoading, isSuccess, error }] = useCreateLectureMutation();
  const { 
    data: lectureData, 
    isLoading: lectureLoading, 
    isError: lectureError,
    refetch 
  } = useGetLecturesByModuleQuery({ courseId, moduleId }); // Pass both IDs

  const handleCreateLecture = async () => {
    if (!lectureTitle.trim()) {
      toast.error("Please enter a lecture title");
      return;
    }
    
    try {
      await createLecture({ 
        lectureTitle, 
        courseId,
        moduleId 
      }).unwrap();
      setLectureTitle("");
      refetch();
    } catch (error) {
      console.error("Lecture creation error:", error);
      // Error will be handled by the useEffect
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Lecture created successfully");
    }
    if (error) {
      toast.error(error?.data?.message || "Failed to create lecture");
    }
  }, [isSuccess, error]);

  return (
    <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <Card className="max-w-4xl mx-auto rounded-xl shadow-lg">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">
              Lecture Management
            </CardTitle>
            <CardDescription className="mt-2 text-gray-600 dark:text-gray-400">
              Create and manage lectures within this module
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-8">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Lecture Title</Label>
              <Input
                type="text"
                value={lectureTitle}
                onChange={(e) => setLectureTitle(e.target.value)}
                placeholder="Enter lecture title"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                disabled={isLoading}
                onClick={() => navigate(`/dashboard/instructor-course/${courseId}/modules`)}
              >
                Back to Module
              </Button>
              <Button
                disabled={isLoading || !lectureTitle.trim()}
                onClick={handleCreateLecture}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : "Create Lecture"}
              </Button>
            </div>

            <div className="mt-6">
              {lectureLoading ? (
                <p>Loading lectures...</p>
              ) : lectureError ? (
                <p>Error loading lectures</p>
              ) : lectureData?.lectures?.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No lectures in this module yet</p>
              ) : (
                lectureData?.lectures?.map((lecture, index) => (
                  <Lecture
                    key={lecture._id}
                    lecture={lecture}
                    courseId={courseId}
                    moduleId={moduleId}
                    index={index}
                  />
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateLecture;
