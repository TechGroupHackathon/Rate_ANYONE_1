"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Search, Filter, Home, User, Plus, Heart } from "lucide-react";
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
  keywords?: string[];
  media: {
    type: "image" | "video";
    path: string;
  }[];
  createdAt: string;
}

export default function DiscoverPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [savedReviewIds, setSavedReviewIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [showRateModal, setShowRateModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const reviewsResponse = await fetch("/api/reviews");
        if (!reviewsResponse.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.reviews);

        const user = userSession.getUser();
        if (user) {
          const savedResponse = await fetch(`/api/saved?userId=${user.id}`);
          if (savedResponse.ok) {
            const savedData = await savedResponse.json();
            setSavedReviewIds(savedData.saved);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const categories = useMemo(() => {
    const allCategories = reviews.map(r => r.itemType);
    return ["all", ...Array.from(new Set(allCategories))];
  }, [reviews]);

  const filteredAndSortedReviews = useMemo(() => {
    const filtered = reviews.filter((review) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const matchesSearch = review.caption.toLowerCase().includes(lowerCaseQuery) ||
                            (review.keywords && review.keywords.some(k => k.toLowerCase().includes(lowerCaseQuery)));
      const matchesCategory = selectedCategory === "all" || review.itemType === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "createdAt":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
  }, [searchQuery, selectedCategory, sortBy, reviews]);

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
            <h1 className="text-2xl font-bold text-black">Discover</h1>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="space-y-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search by caption or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-gray-50 border-gray-200 text-black placeholder:text-gray-500 focus:border-gray-300 rounded-xl"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-gray-50 border-gray-200 text-black rounded-xl">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 rounded-xl">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-black hover:bg-gray-50 capitalize">
                    {category.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-gray-50 border-gray-200 text-black rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 rounded-xl">
                <SelectItem value="rating" className="text-black hover:bg-gray-50">
                  Highest Rated
                </SelectItem>
                <SelectItem value="createdAt" className="text-black hover:bg-gray-50">
                  Most Recent
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div>
          {isLoading ? (
            <p>Loading reviews...</p>
          ) : (
            <>
              <p className="text-gray-600 mb-4">{filteredAndSortedReviews.length} reviews found</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    isInitiallySaved={savedReviewIds.includes(review.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
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

          <button className="bottom-nav-item bottom-nav-active">
            <Search className="h-6 w-6" />
            <span className="text-xs font-medium">Discover</span>
          </button>

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

          <Link href="/profile">
            <button className="bottom-nav-item bottom-nav-inactive">
              <User className="h-6 w-6" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </Link>
        </div>
      </div>

      {showRateModal && <EnhancedRateModal onClose={() => setShowRateModal(false)} />}
    </div>
  );
}
