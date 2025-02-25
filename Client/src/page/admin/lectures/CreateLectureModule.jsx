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
    const [lectureTitle, setLectureTitle] = useState("");
    const params = useParams();
    const courseId = params.courseId; // Get courseId from URL params
    const navigate = useNavigate();

    // Correctly use the mutation hook
    const [createLectureModule, { data, isLoading, isSuccess, error }] = useCreateLectureModuleMutation();

    const { data: lectureData, isLoading: lectureLoading, isError: lectureError, refetch } = useGetCouseLectureModuleQuery(courseId);

    // Handle creating a new lecture module
    const LectureModulehandle = async () => {
        try {
            await createLectureModule({ lectureTitle, courseId });
        } catch (error) {
            console.error("Error creating lecture module:", error);
        }
    };

    console.log(lectureData);


    // Handle API Response
    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Lecture module created successfully.");
        }
        if (error) {
            toast.error(error?.message || "Failed to create lecture module.");
        }
    }, [isSuccess, error, data]);

    return (
        <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
            <Card className="max-w-4xl mx-auto rounded-xl shadow-lg">
                <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">
                            Basic Lecture Module Information
                        </CardTitle>
                        <CardDescription className="mt-2 text-gray-600 dark:text-gray-400">
                            Update your course details below. Click save when you're done.
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    <div className="space-y-8">
                        {/* Lecture Module Title */}
                        <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">Lecture Module Title</Label>
                            <Input
                                type="text"
                                name="lectureTitle"
                                value={lectureTitle}
                                onChange={(e) => setLectureTitle(e.target.value)}
                                placeholder="Enter your Lecture Module title"
                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4">
                            <Button
                                variant="outline"
                                disabled={isLoading}
                                onClick={() => navigate(`/dashboard/instructor-course/${courseId}`)}
                            >
                                Back to Course
                            </Button>
                            <Button
                                disabled={isLoading}
                                onClick={LectureModulehandle}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Create"
                                )}
                            </Button>
                        </div>

                        {/* Display Lecture Modules */}
                        <div className="mt-6">
                            {
                                lectureLoading ? 
                                ( 
                                    <p>Loading lectures...</p> 
                                ) : lectureError ? 
                                ( 
                                    <p>Failed to load lectures.</p> 
                                ) : lectureData.lectures.length === 0 ? 
                                ( 
                                    <p className="text-gray-500 dark:text-gray-400">No lecture modules added yet.</p> 
                                ) : 
                                ( 
                                    lectureData.lectures.map((lecture, index) => (
                                        <LectureModule 
                                            key={lecture._id} 
                                            lecture={lecture}
                                            courseId={courseId}
                                            index={index}
                                        /> 
                                    ))
                                )
                            }
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateLectureModule;
