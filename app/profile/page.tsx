"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Settings, Star, MoreHorizontal, Home, Search, Plus, Heart, User } from "lucide-react"
import Link from "next/link"
import { EnhancedRateModal } from "@/components/enhanced-rate-modal"

const mockUserData = {
  name: "Ethan Carter",
  location: "San Francisco, CA",
  rating: 4.8,
  totalRatings: 123,
  followers: 1234,
  following: 567,
}

const recentActivity = [
  { id: 1, name: "The Daily Grind", rating: 4.5, date: "2 days ago" },
  { id: 2, name: "Inception", rating: 5, date: "1 week ago" },
  { id: 3, name: "Bella Vista", rating: 4.2, date: "2 weeks ago" },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showRateModal, setShowRateModal] = useState(false)

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
            EC
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-black mb-2">{mockUserData.name}</h2>
            <p className="text-gray-600 mb-4">{mockUserData.location}</p>
            <div className="flex items-center space-x-6 mb-6">
              <div className="text-center">
                <div className="text-xl font-bold text-black">{mockUserData.totalRatings}</div>
                <div className="text-sm text-gray-600">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-black">{mockUserData.followers}</div>
                <div className="text-sm text-gray-600">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-black">{mockUserData.following}</div>
                <div className="text-sm text-gray-600">Following</div>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                <span className="text-lg font-bold text-black">{mockUserData.rating}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="calm-button-olive px-6 py-2 rounded-full">Follow</Button>
              <Button
                variant="outline"
                className="calm-button-yellow px-6 py-2 rounded-full border-gray-200 bg-transparent"
              >
                Message
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
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
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value="lists"
              className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-600 rounded-lg px-4 py-2"
            >
              Lists
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-black mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((item) => (
                    <Card key={item.id} className="calm-card cursor-pointer group border-0">
                      <CardContent className="p-4 flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-800 rounded-lg"></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white group-hover:text-gray-300 transition-colors">
                            {item.name}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < item.rating ? "text-yellow-400 fill-current" : "text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-300">{item.date}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
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

      {/* Rate Modal */}
      {showRateModal && <EnhancedRateModal onClose={() => setShowRateModal(false)} />}
    </div>
  )
}
