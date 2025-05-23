import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Home,
  BookOpen,
  User,
  LayoutDashboard,
  LogIn,
  LogOut,
  UserPlus
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { School, Menu } from "lucide-react";
import React, { useEffect } from "react";
import DarkMode from "@/DarkMode";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector(state => state.auth); // Fixed Store => state
  const navigate = useNavigate();
  const [logoutUser, { isSuccess }] = useLogoutUserMutation();

  const logoutHandler = async () => {
    await logoutUser();
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Logged out successfully");
      navigate("/login");
    }
  }, [isSuccess, navigate]);

  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      {/* Desktop Navbar */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        {/* Logo and Brand Name */}
        <div className="flex items-center gap-2">
          <Link to="/">
            <School size={30} />
          </Link>
          <Link to="/">
            <h1 className="hidden md:block font-extrabold text-2xl">Shikha Bazar</h1>
          </Link>
        </div>

        {/* User Icon and Dark Mode Toggle */}
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src={user.photoUrl || "https://github.com/shadcn.png"} />
                  <AvatarFallback>
                    {user?.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 dark:bg-gray-900">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to="/">
                  <DropdownMenuItem className="cursor-pointer">
                    <Home size={20} />
                    Home
                  </DropdownMenuItem>
                </Link>
                <Link to="/my-learning">
                  <DropdownMenuItem className="cursor-pointer">
                    <BookOpen size={20} />
                    My Learning
                  </DropdownMenuItem>
                </Link>
                <Link to="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <User size={20} />
                    Profile
                  </DropdownMenuItem>
                </Link>
                {user?.role === "instructor" ? (
                  <Link to="/dashboard/instructor-dashboard">
                    <DropdownMenuItem className="cursor-pointer">
                      <LayoutDashboard size={20} />
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                ) : (
                  // <Link to="/dashboard">
                  //   <DropdownMenuItem className="cursor-pointer">
                  //     Student Dashboard
                  //   </DropdownMenuItem>
                  // </Link>
                  <></>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button 
                    onClick={logoutHandler} 
                    className="bg-red-500 hover:bg-red-600 text-white w-full"
                  >
                    <LogOut size={18} />
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/login")}>Login</Button>
              <Button onClick={() => navigate("/login")}>Signup</Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <div className="flex items-center gap-2">
          <School size={30} />
          <h1 className="font-extrabold text-2xl">Shikha Bazar</h1>
        </div>
        <MobileNavbar user={user} logoutHandler={logoutHandler} />
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = ({ user, logoutHandler }) => {
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col dark:bg-gray-900 p-0">
        {/* User Profile Section */}
        {user && (
          <div className="flex items-center gap-4 p-6 border-b dark:border-gray-800">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.photoUrl} />
              <AvatarFallback>
                {user?.name?.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold dark:text-white">{user.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.role?.toUpperCase()}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          <nav className="space-y-1">
            <SheetClose asChild>
              <Link 
                to="/" 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <Home size={20} />
                <span>Home</span>
              </Link>
            </SheetClose>

            {user && (
              <>
                <SheetClose asChild>
                  <Link
                    to="/my-learning"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    <BookOpen size={20} />
                    <span>My Learning</span>
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    <User size={20} />
                    <span>Profile</span>
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  {user?.role === "instructor" ? (
                    <Link
                    to={user.role === 'instructor' ? '/dashboard/instructor-dashboard' : '/'}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                  </Link>
                  ):(
                    <></>
                  )
                }
                </SheetClose>
              </>
            )}
          </nav>

          {/* Dark Mode Toggle */}
          <div className="p-3 mt-4">
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              <span className="text-sm">Dark Mode</span>
              <DarkMode />
            </div>
          </div>
        </div>

        {/* Auth Section */}
        <div className="p-4 border-t dark:border-gray-800">
          {user ? (
            <Button 
              onClick={logoutHandler}
              variant="ghost"
              className="w-full gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </Button>
          ) : (
            <div className="grid gap-2">
              <SheetClose asChild>
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full gap-2"
                >
                  <LogIn size={18} />
                  <span>Sign In</span>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button 
                  onClick={() => navigate('/register')}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <UserPlus size={18} />
                  <span>Create Account</span>
                </Button>
              </SheetClose>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
