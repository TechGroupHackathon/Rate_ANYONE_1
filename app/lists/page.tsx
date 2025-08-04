"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Heart, Home, Search, User } from "lucide-react";
import Link from "next/link";
import { EnhancedRateModal } from "@/components/enhanced-rate-modal";
import { ReviewCard } from "@/components/review-card";
import { userSession } from "@/lib/userAuth";

// Define the structure for a review, matching the backend
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

export default function ListsPage() {
  const [savedReviews, setSavedReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRateModal, setShowRateModal] = useState(false);

  useEffect(() => {
    async function fetchSavedReviews() {
      setIsLoading(true);
      const user = userSession.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const savedResponse = await fetch(`/api/saved?userId=${user.id}`);
        if (!savedResponse.ok) throw new Error("Failed to fetch saved list");
        const savedData = await savedResponse.json();
        const savedIds = savedData.saved;

        if (savedIds.length > 0) {
          const reviewsResponse = await fetch("/api/reviews");
          if (!reviewsResponse.ok) throw new Error("Failed to fetch reviews");
          const reviewsData = await reviewsResponse.json();
          const allReviews = reviewsData.reviews;

          const userSavedReviews = allReviews.filter((review: Review) => savedIds.includes(review.id));
          setSavedReviews(userSavedReviews);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSavedReviews();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-black">Your Saved Reviews</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <p>Loading saved reviews...</p>
        ) : savedReviews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} isInitiallySaved={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Heart className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">No saved reviews yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Tap the heart icon on any review to save it to your list.
            </p>
            <Link href="/discover">
              <Button className="calm-button-olive px-8 py-3 rounded-full">
                Discover Reviews
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-2 z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Link href="/">
            <button className="bottom-nav-item bottom-nav-inactive">
              <Home className="h-6 w-6" />
              <span className="text-xs font-medium">Home</span>
            </button>
          </Link>

          <Link href="/discover">
            <button className="bottom-nav-item bottom-nav-inactive">
              <Search className="h-6 w-6" />
              <span className="text-xs font-medium">Discover</span>
            </button>
          </Link>

          <button onClick={() => setShowRateModal(true)} className="bottom-nav-item">
            <div className="w-12 h-12 bg-yellow-400 hover:bg-yellow-500 rounded-full flex items-center justify-center mb-1 shadow-lg transition-colors">
              <Plus className="h-6 w-6 text-gray-800" />
            </div>
            <span className="text-xs font-medium text-gray-800">Rate</span>
          </button>

          <button className="bottom-nav-item bottom-nav-active">
            <Heart className="h-6 w-6" />
            <span className="text-xs font-medium">Lists</span>
          </button>

          <Link href="/profile">
            <button className="bottom-nav-item bottom-nav-inactive">
              <User className="h-6 w-6" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Rate Modal */}
      {showRateModal && <EnhancedRateModal onClose={() => setShowRateModal(false)} />}
    </div>
  );
}
