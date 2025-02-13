import { 
  ChartNoAxesColumn, 
  SquareLibrary,
  Users,
  DollarSign,
  Settings,
  BookOpen,
  FileText,
  LifeBuoy,
  Bookmark,
  Clock,
  Award
} from 'lucide-react'
import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { user } = useSelector(state => state.auth);

  return (
    <div className="flex min-h-screen pt-5 mt-10">
      {/* Sidebar */}
      <div className='hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700 p-5 sticky top-0 h-screen'>
        {/* Profile Section */}
        <div className="flex items-center gap-3 p-4 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.photoUrl} />
            <AvatarFallback>
              {user?.name?.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{user?.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {user?.role}
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="space-y-6">
          {user?.role === "instructor" ? (
            <InstructorSidebar />
          ) : (
            <StudentSidebar />
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <Outlet/>
        </div>
      </div>
    </div>
  );
};

// Instructor Sidebar
const InstructorSidebar = () => {
  return (
    <>
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-2">
          Teaching
        </h4>
        <nav className="space-y-1">
          <Link 
            to="/dashboard/instructor-dashboard" 
            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
          >
            <ChartNoAxesColumn size={20} className="text-blue-500" />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/dashboard/instructor-course" 
            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
          >
            <SquareLibrary size={20} className="text-green-500" />
            <span>My Courses</span>
          </Link>
          <Link 
            to="/dashboard/students" 
            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
          >
            <Users size={20} className="text-purple-500" />
            <span>Students</span>
          </Link>
        </nav>
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-2">
          Content
        </h4>
        <nav className="space-y-1">
          <Link 
            to="/dashboard/instructor-course/create-course" 
            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
          >
            <BookOpen size={20} className="text-yellow-500" />
            <span>Create Course</span>
          </Link>
          <Link 
            to="/dashboard/assignments" 
            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
          >
            <FileText size={20} className="text-pink-500" />
            <span>Assignments</span>
          </Link>
        </nav>
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-2">
          Financial
        </h4>
        <nav className="space-y-1">
          <Link 
            to="/dashboard/earnings" 
            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
          >
            <DollarSign size={20} className="text-green-500" />
            <span>Earnings</span>
          </Link>
        </nav>
      </div>
    </>
  );
};

// Student Sidebar
const StudentSidebar = () => {
  return (
    <>
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-2">
          Learning
        </h4>
        <nav className="space-y-1">
          <Link 
            to="/dashboard/my-courses" 
            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
          >
            <BookOpen size={20} className="text-blue-500" />
            <span>My Courses</span>
          </Link>
          <Link 
            to="/dashboard/saved-courses" 
            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
          >
            <Bookmark size={20} className="text-purple-500" />
            <span>Saved Courses</span>
          </Link>
          <Link 
            to="/dashboard/learning-history" 
            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
          >
            <Clock size={20} className="text-yellow-500" />
            <span>Learning History</span>
          </Link>
        </nav>
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-2">
          Achievements
        </h4>
        <nav className="space-y-1">
          <Link 
            to="/dashboard/certificates" 
            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
          >
            <Award size={20} className="text-green-500" />
            <span>Certificates</span>
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
