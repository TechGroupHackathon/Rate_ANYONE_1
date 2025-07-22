"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Search,
  User,
  Star,
  Coffee,
  Film,
  GraduationCap,
  Play,
  Plus,
  Home,
  Heart,
  BookOpen,
  Utensils,
} from "lucide-react"
import Link from "next/link"

// Mock Data
const mockUserData = {
  ratings: [
    {
      id: 1,
      itemName: "The Daily Grind",
      category: "Coffee Shop",
      rating: 4.5,
      date: new Date("2025-01-15"),
      caption: "Great coffee and atmosphere!",
    },
    {
      id: 2,
      itemName: "Inception",
      category: "Movie",
      rating: 5,
      date: new Date("2025-01-14"),
      caption: "Mind-bending masterpiece",
    },
    {
      id: 3,
      itemName: "The Cozy Corner",
      category: "Restaurant",
      rating: 4.2,
      date: new Date("2025-01-13"),
      caption: "Perfect for date nights",
    },
    {
      id: 4,
      itemName: "Stanford University",
      category: "College",
      rating: 4.8,
      date: new Date("2025-01-12"),
      caption: "Excellent academics and campus",
    },
    {
      id: 5,
      itemName: "Blue Bottle Coffee",
      category: "Coffee Shop",
      rating: 4.0,
      date: new Date("2025-01-11"),
      caption: "Good but overpriced",
    },
  ],
  favorites: Array.from({ length: 15 }, (_, i) => ({ id: i + 1 })),
  lists: Array.from({ length: 5 }, (_, i) => ({ id: i + 1 })),
  badges: Array.from({ length: 7 }, (_, i) => ({ id: i + 1 })),
}

// Helper function to calculate stats
const calculateStats = () => {
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const itemsRatedThisWeek = mockUserData.ratings.filter((rating) => rating.date >= oneWeekAgo).length
  const favoritesSaved = mockUserData.favorites.length
  const listsCreated = mockUserData.lists.length
  const badgesEarned = mockUserData.badges.length

  return {
    itemsRatedThisWeek,
    favoritesSaved,
    listsCreated,
    badgesEarned,
  }
}

