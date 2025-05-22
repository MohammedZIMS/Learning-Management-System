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
                    Home
                  </DropdownMenuItem>
                </Link>
                <Link to="/my-learning">
                  <DropdownMenuItem className="cursor-pointer">
                    My Learning
                  </DropdownMenuItem>
                </Link>
                <Link to="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                </Link>
                {user?.role === "instructor" ? (
                  <Link to="/dashboard/instructor-dashboard">
                    <DropdownMenuItem className="cursor-pointer">
                      Instructor Dashboard
                    </DropdownMenuItem>
                  </Link>
                ) : (
                  <Link to="/dashboard">
                    <DropdownMenuItem className="cursor-pointer">
                      Student Dashboard
                    </DropdownMenuItem>
                  </Link>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button 
                    onClick={logoutHandler} 
                    className="bg-red-500 hover:bg-red-600 text-white w-full"
                  >
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
        <Button size="icon" className="rounded-full hover:bg-gray-200" variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col dark:bg-gray-900 dark:text-white">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle className="dark:text-white">Shikha Bazar</SheetTitle>
        </SheetHeader>
        <Separator className="my-4 dark:border-gray-700" />
        
        <nav className="flex flex-col space-y-4 flex-grow">
          <SheetClose asChild>
            <Link to="/" className="hover:text-blue-500">Home</Link>
          </SheetClose>
          
          {user && (
            <>
              <SheetClose asChild>
                <Link to="/my-learning" className="hover:text-blue-500">My Learning</Link>
              </SheetClose>
              <SheetClose asChild>
                <Link to="/profile" className="hover:text-blue-500">Profile</Link>
              </SheetClose>
              <SheetClose asChild>
                <Link to={user?.role === "instructor" ? "/dashboard" : "/dashboard"} 
                      className="hover:text-blue-500">
                  Dashboard
                </Link>
              </SheetClose>
            </>
          )}
        </nav>

        <SheetFooter className="mt-auto">
          {user ? (
            <SheetClose asChild>
              <Button 
                onClick={logoutHandler}
                className="bg-red-500 hover:bg-red-600 text-white w-full"
              >
                Logout
              </Button>
            </SheetClose>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              <SheetClose asChild>
                <Button onClick={() => navigate("/login")} className="w-full">
                  Login
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button onClick={() => navigate("/login")} variant="outline" className="w-full">
                  Signup
                </Button>
              </SheetClose>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
