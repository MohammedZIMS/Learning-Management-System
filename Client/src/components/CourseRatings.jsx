import React, { useState } from "react";
import { useGetCourseRatingsQuery, useSubmitCourseRatingMutation } from "@/features/api/courseApi";
import { Star } from "lucide-react";
import { Button} from "@/components/ui/button";
import { Textarea } from "./ui/textarea";

export default function CourseRatings({ courseId }) {
  const { data, isLoading } = useGetCourseRatingsQuery(courseId);
  const [submitRating, { isLoading: saving }] = useSubmitCourseRatingMutation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  if (isLoading) return <p>Loading ratings…</p>;

  const onSubmit = async () => {
    if (!rating) return alert("Select a star rating.");
    await submitRating({ courseId, rating, comment });
    setComment("");
    setRating(0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold">Average Rating: {data.averageRating.toFixed(1)} / 5</h3>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={20}
              fill={i < Math.round(data.averageRating) ? "gold" : "none"}
              stroke="gold"
            />
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Submit Your Rating</h4>
        <div className="flex mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={30}
              className={`cursor-pointer ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
              onClick={() => setRating(i + 1)}
            />
          ))}
        </div>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave a comment (optional)"
          rows={3}
        />
        <Button onClick={onSubmit} disabled={saving}>
          {saving ? "Saving…" : "Submit Rating"}
        </Button>
      </div>

      <div>
        <h4 className="font-medium mb-2">All Reviews</h4>
        <div className="space-y-4">
          {data.ratings.map(({ _id, user, rating: r, comment }) => (
            <div key={_id} className="border p-4 rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <img src={user.photoUrl} alt={user.name} className="h-6 w-6 rounded-full" />
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < r ? "gold" : "none"}
                    stroke="gold"
                  />
                ))}
              </div>
              {comment && <p className="text-sm text-gray-700">{comment}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
