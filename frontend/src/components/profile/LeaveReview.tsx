"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {MessageCircle,CheckSquare, X } from "lucide-react";
import { submitReview } from "@/lib/api/submitReview";
import { Button } from "@/components/ui/button";

interface Review {
  reviewerName: string;
  reviewerProfilePicture: string;
  rating: number;
  comment: string;
  jobTitle: string;
}

interface LeaveReviewProps {
  receiverId: number;
  giverId: number;
  onReviewSubmit: (review: Review) => void;
}

export default function LeaveReview({ receiverId,giverId,onReviewSubmit }: LeaveReviewProps) {

  {/* Manages the rating */}
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [taskCompleted, setTaskCompleted] = useState("");
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);
  
  
  const handleSubmit = async () => {
    const backendReview = {
      job_title: taskCompleted,
      rating,
      comment,
      giver_id: giverId,    
      receiver_id: receiverId, 
      created_at: new Date().toISOString() 
    };

    // Convert the backend review to the frontend review format for jobTitle vs job_title
    const frontendReview: Review = {
      reviewerName: name,
      reviewerProfilePicture: `https://randomuser.me/api/portraits/${Math.random() < 0.5 ? "men" : "women"}/${Math.floor(Math.random() * 100)}.jpg`,
      jobTitle: taskCompleted, 
      rating,
      comment,
    };

    try {
      console.log("Sending review payload:", backendReview);
      await submitReview(backendReview);
      onReviewSubmit(frontendReview);
      alert("Review submitted!");
      setOpen(false); 
    } catch (err) {
      alert("Failed to submit review.");
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="submit" className="bg-sky-500 hover:bg-sky-600">Leave Review</Button>
      </DialogTrigger>

      <DialogContent className="bg-gray-100 max-w-xl p-6 rounded-lg">
        <DialogHeader className="flex flex-col items-center mt-5 p-0">
          <DialogTitle className="text-2xl font-bold mb-6">Leave a Review</DialogTitle>
        </DialogHeader>

        <div className="h-px bg-black my-1" />

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-medium font-medium text-black mb-1">Name</label>
            <Input
              placeholder="First Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow-sm rounded-md border border-gray-300 bg-gray-100 rounded-md px-4 py-2 text-base w-full"
            />
          </div>
          {/* Task Completed */}
          <div>
            <label className="flex items-center gap-2 text-medium font-medium text-black mb-1">
              Task Completed
              <CheckSquare className="h-4 w-4" />
            </label>
            <Input
              placeholder="Walked Dog"
              value={taskCompleted}
              onChange={(e) => setTaskCompleted(e.target.value)}
              className="shadow-sm rounded-md border border-gray-300 bg-gray-100 rounded-md px-4 py-2 text-base w-full"
            />
          </div>
          {/* Review */}
          <div>
            <label className="flex items-center gap-2 text-medium font-medium text-black mb-1">
              Review <MessageCircle className="h-4 w-4" />
            </label>
            <Textarea
              placeholder="This experience was..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="shadow-sm rounded-md border border-gray-300 bg-gray-100 rounded-md px-4 py-2 text-base w-full"
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
            {/* Submit Button*/}
          <Button onClick={handleSubmit} type="submit" className="bg-sky-500 hover:bg-sky-600">Submit</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
