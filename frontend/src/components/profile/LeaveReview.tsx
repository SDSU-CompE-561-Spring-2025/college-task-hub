"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {MessageCircle,CheckSquare, X } from "lucide-react";

export default function LeaveReview() {

  {/* Manages the rating */}
  const [rating, setRating] = useState(0);
   

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-full">
          Leave Review
        </button>
      </DialogTrigger>

      <DialogContent className="bg-gray-300 max-w-md p-8">
        <DialogHeader className="flex flex-col items-center mt-5 p-0">
          <DialogTitle className="text-2xl">Leave a Review</DialogTitle>
        </DialogHeader>

        <div className="h-px bg-gray-300 my-4" />

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-lg mb-1">Name</label>
            <Input placeholder="First Name" className="rounded-full border-gray-300 px-4 py-2 text-base bg-white" />
          </div>

          {/* Task Completed */}
          <div>
            <label className="flex items-center gap-2 text-lg mb-1">
              Task Completed
              <CheckSquare className="h-5 w-5" />
            </label>
            <Input placeholder="Walked Dog" className="rounded-full border-gray-300 px-4 py-2 text-base bg-white" />
          </div>

          {/* Review */}
          <div>
            <label className="block text-lg mb-1 flex items-center gap-2">
              Review <MessageCircle className="h-5 w-5" />
            </label>
            <textarea
              placeholder="This experience was..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base bg-white"
            />
          </div>

          {/* Star Rating */}
          <div className="flex items-center justify-center gap-1 text-2xl">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                onClick={() => setRating(index + 1)} 
                className="cursor-pointer"
              >
                {index < rating ? "⭐" : "☆"}
              </span>
            ))}
          </div>

          <div className="flex justify-end">
            {/* Submit Button */}
          <button className="text-right text-black font-semibold py-2">
            Submit
          </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
