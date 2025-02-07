import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, SquareUser, Pencil, BookOpen } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import Course from './Course';
// import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";



const Profile = () => {
    const isLoading = false;
    const enrolledCourses = [1, 2, 3];

    return (
        <div className='max-w-6xl mx-auto px-4 md:px-6 my-24'>
            {/* Profile Header */}
            <div className="border-b dark:border-gray-800 pb-4 mb-8">
                <h1 className="font-bold text-3xl flex items-center gap-3">
                    <SquareUser className="w-8 h-8 text-blue-600" />
                    My Learning
                </h1>
            </div>

            {/* Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Profile Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                        <div className="flex flex-col items-center mb-6">
                            <Avatar className="h-32 w-32 mb-4 border-4 border-blue-100 dark:border-gray-700">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback className="text-2xl">MZ</AvatarFallback>
                            </Avatar>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="gap-2">
                                        <Pencil className="w-4 h-4" />
                                        Edit Profile
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="rounded-2xl max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl">Edit Profile</DialogTitle>
                                        <DialogDescription>
                                            Update your profile information
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-6 py-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Name</Label>
                                            <Input
                                                placeholder="Mohammed ZIMS"
                                                className="h-12 rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Profile Photo</Label>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                className="h-12 rounded-xl file:text-sm"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button className="w-full h-12 rounded-xl gap-2" disabled={isLoading}>
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                "Save Changes"
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Name</h3>
                                <p className="font-medium">Mohammed ZIMS</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Email</h3>
                                <p className="font-medium">zims@gmail.com</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Account Type</h3>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                        Student
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Enrolled Courses */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center gap-3 mb-8">
                            <BookOpen className="w-8 h-8 text-blue-600" />
                            <h2 className="text-2xl font-bold">Enrolled Courses</h2>
                        </div>

                        {enrolledCourses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center min-h-[300px] text-center py-12">
                                <div className="mb-6 p-6 bg-blue-100 dark:bg-blue-900 rounded-full">
                                    <BookOpen className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No Enrolled Courses</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    You haven't enrolled in any courses yet
                                </p>
                                <Button className="gap-2">
                                    Browse Courses
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {enrolledCourses.map((course, index) => (
                                    <Course key={index} className="hover:shadow-lg transition-shadow" />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
