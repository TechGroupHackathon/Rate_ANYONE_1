"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Video, Heart } from "lucide-react";
import { userSession } from "@/lib/userAuth";

interface Review {
  id: string;
  userId: string;
  itemType: string;
  rating: number;
  caption: string;
  media: {
    type: "image" | "video";
    path: string;
  }[];
  createdAt: string;
}

interface ReviewCardProps {
  review: Review;
  isInitiallySaved: boolean;
}

export function ReviewCard({ review, isInitiallySaved }: ReviewCardProps) {
  const [isSaved, setIsSaved] = useState(isInitiallySaved);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSaveToggle = async () => {
    const user = userSession.getUser();
    if (!user) {
      // Or show a login prompt
      return;
    }

    setIsProcessing(true);
    try {
      await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, reviewId: review.id }),
      });
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Failed to save review:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-square w-full bg-gray-100 relative">
          {review.media && review.media.length > 0 ? (
            review.media[0].type === 'image' ? (
              <img src={`/${review.media[0].path}`} alt={review.caption} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <Video className="h-16 w-16 text-white" />
              </div>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full"
            onClick={handleSaveToggle}
            disabled={isProcessing}
          >
            <Heart className={`h-5 w-5 ${isSaved ? "fill-red-500 text-red-500" : "text-white"}`} />
          </Button>
        </div>
        <div className="p-4">
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-current" : "text-gray-400"}`}
              />
            ))}
          </div>
          <p className="text-gray-700 text-sm line-clamp-2">{review.caption}</p>
          <p className="text-gray-500 text-xs mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
