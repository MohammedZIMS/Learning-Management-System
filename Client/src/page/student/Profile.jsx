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
import { Loader2, SquareUser } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import Course from './Course';



const Profile = () => {
    const isLoading = false;
    const enrolledCourses = [1];
    return (
        <div className='max-w-4xl mx-auto px-4 my-24'>
            <div className="border-b dark:border-gray-800 pb-4 mb-8">
                <h1 className="font-bold text-3xl flex items-center gap-3">
                    <SquareUser className="w-8 h-8 text-blue-600" />
                    Profile
                </h1>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">

                <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>MyProfile</AvatarFallback>
                    </Avatar>
                </div>
                <div>
                    <div className="mb-2">
                        <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                            Name:
                            <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                                Mohammed ZIMS
                            </span>
                        </h1>
                    </div>


                    <div className="mb-2">
                        <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                            Email:
                            <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                                zims@gmail.com
                            </span>
                        </h1>
                    </div>
                    <div className="mb-2">
                        <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                            Account Type:
                            <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                                Student
                            </span>
                        </h1>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" className="mt-2">Edit Profile</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                                <DialogDescription>
                                    Make changes to profile here. Click sava when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>Name</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter your name"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>Profile Photo</Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button disabled={isLoading}>
                                    {
                                        isLoading ? 
                                        (
                                            <>
                                                <Loader2 className='mr-2 h-4 w-4 animate-spin'/> Please wait
                                            </>
                                        ):
                                        "Save Change"
                                    }
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div>
                <h1 className="font-medium text-lg">Courses you're enrolled in</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
                    {
                        enrolledCourses.length === 0 ? <h1>You haven't enrolled yet</h1> :
                        (
                            enrolledCourses.map((course, index) => <Course key={index}/>)
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Profile