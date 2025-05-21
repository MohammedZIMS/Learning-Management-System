import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const HeroSection = () => {

  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };

  return (
    <div
      className="relative min-h-[600px] flex items-center justify-center px-4 py-24 text-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80')`,
        backgroundSize: 'cover',
      }}
    >
      <div className="max-w-7xl mx-auto relative">
        <div className="space-y-8 mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Transform Your Future Through
            <span className="bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent"> Learning</span>
          </h1>
          <p className="text-xl text-gray-200 font-light max-w-2xl mx-auto">
            Master new skills with industry-leading courses taught by expert instructors
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-2 shadow-2xl">
          <form onSubmit={searchHandler} className="flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you want to learn today?"
              className="flex-grow border-none bg-white/90 dark:bg-gray-900/80 h-14 px-6 rounded-lg text-lg shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500"
            />
            <Button
              type="submit"
              className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-all"
            >
              Search Courses
            </Button>
          </form>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="outline"
            onClick={()=> navigate(`/course/search?query`)}
            className="bg-transparent border-2 border-white/30 hover:border-blue-500 text-white hover:text-white hover:bg-blue-500/10 h-12 px-8 rounded-xl transition-all hover:scale-105"
          >
            Explore Popular Courses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
