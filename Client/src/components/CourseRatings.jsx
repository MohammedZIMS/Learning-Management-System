import React, { useState } from "react";
import { useGetCourseRatingsQuery, useSubmitCourseRatingMutation } from "@/features/api/courseApi";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function CourseRatings({ courseId }) {
  const { data, isLoading } = useGetCourseRatingsQuery(courseId);
  const [submitRating, { isLoading: saving }] = useSubmitCourseRatingMutation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const onSubmit = async () => {
    if (!rating) return;
    try {
      await submitRating({ courseId, rating, comment }).unwrap();
      setComment("");
      setRating(0);
    } catch (error) {
      console.error("Failed to submit rating:", error);
    }
  };

  if (isLoading) return <RatingsSkeleton />;

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Average Rating Section */}
      <div className="text-center p-6 bg-background rounded-xl shadow-sm">
        <h2 className="text-3xl font-bold mb-2">
          {data.averageRating.toFixed(1)}<span className="text-2xl text-muted-foreground">/5</span>
        </h2>
        <div className="flex items-center justify-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={24}
              fill={i < Math.round(data.averageRating) ? "currentColor" : "none"}
              className={`${i < Math.round(data.averageRating) ? "text-yellow-400" : "text-gray-300"} dark:text-yellow-500`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Based on {data.ratings.length} reviews
        </p>
      </div>

      {/* Rating Form */}
      <div className="bg-background p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Share Your Experience</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Button
                key={i}
                variant="ghost"
                size="icon"
                onClick={() => setRating(i + 1)}
                className={`h-12 w-12 rounded-full ${rating > i ? 'bg-yellow-100 hover:bg-yellow-100 dark:bg-yellow-900' : ''}`}
              >
                <Star
                  size={24}
                  fill={rating > i ? "currentColor" : "none"}
                  className={`${rating > i ? "text-yellow-400" : "text-gray-300"} dark:text-yellow-500`}
                />
              </Button>
            ))}
          </div>
          
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you think of this course? (Optional)"
            rows={3}
            className="resize-none"
          />
          
          <Button 
            onClick={onSubmit} 
            disabled={saving || rating === 0}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
          >
            {saving ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Student Reviews</h3>
        {data.ratings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No reviews yet. Be the first to share your thoughts!
          </div>
        ) : (
          data.ratings.map(({ _id, user, rating: r, comment }) => (
            <div key={_id} className="bg-background p-6 rounded-xl shadow-sm">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.photoUrl} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{user.name}</h4>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < r ? "currentColor" : "none"}
                          className={`${i < r ? "text-yellow-400" : "text-gray-300"} dark:text-yellow-500`}
                        />
                      ))}
                    </div>
                  </div>
                  {comment && (
                    <p className="text-muted-foreground">{comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const RatingsSkeleton = () => (
  <div className="space-y-8 max-w-3xl mx-auto">
    <Skeleton className="h-24 w-full rounded-xl" />
    <Skeleton className="h-64 w-full rounded-xl" />
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-xl" />
      ))}
    </div>
  </div>
);
