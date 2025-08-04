"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Settings, Star, MoreHorizontal, Home, Search, Plus, Heart, User, Video } from "lucide-react";
import Link from "next/link";
import { EnhancedRateModal } from "@/components/enhanced-rate-modal";
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

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showRateModal, setShowRateModal] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loggedInUser = userSession.getUser();
    setUser(loggedInUser);

    async function fetchReviews() {
      try {
        const response = await fetch("/api/reviews");
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        // Filter reviews for the current user
        const userReviews = data.reviews.filter((review: Review) => review.userId === loggedInUser?.id);
        setReviews(userReviews);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    if (loggedInUser) {
      fetchReviews();
    } else {
      setIsLoading(false);
    }
  }, []);

  const displayName = user ? user.name : "Guest";

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-black">Profile</h1>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="flex items-start space-x-6 mb-8">
          <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-2xl font-bold text-white">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-black mb-2">{displayName}</h2>
            <div className="flex items-center space-x-6 mb-6">
              <div className="text-center">
                <div className="text-xl font-bold text-black">{reviews.length}</div>
                <div className="text-sm text-gray-600">Reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-gray-50 border border-gray-200 rounded-xl h-auto p-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-600 rounded-lg px-4 py-2"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-600 rounded-lg px-4 py-2"
            >
              Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
             <h3 className="text-xl font-bold text-black mb-4">My Reviews</h3>
             <ReviewsGrid reviews={reviews} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <ReviewsGrid reviews={reviews} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
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

          <Link href="/lists">
            <button className="bottom-nav-item bottom-nav-inactive">
              <Heart className="h-6 w-6" />
              <span className="text-xs font-medium">Lists</span>
            </button>
          </Link>

          <button className="bottom-nav-item bottom-nav-active">
            <User className="h-6 w-6" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>

      {showRateModal && <EnhancedRateModal onClose={() => {
        setShowRateModal(false);
        // Refresh reviews after modal closes
        const loggedInUser = userSession.getUser();
        if (loggedInUser) {
            setIsLoading(true);
            fetch("/api/reviews").then(res => res.json()).then(data => {
                const userReviews = data.reviews.filter((review: Review) => review.userId === loggedInUser?.id);
                setReviews(userReviews);
                setIsLoading(false);
            });
        }
      }} />}
    </div>
  );
}

function ReviewsGrid({ reviews, isLoading }: { reviews: Review[], isLoading: boolean }) {
  if (isLoading) {
    return <p>Loading reviews...</p>;
  }

  if (reviews.length === 0) {
    return <p>No reviews found. Why not add one?</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reviews.map(review => (
        <Card key={review.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-square w-full bg-gray-100">
              {review.media && review.media.length > 0 && (
                review.media[0].type === 'image' ? (
                  <img src={`/${review.media[0].path}`} alt={review.caption} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <Video className="h-16 w-16 text-white" />
                  </div>
                )
              )}
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
      ))}
    </div>
  );
}
