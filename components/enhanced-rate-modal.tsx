"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface EnhancedRateModalProps {
  onClose: () => void
}

export function EnhancedRateModal({ onClose }: EnhancedRateModalProps) {
  const [rating, setRating] = useState(3)
  const [caption, setCaption] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [visibility, setVisibility] = useState("public")
  const [allowComments, setAllowComments] = useState(true)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const availableTags = ["Clean place", "Budget-friendly", "Cozy", "Loud", "Staff", "Music", "Parking"]

  const sampleImages = [
    "/placeholder.svg?height=120&width=120",
    "/placeholder.svg?height=120&width=120",
    "/placeholder.svg?height=120&width=120",
  ]

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleImageUpload = () => {
    // Simulate image upload
    setUploadedImages(sampleImages)
  }

  const handleSubmit = () => {
    // Here you would normally save the rating data
    console.log("Rating submitted:", {
      rating,
      caption,
      selectedTags,
      visibility,
      allowComments,
      uploadedImages,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black">Rate Your Moment</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-black">
              <span className="text-xl">×</span>
            </Button>
          </div>

          {/* Capture Experience */}
          <div className="mb-6">
            <h3 className="font-medium text-black mb-3">Capture Experience</h3>
            <div className="flex space-x-3 mb-4">
              <Button
                onClick={handleImageUpload}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2"
              >
                📷 Upload Photo
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 rounded-full py-2 bg-transparent"
              >
                📷 Snap Live
              </Button>
            </div>

            {/* Image Gallery */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Caption */}
          <div className="mb-6">
            <h3 className="font-medium text-black mb-3">Write Your Caption / Feedback</h3>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Share your experience..."
              className="w-full h-24 p-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder:text-gray-500 resize-none focus:border-gray-300 focus:outline-none"
            />
          </div>

          {/* Contextual Tags */}
          <div className="mb-6">
            <h3 className="font-medium text-black mb-3">Add Contextual Tags (Optional Chips)</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-yellow-400 text-gray-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
              <button className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200">
                Add Tag
              </button>
            </div>
          </div>

          {/* Rating Bar */}
          <div className="mb-6">
            <h3 className="font-medium text-black mb-3">Rating Bar (Optional)</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Would you rate this out of 5?</span>
              <span className="text-lg font-bold text-black">{rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer transition-colors ${
                    star <= rating ? "text-yellow-500 fill-current" : "text-gray-300 hover:text-gray-400"
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${(rating / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Audience & Visibility */}
          <div className="mb-6">
            <h3 className="font-medium text-black mb-3">Audience & Visibility</h3>
            <div className="flex space-x-2 mb-4">
              {[
                { key: "public", label: "🌐 Public" },
                { key: "followers", label: "👥 Followers" },
                { key: "private", label: "🔒 Private Log" },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setVisibility(option.key)}
                  className={`px-3 py-2 rounded-full text-sm transition-colors ${
                    visibility === option.key
                      ? "bg-yellow-400 text-gray-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Allow comments</span>
              <button
                onClick={() => setAllowComments(!allowComments)}
                className={`w-12 h-6 rounded-full transition-colors ${allowComments ? "bg-blue-500" : "bg-gray-300"}`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    allowComments ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full font-medium"
          >
            🎉 Share Your Experience
          </Button>
        </div>
      </div>
    </div>
  )
}
