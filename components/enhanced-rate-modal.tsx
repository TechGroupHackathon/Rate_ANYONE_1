"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Star, X, Paperclip, Video } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { userSession } from "@/lib/userAuth";

interface EnhancedRateModalProps {
  onClose: () => void;
}

const categories = ["Restaurant", "Movie", "Coffee Shop", "Book", "Product", "Other"];

export function EnhancedRateModal({ onClose }: EnhancedRateModalProps) {
  const [rating, setRating] = useState(3);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [keywords, setKeywords] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = Array.from(event.target.files || []);

    if (files.length + mediaFiles.length > 3) {
      setError("You can upload a maximum of 3 files.");
      return;
    }

    const validFiles = files.filter(file => {
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      if (!isValidSize) {
        setError(`File "${file.name}" exceeds the 10MB size limit.`);
      }
      return isValidSize;
    });

    setMediaFiles(prevFiles => [...prevFiles, ...validFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setMediaFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (mediaFiles.length === 0) {
      setError("Please upload at least one image or video.");
      return;
    }
    if (!category) {
      setError("Please select a category.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const user = userSession.getUser();
    if (!user) {
      setError("You must be logged in to post a review.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("rating", rating.toString());
    formData.append("category", category);
    formData.append("userId", user.id);
    if (category === "other") {
      formData.append("keywords", keywords);
    }
    mediaFiles.forEach(file => {
      formData.append("media", file);
    });

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      console.log("Review submitted successfully");
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black">Rate Your Moment</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-black">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Media Upload */}
          <div className="mb-6">
            <h3 className="font-medium text-black mb-3">Capture Experience</h3>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/mov"
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2"
              disabled={mediaFiles.length >= 3}
            >
              <Paperclip className="h-4 w-4 mr-2" />
              Upload Media ({mediaFiles.length}/3)
            </Button>
            
            <div className="grid grid-cols-3 gap-2 mt-4">
              {mediaFiles.map((file, index) => (
                <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
                      <Video className="h-8 w-8 text-gray-500" />
                      <span className="text-xs text-gray-500 mt-1 px-1 text-center truncate">{file.name}</span>
                    </div>
                  )}
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="mb-6">
            <h3 className="font-medium text-black mb-3">Select a Category</h3>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a category..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat.toLowerCase().replace(" ", "_")}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {category === "other" && (
            <div className="mb-6">
              <h3 className="font-medium text-black mb-3">Add Keywords</h3>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Enter keywords separated by commas"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder:text-gray-500 focus:border-gray-300 focus:outline-none"
              />
            </div>
          )}

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

          {/* Rating Bar */}
          <div className="mb-6">
            <h3 className="font-medium text-black mb-3">Rating Bar</h3>
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
          </div>
          
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || mediaFiles.length === 0 || !category}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full font-medium"
          >
            {isSubmitting ? "Submitting..." : "🎉 Share Your Experience"}
          </Button>
        </div>
      </div>
    </div>
  );
}