export default function HomePage() {
  const [isGuest, setIsGuest] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  if (isGuest) {
    return <CalmDashboard />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">RateIt</h1>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl">
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
            Discover What People Are Saying.
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl">
            Ratings and honest opinions — all in your zone. Join millions discovering their next favorite experience.
          </p>
          <div className="flex items-center space-x-4">
            <Button
              size="lg"
              onClick={() => setIsGuest(true)}
              className="calm-button-olive px-8 py-3 text-lg font-medium rounded-full"
            >
              <Play className="h-5 w-5 mr-2" />
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="calm-button-yellow px-8 py-3 text-lg rounded-full border-gray-200 bg-transparent"
            >
              Continue as Guest
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-black mb-8">Browse Categories</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Restaurants", icon: Utensils },
            { name: "Movies", icon: Film },
            { name: "Colleges", icon: GraduationCap },
          ].map((category, index) => (
            <Card key={index} className="calm-card cursor-pointer group border-0">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gray-800 mb-6 flex items-center justify-center">
                  <category.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">{category.name}</h4>
                <p className="text-gray-300">Discover the best {category.name.toLowerCase()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

function CalmDashboard() {
  const [showRateModal, setShowRateModal] = useState(false)
  const [activeTab, setActiveTab] = useState("home")

  // Calculate real stats from mock data
  const stats = calculateStats()

  const quickStats = [
    { label: "This week", value: stats.itemsRatedThisWeek.toString() },
    { label: "Favorites", value: stats.favoritesSaved.toString() },
    { label: "Lists", value: stats.listsCreated.toString() },
    { label: "Badges", value: stats.badgesEarned.toString() },
  ]

  const categories = [
    { name: "Restaurants", icon: Utensils },
    { name: "Movies", icon: Film },
    { name: "Cafes", icon: Coffee },
    { name: "Books", icon: BookOpen },
    { name: "Colleges", icon: GraduationCap },
  ]

  const suggestedActions = [
    { title: "The Daily Grind", subtitle: "Rate this cafe nearby", icon: Coffee },
    { title: "The Midnight Hour", subtitle: "Review your recent watch", icon: Film },
    { title: "Hidden Gems of the City", subtitle: "Create your top 5 local gems list", icon: Heart },
  ]

  const trendingReviews = mockUserData.ratings.slice(0, 6).map((rating, index) => ({
    id: index + 1,
    title: rating.itemName,
    rating: rating.rating,
    category: rating.category,
    caption: rating.caption,
  }))

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Minimal Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-black">RateIt</h1>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-3xl font-bold text-black mb-2">Good evening, Aditya</h2>
            <p className="text-gray-600">Ready to discover something new?</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          <h3 className="text-xl font-semibold text-black mb-4">Your Activity</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <Card key={index} className="calm-card border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Category Shortcuts */}
        <div>
          <h3 className="text-xl font-semibold text-black mb-4">Category Shortcuts</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <Link key={index} href={`/category/${category.name.toLowerCase()}`}>
                <Button
                  variant="outline"
                  className="calm-surface hover:bg-gray-100 text-gray-700 border-gray-200 rounded-full px-4 py-2 flex items-center space-x-2 bg-transparent"
                >
                  <category.icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Suggested Actions */}
        <div>
          <h3 className="text-xl font-semibold text-black mb-4">Suggested Actions</h3>
          <div className="space-y-3">
            {suggestedActions.map((action, index) => (
              <Card key={index} className="calm-surface cursor-pointer hover:bg-gray-100 transition-colors">
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-black">{action.title}</h4>
                    <p className="text-sm text-gray-600">{action.subtitle}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trending Reviews */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-black">Trending Reviews</h3>
            <Button variant="ghost" className="text-gray-600 hover:text-black text-sm">
              Show all
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {trendingReviews.slice(0, 4).map((review) => (
              <Link key={review.id} href={`/item/${review.id}`}>
                <Card className="calm-card cursor-pointer group border-0">
                  <CardContent className="p-6">
                    <div className="w-full h-32 bg-gray-800 rounded-lg mb-4"></div>
                    <h4 className="font-semibold text-white mb-2 group-hover:text-gray-300 transition-colors">
                      {review.title}
                    </h4>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-600"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-300">{review.rating}</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{review.category}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{review.caption}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-2 z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("home")}
            className={`bottom-nav-item ${activeTab === "home" ? "bottom-nav-active" : "bottom-nav-inactive"}`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs font-medium">Home</span>
          </button>

          <Link href="/discover">
            <button
              onClick={() => setActiveTab("discover")}
              className={`bottom-nav-item ${activeTab === "discover" ? "bottom-nav-active" : "bottom-nav-inactive"}`}
            >
              <Search className="h-6 w-6" />
              <span className="text-xs font-medium">Discover</span>
            </button>
          </Link>

          <button onClick={() => setShowRateModal(true)} className="bottom-nav-item">
            <div className="w-12 h-12 calm-button-yellow rounded-full flex items-center justify-center mb-1">
              <Plus className="h-6 w-6 text-gray-800" />
            </div>
            <span className="text-xs font-medium text-gray-800">Rate</span>
          </button>

          <Link href="/lists">
            <button
              onClick={() => setActiveTab("lists")}
              className={`bottom-nav-item ${activeTab === "lists" ? "bottom-nav-active" : "bottom-nav-inactive"}`}
            >
              <Heart className="h-6 w-6" />
              <span className="text-xs font-medium">Lists</span>
            </button>
          </Link>

          <Link href="/profile">
            <button
              onClick={() => setActiveTab("profile")}
              className={`bottom-nav-item ${activeTab === "profile" ? "bottom-nav-active" : "bottom-nav-inactive"}`}
            >
              <User className="h-6 w-6" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Rate Modal */}
      {showRateModal && <CalmRateModal onClose={() => setShowRateModal(false)} />}
    </div>
  )
}

function CalmRateModal({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState(0)
  const [caption, setCaption] = useState("")

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md border border-gray-100 shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black">Rate Your Experience</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-black">
              <span className="text-xl">×</span>
            </Button>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <h3 className="font-medium text-black mb-4">How was it?</h3>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-10 w-10 cursor-pointer transition-colors ${
                    star <= rating ? "text-yellow-400 fill-current" : "text-gray-300 hover:text-gray-400"
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          {/* Caption */}
          <div className="mb-6">
            <h3 className="font-medium text-black mb-3">Share your thoughts</h3>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What made this experience special?"
              className="w-full h-24 p-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder:text-gray-500 resize-none focus:border-gray-300 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-200 text-gray-600 hover:text-black bg-transparent"
            >
              Cancel
            </Button>
            <Button onClick={onClose} className="flex-1 calm-button-olive">
              Share Review
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
