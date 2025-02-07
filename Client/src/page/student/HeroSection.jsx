import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

const HeroSection = () => {
  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat py-64 px-4 text-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80')",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative max-w-3xl mx-auto text-white">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
          Find the Best Courses For You
        </h1>
        <p className="text-lg text-gray-200 mb-8 drop-shadow-md">
          Discover, Learn, and Upskill with our wide range of courses.
        </p>

        <form className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-xl overflow-hidden max-w-xl mx-auto mb-6">
          <Input
            type="text"
            placeholder="Search Courses"
            className="flex-grow border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
          <Button
            type="submit"
            className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            Search
          </Button>
        </form>

        <Button className="bg-white dark:bg-gray-800 text-blue-600 rounded-full hover:bg-gray-200 px-6 py-3">
          Explore Courses
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
