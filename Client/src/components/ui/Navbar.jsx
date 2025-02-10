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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { School, Menu } from "lucide-react";
import React, { useEffect } from "react";
import DarkMode from "@/DarkMode";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";

const Navbar = () => {
  const user = true; // Simulate user authentication state (false = not logged in)
  const navigate = useNavigate();
  // const role = "instructor"; // Simulate user role (e.g., "instructor" or "student")
  const [logoutUser, {data, isSuccess}] = useLogoutUserMutation();

  const logoutHandler = async () => {
    await logoutUser();
  }

  useEffect(()=>{
    if (isSuccess) {
      toast.success(data.message || "User is logout.");
      navigate("/login");
    }
  },[isSuccess])

  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      {/* Desktop Navbar */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        {/* Logo and Brand Name */}
        <div className="flex items-center gap-2">
          <School size={30} />
          <h1 className="hidden md:block font-extrabold text-2xl">Shikha Bazar</h1>
        </div>

        {/* User Icon and Dark Mode Toggle */}
        <div className="flex items-center gap-2">
          {user ? (
            // If user is logged in, show dropdown menu with user options
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>MyProfile</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to="/">
                  <DropdownMenuItem className="cursor-pointer">
                    Home
                  </DropdownMenuItem>
                </Link>
                <Link to="my-learning">
                  <DropdownMenuItem className="cursor-pointer">
                    My Learning
                  </DropdownMenuItem>
                </Link>
                <Link to="profile">
                  <DropdownMenuItem className="cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                </Link>
                <Link to="/">
                <DropdownMenuItem className="cursor-pointer">Dashboard</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button onClick={logoutHandler} type="submit" className="bg-red-500 text-white w-full">
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // If user is not logged in, show login and signup buttons
            <div className="flex items-center gap-2">
              <Button variant="outline">Login</Button>
              <Button>Signup</Button>
            </div>
          )}
          {/* Dark Mode Toggle */}
          <DarkMode />
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <div className="flex items-center gap-2">
          <School size={30} />
          <h1 className="font-extrabold text-2xl">Shikha Bazar</h1>
        </div>
        {/* Mobile Navigation Menu */}
        <MobileNavbar user={user} />
      </div>
    </div>
  );
};

export default Navbar;

// MobileNavbar Component
const MobileNavbar = ({ user }) => {
  const role = "instructor"; // Simulate user role (e.g., "instructor" or "student")

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" className="rounded-full hover:bg-gray-200" variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle>Shikha Bazar</SheetTitle>
        </SheetHeader>
        <Separator className="mr-2" />
        {/* Navigation Options */}
        <nav className="flex flex-col space-y-4">
          <span>My Learning</span>
          <span>Profile</span>
          <p>Dashboard</p>
        </nav>
        {/* Logout Button for Instructors */}
        {role === "instructor" && (
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" className="bg-red-500 text-white">
                Logout
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
