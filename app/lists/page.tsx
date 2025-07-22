"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Plus, Heart, Coffee, Film, Home, Search, User } from "lucide-react"
import Link from "next/link"

const mockLists = [
  { id: 1, name: "Best Coffee Shops in SF", itemCount: 8, icon: Coffee },
  { id: 2, name: "Must-Watch Movies 2024", itemCount: 12, icon: Film },
  { id: 3, name: "Hidden Restaurant Gems", itemCount: 7, icon: Heart },
]

export default function ListsPage() {
  const [showNewListModal, setShowNewListModal] = useState(false)

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
          <h1 className="text-2xl font-bold text-black">Your Lists</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-black mb-2">Made for you</h2>
            <p className="text-gray-600">Your personal collections</p>
          </div>
          <Button onClick={() => setShowNewListModal(true)} className="calm-button-olive px-6 py-3 rounded-full">
            <Plus className="h-5 w-5 mr-2" />
            Create List
          </Button>
        </div>

        {/* Lists Grid */}
        {mockLists.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockLists.map((list) => (
              <Card key={list.id} className="calm-card cursor-pointer group border-0">
                <CardContent className="p-6">
                  <div className="w-full h-40 bg-gray-800 rounded-xl mb-4 flex items-center justify-center">
                    <list.icon className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2 group-hover:text-gray-300 transition-colors">
                    {list.name}
                  </h3>
                  <p className="text-gray-300 text-sm">{list.itemCount} items</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Heart className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">Create your first list</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Lists make it easy to save your favorite places and share them with friends.
            </p>
            <Button onClick={() => setShowNewListModal(true)} className="calm-button-olive px-8 py-3 rounded-full">
              Create List
            </Button>
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

          <button className="bottom-nav-item">
            <div className="w-12 h-12 calm-button-yellow rounded-full flex items-center justify-center mb-1">
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
    </div>
  )
}
