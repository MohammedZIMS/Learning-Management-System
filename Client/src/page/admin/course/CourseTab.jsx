import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from 'react-router-dom';
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, UploadCloud } from "lucide-react";
import React, { act, useEffect, useState } from "react";
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation} from "@/features/api/courseApi";
import { toast } from 'sonner';

const CourseTab = () => {
    const navigate = useNavigate();

    // State to hold course fields
    const [input, setInput] = useState({
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: "",
    });

    const params = useParams();
    const courseId = params.courseId;

    const [publishCourse,{}] = usePublishCourseMutation();

    // Fetch course details by ID
    const { data: courseByIdData, isLoading: courseByIdLoading, refetch } = useGetCourseByIdQuery(courseId);

    useEffect(() => {
        if (courseByIdData?.course) {
            const course = courseByIdData.course;
            setInput({
                courseTitle: course.courseTitle,
                subTitle: course.subTitle,
                description: course.description,
                category: course.category,
                courseLevel: course.courseLevel,
                coursePrice: course.coursePrice,
                courseThumbnail: "",
            });
        }
    }, [courseByIdData]);

    const [editCourse, { data, isLoading: courseLoading, isSuccess, error }] = useEditCourseMutation();

    // Function to handle publish status toggle
    const publishStatusHandler = async (action) => {
        try {
            const response = await publishCourse({ courseId, isPublished: action });;
            if (response.data) {
            toast.success(response.data.message || "Course publish status updated successfully.");
            }
        } catch (error) {
            toast.error(response.error.data.message || "Failed to update publish status.");
        }
    };


    // State for thumbnail preview URL
    const [previewThumbnail, setPreviewThumbnail] = useState("");

    // Loading state for save operation
    const [isLoading, setIsLoading] = useState(false);

    // Handle text input changes
    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };
    // Select Dropdown Handlers
    const selectCategory = (value) => {
        setInput({ ...input, category: value });
    };
    const selectCourseLevel = (value) => {
        setInput({ ...input, courseLevel: value });
    };

    // Handle file selection and set preview
    const handleThumbnailSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("File size must be less than 5MB");
                return;
            }
        }
        setInput({ ...input, courseThumbnail: file });
        // Convert file to base64 for preview
        const fileReader = new FileReader();
        fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
        fileReader.readAsDataURL(file);
    };

    // Handle Course Update
    const updataCourseHandler = async () => {
        if (!input.courseTitle || !input.category) {
            toast.error("Please fill all required fields.");
            return;
        }

        console.log(input);

        // FormData to send file along with text fields
        const formData = new FormData();
        formData.append("courseTitle", input.courseTitle);
        formData.append("category", input.category);
        formData.append("description", input.description);
        formData.append("courseLevel", input.courseLevel); 
        formData.append("coursePrice", input.coursePrice); 
        if (input.courseThumbnail) {
            formData.append("courseThumbnail", input.courseThumbnail); // ✅ Field name matches backend
        }

        // Call API Mutation
        await editCourse({ formData, courseId });
    }

    // Handle API Response
    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Course updated successfully.");
            navigate("/dashboard/instructor-course");
        }
        if (error) {
            toast.error(error?.data?.message || "Failed to update. Please try again.");
        }
    }, [isSuccess, error, data, navigate]);


    return (
        <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
            <Card className="max-w-4xl mx-auto rounded-xl shadow-lg">
                <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">
                            Basic Course Information
                        </CardTitle>
                        <CardDescription className="mt-2 text-gray-600 dark:text-gray-400">
                            Update your course details below. Click save when you're done.
                        </CardDescription>
                    </div>
                    <div className="mt-4 md:mt-0 space-x-2">
                        <Button disabled={courseByIdData?.course?.modules.length === 0} variant="outline" onClick={() => publishStatusHandler(courseByIdData?.course.isPublished ? "false" : "true")}>
                            {courseByIdData?.course?.isPublished ? "Unpublish" : "Publish"}
                        </Button>
                        <Button className="bg-red-600 hover:bg-red-700 text-white">
                            Remove Course
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-8">
                        {/* Course Title */}
                        <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">Course Title</Label>
                            <Input
                                type="text"
                                name="courseTitle"
                                value={input.courseTitle}
                                onChange={changeEventHandler}
                                placeholder="Enter your course title"
                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                            />
                        </div>
                        {/* Course Subtitle */}
                        <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">Course Subtitle</Label>
                            <Input
                                type="text"
                                name="subTitle"
                                value={input.subTitle}
                                onChange={changeEventHandler}
                                placeholder="Enter your course subtitle"
                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                            />
                        </div>
                        {/* Description */}
                        <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">Description</Label>
                            <RichTextEditor input={input} setInput={setInput} />
                        </div>
                        {/* Category, Level, Price */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label className="text-gray-700 dark:text-gray-300">Category</Label>
                                <Select onValueChange={selectCategory}>
                                    <SelectTrigger className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg shadow-lg dark:bg-gray-800">
                                        <SelectGroup>
                                            <SelectLabel className="text-gray-500 dark:text-gray-400">Categories</SelectLabel>
                                            <SelectItem value="data-science">Data Science</SelectItem>
                                            <SelectItem value="artificial-intelligence">Artificial Intelligence</SelectItem>
                                            <SelectItem value="frontend-development">Frontend Development</SelectItem>
                                            <SelectItem value="fullstack-development">Fullstack Development</SelectItem>
                                            <SelectItem value="mern-stack-development">MERN Stack Development</SelectItem>
                                            <SelectItem value="backend-development">Backend Development</SelectItem>
                                            <SelectItem value="html">HTML</SelectItem>
                                            <SelectItem value="css">CSS</SelectItem>
                                            <SelectItem value="javascript">JavaScript</SelectItem>
                                            <SelectItem value="typescript">TypeScript</SelectItem>
                                            <SelectItem value="node-js">Node.js</SelectItem>
                                            <SelectItem value="nextjs">Next JS</SelectItem>
                                            <SelectItem value="python">Python</SelectItem>
                                            <SelectItem value="docker">Docker</SelectItem>
                                            <SelectItem value="react">React</SelectItem>
                                            <SelectItem value="aws">AWS</SelectItem>
                                            <SelectItem value="graphql">GraphQL</SelectItem>
                                            <SelectItem value="kubernetes">Kubernetes</SelectItem>
                                            <SelectItem value="sql">SQL</SelectItem>
                                            <SelectItem value="mongodb">MongoDB</SelectItem>
                                            <SelectItem value="postgresql">PostgreSQL</SelectItem>
                                            <SelectItem value="rest-api">REST API</SelectItem>
                                            <SelectItem value="git">Git</SelectItem>
                                            <SelectItem value="redux">Redux</SelectItem>
                                            <SelectItem value="nestjs">NestJS</SelectItem>
                                            <SelectItem value="machine-learning">Machine Learning</SelectItem>
                                            <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                                            <SelectItem value="ui-ux">UI/UX Design</SelectItem>
                                            <SelectItem value="react-native">React Native</SelectItem>
                                            <SelectItem value="web3">Web3</SelectItem>
                                            <SelectItem value="blockchain">Blockchain</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-700 dark:text-gray-300">Course Level</Label>
                                <Select onValueChange={selectCourseLevel}>
                                    <SelectTrigger className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800">
                                        <SelectValue placeholder="Select a course level" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg shadow-lg dark:bg-gray-800">
                                        <SelectGroup>
                                            <SelectLabel>Course Level</SelectLabel>
                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Advanced">Advance</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-700 dark:text-gray-300">Price</Label>
                                <Input
                                    type="number"
                                    name="coursePrice"
                                    value={input.coursePrice}
                                    onChange={changeEventHandler}
                                    placeholder="Enter your course price"
                                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                                />
                            </div>
                        </div>

                        {/* Thumbnail Upload */}
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
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailSelect}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4">
                            <Button
                                variant="outline"
                                disabled={courseLoading}
                                onClick={() => navigate("/dashboard/instructor-course")}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={updataCourseHandler}
                                disabled={courseLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-all"
                            >
                                {courseLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save"
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CourseTab;
