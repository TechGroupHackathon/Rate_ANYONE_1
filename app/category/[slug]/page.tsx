"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, MapPin, Heart, Filter, Plus, Home, User, Search } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { EnhancedRateModal } from "@/components/enhanced-rate-modal"
import { SaveToListsModal } from "@/components/save-to-lists-modal"

// Mock data for different categories
const categoryData: Record<string, any[]> = {
  restaurants: [
    {
      id: 1,
      name: "Bella Vista",
      rating: 4.8,
      reviewCount: 456,
      location: "North Beach",
      price: "$$$",
      cuisine: "Italian",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Romantic", "Great View", "Wine Selection"],
      description: "Authentic Italian cuisine with stunning city views and extensive wine selection.",
    },
    {
      id: 2,
      name: "The Garden Bistro",
      rating: 4.5,
      reviewCount: 234,
      location: "Mission District",
      price: "$$",
      cuisine: "American",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Outdoor Seating", "Brunch", "Farm-to-Table"],
      description: "Fresh, locally-sourced ingredients in a beautiful garden setting.",
    },
    {
      id: 3,
      name: "Sakura Sushi",
      rating: 4.7,
      reviewCount: 189,
      location: "Japantown",
      price: "$$$",
      cuisine: "Japanese",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Fresh Fish", "Traditional", "Omakase"],
      description: "Traditional Japanese sushi experience with the freshest ingredients.",
    },
  ],
  cafes: [
    {
      id: 1,
      name: "The Daily Grind",
      rating: 4.5,
      reviewCount: 234,
      location: "Downtown SF",
      price: "$$",
      specialty: "Artisan Coffee",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["WiFi", "Cozy", "Good Coffee"],
      description: "Perfect spot for working with excellent coffee and cozy atmosphere.",
    },
    {
      id: 2,
      name: "Blue Bottle Coffee",
      rating: 4.3,
      reviewCount: 567,
      location: "Hayes Valley",
      price: "$$",
      specialty: "Single Origin",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Minimalist", "Quality", "Single Origin"],
      description: "Minimalist coffee shop focusing on single-origin beans and quality.",
    },
  ],
  movies: [
    {
      id: 1,
      name: "Dune: Part Two",
      rating: 4.7,
      reviewCount: 1205,
      genre: "Sci-Fi",
      director: "Denis Villeneuve",
      year: 2024,
      image: "/placeholder.svg?height=300&width=200",
      tags: ["Epic", "Visually Stunning", "Action"],
      description: "The highly anticipated sequel to Dune, continuing Paul Atreides' journey.",
    },
    {
      id: 2,
      name: "Oppenheimer",
      rating: 4.6,
      reviewCount: 2341,
      genre: "Biography",
      director: "Christopher Nolan",
      year: 2023,
      image: "/placeholder.svg?height=300&width=200",
      tags: ["Historical", "Drama", "IMAX"],
      description: "The story of J. Robert Oppenheimer and the development of the atomic bomb.",
    },
  ],
  colleges: [
    {
      id: 1,
      name: "Stanford University",
      rating: 4.8,
      reviewCount: 1234,
      location: "Stanford, CA",
      type: "Private",
      ranking: "#3 National",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Research", "Tech", "Beautiful Campus"],
      description: "World-renowned research university with beautiful campus and strong tech programs.",
    },
    {
      id: 2,
      name: "UC Berkeley",
      rating: 4.5,
      reviewCount: 2156,
      location: "Berkeley, CA",
      type: "Public",
      ranking: "#1 Public",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Research", "Diverse", "Academic Excellence"],
      description: "Top public research university known for academic excellence and diversity.",
    },
  ],
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const [sortBy, setSortBy] = useState("rating")
  const [showRateModal, setShowRateModal] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [selectedItemForSave, setSelectedItemForSave] = useState<string>("")

  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1)
  const items = categoryData[slug] || []

  const sortedItems = [...items].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "reviews":
        return b.reviewCount - a.reviewCount
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-[#2E2E2E]">{categoryName}</h1>
          </div>
          <Button variant="ghost" size="icon">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Category Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#2E2E2E] mb-2">Best {categoryName}</h2>
          <p className="text-gray-600">
            {items.length} {slug} found
          </p>
        </div>

        {/* Sort Options */}
        <div className="flex space-x-2 mb-6">
          <Button variant={sortBy === "rating" ? "default" : "outline"} size="sm" onClick={() => setSortBy("rating")}>
            Highest Rated
          </Button>
          <Button variant={sortBy === "reviews" ? "default" : "outline"} size="sm" onClick={() => setSortBy("reviews")}>
            Most Reviews
          </Button>
          <Button variant={sortBy === "name" ? "default" : "outline"} size="sm" onClick={() => setSortBy("name")}>
            Name A-Z
          </Button>
        </div>

        {/* Items Grid */}
        <div className="space-y-4">
          {sortedItems.map((item) => (
            <Card key={item.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-[#2E2E2E] text-lg">{item.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 font-medium">{item.rating}</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">{item.reviewCount} reviews</span>
                          {item.price && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600">{item.price}</span>
                            </>
                          )}
                        </div>
                        {item.location && (
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 text-sm">{item.location}</span>
                          </div>
                        )}
                        {item.genre && (
                          <p className="text-gray-600 text-sm mt-1">
                            {item.genre} • {item.director} • {item.year}
                          </p>
                        )}
                        {item.type && (
                          <p className="text-gray-600 text-sm mt-1">
                            {item.type} • {item.ranking}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-[#FF6B6B]"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setSelectedItemForSave(item.name)
                          setShowSaveModal(true)
                        }}
                      >
                        <Heart className="h-5 w-5" />
                      </Button>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">{item.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Rate Modal */}
        {showRateModal && <EnhancedRateModal onClose={() => setShowRateModal(false)} />}

        {/* Save to Lists Modal */}
        {showSaveModal && (
          <SaveToListsModal
            itemName={selectedItemForSave}
            onClose={() => {
              setShowSaveModal(false)
              setSelectedItemForSave("")
            }}
          />
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
    </div>
  )
}
