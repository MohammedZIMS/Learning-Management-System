import { useState } from 'react';
import { 
  ChartNoAxesColumn,
  SquareLibrary,
  Users,
  BookOpen,
  Bookmark,
  Clock,
  Award,
  Menu,
  X,
  Home,
  LayoutDashboard,
  User,
  LogOut
} from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import DarkMode from "@/DarkMode";

const Sidebar = () => {
  const { user } = useSelector(state => state.auth);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen pt-5 ">
      {/* Mobile Menu */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="rounded-full bg-gray-900 text-white hover:bg-gray-800"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] p-0 dark:bg-gray-900">
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="p-4 border-b dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.photoUrl} />
                      <AvatarFallback>
                        {user?.name?.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold dark:text-white">{user?.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </div>
                  {/* <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button> */}
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="flex-1 overflow-y-auto p-4">
                {user?.role === "instructor" ? (
                  <InstructorSidebar mobileClose={() => setIsMobileOpen(false)} />
                ) : (
                  <StudentSidebar mobileClose={() => setIsMobileOpen(false)} />
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <DarkMode />
                  <Button
                    variant="ghost"
                    onClick={() => {
                      // Add logout logic here
                      setIsMobileOpen(false);
                    }}
                    className="text-red-600 dark:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className='hidden lg:block w-[250px] border-r dark:border-gray-800 p-5 sticky top-0 h-screen'>
        <div className="space-y-8">
          {/* Profile Section */}
          <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.photoUrl} />
              <AvatarFallback>
                {user?.name?.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold dark:text-white">{user?.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {user?.role}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            {user?.role === "instructor" ? (
              <InstructorSidebar />
            ) : (
              <StudentSidebar />
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// Instructor Navigation
const InstructorSidebar = ({ mobileClose }) => {
  return (
    <>
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-2">
          Teaching
        </h4>
        <nav className="space-y-1">
          <NavItem 
            to="/dashboard/instructor-dashboard"
            icon={<ChartNoAxesColumn className="text-blue-500" />}
            label="Dashboard"
            onClick={mobileClose}
          />
          <NavItem
            to="/dashboard/instructor-course"
            icon={<SquareLibrary className="text-green-500" />}
            label="My Courses"
            onClick={mobileClose}
          />
          <NavItem
            to="/dashboard/instructor-course/create-course"
            icon={<BookOpen className="text-yellow-500" />}
            label="Create Course"
            onClick={mobileClose}
          />
        </nav>
      </div>
    </>
  );
};

// Student Navigation
const StudentSidebar = ({ mobileClose }) => {
  return (
    <>
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-2">
          Learning
        </h4>
        <nav className="space-y-1">
          <NavItem
            to="/dashboard/my-courses"
            icon={<BookOpen className="text-blue-500" />}
            label="My Courses"
            onClick={mobileClose}
          />
          <NavItem
            to="/dashboard/saved-courses"
            icon={<Bookmark className="text-purple-500" />}
            label="Saved Courses"
            onClick={mobileClose}
          />
          <NavItem
            to="/dashboard/learning-history"
            icon={<Clock className="text-yellow-500" />}
            label="Learning History"
            onClick={mobileClose}
          />
        </nav>
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-2">
          Achievements
        </h4>
        <nav className="space-y-1">
          <NavItem
            to="/dashboard/certificates"
            icon={<Award className="text-green-500" />}
            label="Certificates"
            onClick={mobileClose}
          />
        </nav>
      </div>
    </>
  );
};

// Reusable Nav Item Component
const NavItem = ({ to, icon, label, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
  >
    <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
    <span>{label}</span>
  </Link>
);

export default Sidebar;
