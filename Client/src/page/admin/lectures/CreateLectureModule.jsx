import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import LectureModule from './LectureModule';
import { useCreateLectureModuleMutation, useGetCouseLectureModuleQuery } from '@/features/api/courseApi';
import { toast } from 'sonner';

const CreateLectureModule = () => {
    const [title, setTitle] = useState("");
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [createLectureModule, { isLoading, isSuccess, error }] = useCreateLectureModuleMutation();
    const {
        data: lectureData,
        isLoading: lectureLoading,
        isError: lectureError,
        refetch
    } = useGetCouseLectureModuleQuery(courseId);

    const handleCreateModule = async () => {
        if (!title.trim()) {
            toast.error("Please enter a module title");
            return;
        }

        try {
            await createLectureModule({ title, courseId });
            setTitle("");
        } catch (error) {
            console.error("Error creating lecture module:", error);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Module created successfully");
            refetch();
        }
        if (error) {
            toast.error(error?.data?.message || "Failed to create module");
        }
    }, [isSuccess, error]);

    const modules = lectureData?.modules || [];
    const hasModules = modules.length > 0;

    return (
        <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
            <Card className="max-w-4xl mx-auto rounded-xl shadow-lg">
                <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">
                            Course Modules
                        </CardTitle>
                        <CardDescription className="mt-2 text-gray-600 dark:text-gray-400">
                            Manage and organize your course content
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">Module Title</Label>
                            <Input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter module title"
                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button
                                variant="outline"
                                disabled={isLoading}
                                onClick={() => navigate(`/dashboard/instructor-course/${courseId}`)}
                            >
                                Back to Course
                            </Button>
                            <Button
                                disabled={isLoading || !title.trim()}
                                onClick={handleCreateModule}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : "Create Module"}
                            </Button>
                        </div>

                        <div className="mt-6">
                            {lectureLoading ? (
                                <p>Loading modules...</p>
                            ) : lectureError ? (
                                <p>Error loading modules</p>
                            ) : !hasModules ? (
                                <p className="text-gray-500 dark:text-gray-400">
                                    No modules created yet
                                </p>
                            ) : (
                                // In CreateLectureModule.jsx
                                modules.map((module, index) => (
                                    <LectureModule
                                        key={module._id}
                                        module={module}  // This should now match
                                        courseId={courseId}
                                        index={index}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateLectureModule;
